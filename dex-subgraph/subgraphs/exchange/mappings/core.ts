/* eslint-disable prefer-const */
import { BigInt, BigDecimal, store, Address } from "@graphprotocol/graph-ts";
import {
  Pair,
  Token,
  PancakeFactory,
  Transaction,
  Mint as MintEvent,
  Burn as BurnEvent,
  Swap as SwapEvent,
  Bundle,
} from "../generated/schema";
import { Mint, Burn, Swap, Transfer, Sync } from "../generated/templates/Pair/Pair";
import { Factory as FactoryContract } from "../generated/Factory/Factory";
import { handleBlock } from "./blocks";
import { updatePairDayData, updateTokenDayData, updatePancakeDayData, updatePairHourData } from "./dayUpdates";
import { convertTokenToDecimal, ADDRESS_ZERO, FACTORY_ADDRESS, ONE_BI, ZERO_BD, BI_18 } from "./utils";

// Pricing constants
let ONE_BD = BigDecimal.fromString("1");
let WMON_ADDRESS = "0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899";
let WHITELIST: string[] = ["0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899"];
let MINIMUM_LIQUIDITY_THRESHOLD_BNB = BigDecimal.fromString("10");
let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS));

// Pricing functions inlined
function getBnbPriceInUSD(): BigDecimal {
  return ONE_BD;
}

function isInWhitelist(tokenId: string): boolean {
  for (let i = 0; i < WHITELIST.length; i++) {
    if (WHITELIST[i] == tokenId) {
      return true;
    }
  }
  return false;
}

function findBnbPerToken(token: Token): BigDecimal {
  if (token.id == WMON_ADDRESS) {
    return ONE_BD;
  }
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
    if (pairAddress.toHex() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHex());
      if (pair !== null) {
        if (pair.token0 == token.id && pair.reserveBNB.gt(MINIMUM_LIQUIDITY_THRESHOLD_BNB)) {
          let token1 = Token.load(pair.token1);
          if (token1 !== null && token1.derivedBNB !== null) {
            return pair.token1Price.times(token1.derivedBNB!);
          }
        }
        if (pair.token1 == token.id && pair.reserveBNB.gt(MINIMUM_LIQUIDITY_THRESHOLD_BNB)) {
          let token0 = Token.load(pair.token0);
          if (token0 !== null && token0.derivedBNB !== null) {
            return pair.token0Price.times(token0.derivedBNB!);
          }
        }
      }
    }
  }
  return ZERO_BD;
}

function getTrackedVolumeUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let derivedBNB0 = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let derivedBNB1 = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  let price0 = derivedBNB0.times(bundle.bnbPrice);
  let price1 = derivedBNB1.times(bundle.bnbPrice);

  let token0InWhitelist = isInWhitelist(token0.id);
  let token1InWhitelist = isInWhitelist(token1.id);

  if (token0InWhitelist && token1InWhitelist) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
  }
  if (token0InWhitelist && !token1InWhitelist) {
    return tokenAmount0.times(price0);
  }
  if (!token0InWhitelist && token1InWhitelist) {
    return tokenAmount1.times(price1);
  }
  return ZERO_BD;
}

function getTrackedLiquidityUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let derivedBNB0 = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let derivedBNB1 = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  let price0 = derivedBNB0.times(bundle.bnbPrice);
  let price1 = derivedBNB1.times(bundle.bnbPrice);

  let token0InWhitelist = isInWhitelist(token0.id);
  let token1InWhitelist = isInWhitelist(token1.id);

  if (token0InWhitelist && token1InWhitelist) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }
  if (token0InWhitelist && !token1InWhitelist) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }
  if (!token0InWhitelist && token1InWhitelist) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }
  return ZERO_BD;
}

function isCompleteMint(mintId: string): boolean {
  let mint = MintEvent.load(mintId);
  if (mint === null) {
    return false;
  }
  return mint.sender !== null;
}

export function handleTransfer(event: Transfer): void {
  if (event.params.to.toHex() == ADDRESS_ZERO && event.params.value.equals(BigInt.fromI32(1000))) {
    return;
  }

  let pair = Pair.load(event.address.toHex());
  if (pair === null) {
    return;
  }

  let value = convertTokenToDecimal(event.params.value, BI_18);

  let transaction = Transaction.load(event.transaction.hash.toHex());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHex());
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.mints = [];
    transaction.burns = [];
    transaction.swaps = [];
  }

  let mints = transaction.mints;
  if (event.params.from.toHex() == ADDRESS_ZERO) {
    pair.totalSupply = pair.totalSupply.plus(value);
    pair.save();

    if (mints.length === 0 || isCompleteMint(mints[mints.length - 1])) {
      let mint = new MintEvent(
        event.transaction.hash.toHex().concat("-").concat(BigInt.fromI32(mints.length).toString())
      );
      mint.transaction = transaction.id;
      mint.pair = pair.id;
      mint.to = event.params.to;
      mint.liquidity = value;
      mint.timestamp = transaction.timestamp;
      mint.transaction = transaction.id;
      mint.save();

      transaction.mints = mints.concat([mint.id]);
      transaction.save();
    }
  }

  if (event.params.to.toHex() == pair.id) {
    let burns = transaction.burns;
    let burn = new BurnEvent(
      event.transaction.hash.toHex().concat("-").concat(BigInt.fromI32(burns.length).toString())
    );
    burn.transaction = transaction.id;
    burn.pair = pair.id;
    burn.liquidity = value;
    burn.timestamp = transaction.timestamp;
    burn.to = event.params.to;
    burn.sender = event.params.from;
    burn.needsComplete = true;
    burn.transaction = transaction.id;
    burn.save();

    burns.push(burn.id);
    transaction.burns = burns;
    transaction.save();
  }

  if (event.params.to.toHex() == ADDRESS_ZERO && event.params.from.toHex() == pair.id) {
    pair.totalSupply = pair.totalSupply.minus(value);
    pair.save();

    let burns = transaction.burns;
    let burn: BurnEvent;
    if (burns.length > 0) {
      let currentBurn = BurnEvent.load(burns[burns.length - 1]);
      if (currentBurn !== null && currentBurn.needsComplete) {
        burn = currentBurn;
      } else {
        burn = new BurnEvent(
          event.transaction.hash.toHex().concat("-").concat(BigInt.fromI32(burns.length).toString())
        );
        burn.transaction = transaction.id;
        burn.needsComplete = false;
        burn.pair = pair.id;
        burn.liquidity = value;
        burn.transaction = transaction.id;
        burn.timestamp = transaction.timestamp;
      }
    } else {
      burn = new BurnEvent(event.transaction.hash.toHex().concat("-").concat(BigInt.fromI32(burns.length).toString()));
      burn.transaction = transaction.id;
      burn.needsComplete = false;
      burn.pair = pair.id;
      burn.liquidity = value;
      burn.transaction = transaction.id;
      burn.timestamp = transaction.timestamp;
    }

    if (mints.length !== 0 && !isCompleteMint(mints[mints.length - 1])) {
      let mint = MintEvent.load(mints[mints.length - 1]);
      if (mint !== null) {
        burn.feeTo = mint.to;
        burn.feeLiquidity = mint.liquidity;
        store.remove("Mint", mints[mints.length - 1]);
        mints.pop();
        transaction.mints = mints;
        transaction.save();
      }
    }
    burn.save();
    if (burn.needsComplete) {
      burns[burns.length - 1] = burn.id;
    } else {
      burns.push(burn.id);
    }
    transaction.burns = burns;
    transaction.save();
  }

  transaction.save();
  handleBlock(event.block);
}


export function handleSync(event: Sync): void {
  let pair = Pair.load(event.address.toHex());
  if (pair === null) {
    return;
  }
  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  let pancake = PancakeFactory.load(FACTORY_ADDRESS);
  if (token0 === null || token1 === null || pancake === null) {
    return;
  }

  let trackedReserveBNB = pair.trackedReserveBNB !== null ? pair.trackedReserveBNB! : ZERO_BD;
  pancake.totalLiquidityBNB = pancake.totalLiquidityBNB.minus(trackedReserveBNB);

  token0.totalLiquidity = token0.totalLiquidity.minus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.minus(pair.reserve1);

  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals);
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals);

  if (pair.reserve1.notEqual(ZERO_BD)) pair.token0Price = pair.reserve0.div(pair.reserve1);
  else pair.token0Price = ZERO_BD;
  if (pair.reserve0.notEqual(ZERO_BD)) pair.token1Price = pair.reserve1.div(pair.reserve0);
  else pair.token1Price = ZERO_BD;

  let bundle = Bundle.load("1");
  if (bundle === null) {
    return;
  }
  bundle.bnbPrice = getBnbPriceInUSD();
  bundle.save();

  let t0DerivedBNB = findBnbPerToken(token0 as Token);
  token0.derivedBNB = t0DerivedBNB;
  token0.derivedUSD = t0DerivedBNB.times(bundle.bnbPrice);
  token0.save();

  let t1DerivedBNB = findBnbPerToken(token1 as Token);
  token1.derivedBNB = t1DerivedBNB;
  token1.derivedUSD = t1DerivedBNB.times(bundle.bnbPrice);
  token1.save();

  let trackedLiquidityBNB: BigDecimal;
  if (bundle.bnbPrice.notEqual(ZERO_BD)) {
    trackedLiquidityBNB = getTrackedLiquidityUSD(
      bundle as Bundle,
      pair.reserve0,
      token0 as Token,
      pair.reserve1,
      token1 as Token
    ).div(bundle.bnbPrice);
  } else {
    trackedLiquidityBNB = ZERO_BD;
  }

  pair.trackedReserveBNB = trackedLiquidityBNB;
  let t0DerivedBNBVal = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let t1DerivedBNBVal = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  pair.reserveBNB = pair.reserve0.times(t0DerivedBNBVal).plus(pair.reserve1.times(t1DerivedBNBVal));
  pair.reserveUSD = pair.reserveBNB.times(bundle.bnbPrice);

  pancake.totalLiquidityBNB = pancake.totalLiquidityBNB.plus(trackedLiquidityBNB);
  pancake.totalLiquidityUSD = pancake.totalLiquidityBNB.times(bundle.bnbPrice);

  token0.totalLiquidity = token0.totalLiquidity.plus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.plus(pair.reserve1);

  pair.save();
  pancake.save();
  token0.save();
  token1.save();

  handleBlock(event.block);
}

export function handleMint(event: Mint): void {
  let transaction = Transaction.load(event.transaction.hash.toHex());
  if (transaction === null) {
    return;
  }
  let mints = transaction.mints;
  if (mints.length === 0) {
    return;
  }
  let mint = MintEvent.load(mints[mints.length - 1]);
  if (mint === null) {
    return;
  }

  let pair = Pair.load(event.address.toHex());
  let pancake = PancakeFactory.load(FACTORY_ADDRESS);
  if (pair === null || pancake === null) {
    return;
  }

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  if (token0 === null || token1 === null) {
    return;
  }

  let token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals);
  let token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals);

  token0.totalTransactions = token0.totalTransactions.plus(ONE_BI);
  token1.totalTransactions = token1.totalTransactions.plus(ONE_BI);

  let bundle = Bundle.load("1");
  if (bundle === null) {
    return;
  }
  let mintDerivedBNB0 = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let mintDerivedBNB1 = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  let amountTotalUSD = mintDerivedBNB1.times(token1Amount).plus(mintDerivedBNB0.times(token0Amount)).times(bundle.bnbPrice);

  pair.totalTransactions = pair.totalTransactions.plus(ONE_BI);
  pancake.totalTransactions = pancake.totalTransactions.plus(ONE_BI);

  token0.save();
  token1.save();
  pair.save();
  pancake.save();

  mint.sender = event.params.sender;
  mint.amount0 = token0Amount as BigDecimal;
  mint.amount1 = token1Amount as BigDecimal;
  mint.logIndex = event.logIndex;
  mint.amountUSD = amountTotalUSD as BigDecimal;
  mint.save();

  updatePairDayData(event);
  updatePairHourData(event);
  updatePancakeDayData(event);
  updateTokenDayData(token0 as Token, event);
  updateTokenDayData(token1 as Token, event);

  handleBlock(event.block);
}

export function handleBurn(event: Burn): void {
  let transaction = Transaction.load(event.transaction.hash.toHex());
  if (transaction === null) {
    return;
  }

  let burns = transaction.burns;
  if (burns.length === 0) {
    return;
  }
  let burn = BurnEvent.load(burns[burns.length - 1]);
  if (burn === null) {
    return;
  }

  let pair = Pair.load(event.address.toHex());
  let pancake = PancakeFactory.load(FACTORY_ADDRESS);
  if (pair === null || pancake === null) {
    return;
  }

  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  if (token0 === null || token1 === null) {
    return;
  }
  let token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals);
  let token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals);

  token0.totalTransactions = token0.totalTransactions.plus(ONE_BI);
  token1.totalTransactions = token1.totalTransactions.plus(ONE_BI);

  let bundle = Bundle.load("1");
  if (bundle === null) {
    return;
  }
  let burnDerivedBNB0 = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let burnDerivedBNB1 = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  let amountTotalUSD = burnDerivedBNB1.times(token1Amount).plus(burnDerivedBNB0.times(token0Amount)).times(bundle.bnbPrice);

  pancake.totalTransactions = pancake.totalTransactions.plus(ONE_BI);
  pair.totalTransactions = pair.totalTransactions.plus(ONE_BI);

  token0.save();
  token1.save();
  pair.save();
  pancake.save();

  burn.amount0 = token0Amount as BigDecimal;
  burn.amount1 = token1Amount as BigDecimal;
  burn.logIndex = event.logIndex;
  burn.amountUSD = amountTotalUSD as BigDecimal;
  burn.save();

  updatePairDayData(event);
  updatePairHourData(event);
  updatePancakeDayData(event);
  updateTokenDayData(token0 as Token, event);
  updateTokenDayData(token1 as Token, event);

  handleBlock(event.block);
}


export function handleSwap(event: Swap): void {
  let pair = Pair.load(event.address.toHex());
  if (pair === null) {
    return;
  }
  let token0 = Token.load(pair.token0);
  let token1 = Token.load(pair.token1);
  if (token0 === null || token1 === null) {
    return;
  }
  let amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals);
  let amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals);

  let amount0Total = amount0Out.plus(amount0In);
  let amount1Total = amount1Out.plus(amount1In);

  let bundle = Bundle.load("1");
  if (bundle === null) {
    return;
  }

  let swapDerivedBNB0 = token0.derivedBNB !== null ? token0.derivedBNB! : ZERO_BD;
  let swapDerivedBNB1 = token1.derivedBNB !== null ? token1.derivedBNB! : ZERO_BD;
  let derivedAmountBNB = swapDerivedBNB1.times(amount1Total).plus(swapDerivedBNB0.times(amount0Total)).div(BigDecimal.fromString("2"));
  let derivedAmountUSD = derivedAmountBNB.times(bundle.bnbPrice);

  let trackedAmountUSD = getTrackedVolumeUSD(bundle as Bundle, amount0Total, token0 as Token, amount1Total, token1 as Token);

  let trackedAmountBNB: BigDecimal;
  if (bundle.bnbPrice.equals(ZERO_BD)) {
    trackedAmountBNB = ZERO_BD;
  } else {
    trackedAmountBNB = trackedAmountUSD.div(bundle.bnbPrice);
  }

  token0.tradeVolume = token0.tradeVolume.plus(amount0In.plus(amount0Out));
  token0.tradeVolumeUSD = token0.tradeVolumeUSD.plus(trackedAmountUSD);
  token0.untrackedVolumeUSD = token0.untrackedVolumeUSD.plus(derivedAmountUSD);

  token1.tradeVolume = token1.tradeVolume.plus(amount1In.plus(amount1Out));
  token1.tradeVolumeUSD = token1.tradeVolumeUSD.plus(trackedAmountUSD);
  token1.untrackedVolumeUSD = token1.untrackedVolumeUSD.plus(derivedAmountUSD);

  token0.totalTransactions = token0.totalTransactions.plus(ONE_BI);
  token1.totalTransactions = token1.totalTransactions.plus(ONE_BI);

  pair.volumeUSD = pair.volumeUSD.plus(trackedAmountUSD);
  pair.volumeToken0 = pair.volumeToken0.plus(amount0Total);
  pair.volumeToken1 = pair.volumeToken1.plus(amount1Total);
  pair.untrackedVolumeUSD = pair.untrackedVolumeUSD.plus(derivedAmountUSD);
  pair.totalTransactions = pair.totalTransactions.plus(ONE_BI);
  pair.save();

  let pancake = PancakeFactory.load(FACTORY_ADDRESS);
  if (pancake === null) {
    return;
  }
  pancake.totalVolumeUSD = pancake.totalVolumeUSD.plus(trackedAmountUSD);
  pancake.totalVolumeBNB = pancake.totalVolumeBNB.plus(trackedAmountBNB);
  pancake.untrackedVolumeUSD = pancake.untrackedVolumeUSD.plus(derivedAmountUSD);
  pancake.totalTransactions = pancake.totalTransactions.plus(ONE_BI);

  pair.save();
  token0.save();
  token1.save();
  pancake.save();

  let transaction = Transaction.load(event.transaction.hash.toHex());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHex());
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.mints = [];
    transaction.swaps = [];
    transaction.burns = [];
  }
  let swaps = transaction.swaps;
  let swap = new SwapEvent(event.transaction.hash.toHex().concat("-").concat(BigInt.fromI32(swaps.length).toString()));

  swap.transaction = transaction.id;
  swap.pair = pair.id;
  swap.timestamp = transaction.timestamp;
  swap.transaction = transaction.id;
  swap.sender = event.params.sender;
  swap.amount0In = amount0In;
  swap.amount1In = amount1In;
  swap.amount0Out = amount0Out;
  swap.amount1Out = amount1Out;
  swap.to = event.params.to;
  swap.from = event.transaction.from;
  swap.logIndex = event.logIndex;
  swap.amountUSD = trackedAmountUSD.equals(ZERO_BD) ? derivedAmountUSD : trackedAmountUSD;
  swap.save();

  swaps.push(swap.id);
  transaction.swaps = swaps;
  transaction.save();

  let pairDayData = updatePairDayData(event);
  let pairHourData = updatePairHourData(event);
  let pancakeDayData = updatePancakeDayData(event);
  let token0DayData = updateTokenDayData(token0 as Token, event);
  let token1DayData = updateTokenDayData(token1 as Token, event);

  pancakeDayData.dailyVolumeUSD = pancakeDayData.dailyVolumeUSD.plus(trackedAmountUSD);
  pancakeDayData.dailyVolumeBNB = pancakeDayData.dailyVolumeBNB.plus(trackedAmountBNB);
  pancakeDayData.dailyVolumeUntracked = pancakeDayData.dailyVolumeUntracked.plus(derivedAmountUSD);
  pancakeDayData.save();

  pairDayData.dailyVolumeToken0 = pairDayData.dailyVolumeToken0.plus(amount0Total);
  pairDayData.dailyVolumeToken1 = pairDayData.dailyVolumeToken1.plus(amount1Total);
  pairDayData.dailyVolumeUSD = pairDayData.dailyVolumeUSD.plus(trackedAmountUSD);
  pairDayData.save();

  pairHourData.hourlyVolumeToken0 = pairHourData.hourlyVolumeToken0.plus(amount0Total);
  pairHourData.hourlyVolumeToken1 = pairHourData.hourlyVolumeToken1.plus(amount1Total);
  pairHourData.hourlyVolumeUSD = pairHourData.hourlyVolumeUSD.plus(trackedAmountUSD);
  pairHourData.save();

  token0DayData.dailyVolumeToken = token0DayData.dailyVolumeToken.plus(amount0Total);
  token0DayData.dailyVolumeBNB = token0DayData.dailyVolumeBNB.plus(amount0Total.times(swapDerivedBNB0));
  token0DayData.dailyVolumeUSD = token0DayData.dailyVolumeUSD.plus(amount0Total.times(swapDerivedBNB0).times(bundle.bnbPrice));
  token0DayData.save();

  token1DayData.dailyVolumeToken = token1DayData.dailyVolumeToken.plus(amount1Total);
  token1DayData.dailyVolumeBNB = token1DayData.dailyVolumeBNB.plus(amount1Total.times(swapDerivedBNB1));
  token1DayData.dailyVolumeUSD = token1DayData.dailyVolumeUSD.plus(amount1Total.times(swapDerivedBNB1).times(bundle.bnbPrice));
  token1DayData.save();

  handleBlock(event.block);
}
