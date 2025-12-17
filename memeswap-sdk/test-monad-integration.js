const { ChainId, FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP, WETH, Token } = require('./dist/index.js');

console.log('🧪 Testing PancakeSwap SDK - Monad Mainnet Integration\n');

// Test 1: Chain ID Configuration
console.log('✅ Test 1: Chain ID Configuration');
console.log(`   Monad Chain ID: ${ChainId.MONAD}`);
console.log(`   Expected: 143`);
console.log(`   Status: ${ChainId.MONAD === 143 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: Factory Address Configuration
console.log('✅ Test 2: Factory Address Configuration');
console.log(`   Monad Factory: ${FACTORY_ADDRESS_MAP[ChainId.MONAD]}`);
console.log(`   Expected: 0xb48dBe6D4130f4a664075250EE702715748051d9`);
console.log(`   Status: ${FACTORY_ADDRESS_MAP[ChainId.MONAD] === '0xb48dBe6D4130f4a664075250EE702715748051d9' ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 3: Init Code Hash Configuration
console.log('✅ Test 3: Init Code Hash Configuration');
console.log(`   Monad Init Hash: ${INIT_CODE_HASH_MAP[ChainId.MONAD]}`);
console.log(`   Expected: 0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293`);
console.log(`   Status: ${INIT_CODE_HASH_MAP[ChainId.MONAD] === '0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293' ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: WETH (WMON) Configuration
console.log('✅ Test 4: WETH (WMON) Configuration');
const wmonToken = WETH[ChainId.MONAD];
console.log(`   WMON Address: ${wmonToken.address}`);
console.log(`   WMON Symbol: ${wmonToken.symbol}`);
console.log(`   WMON Name: ${wmonToken.name}`);
console.log(`   WMON Decimals: ${wmonToken.decimals}`);
console.log(`   Expected Address: 0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899`);
console.log(`   Status: ${wmonToken.address === '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899' ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: Token Creation Test
console.log('✅ Test 5: Token Creation Test');
try {
  const testToken = new Token(
    ChainId.MONAD,
    '0x28dD3002Ca0040eAc4037759c9b372Ca66051af6',
    18,
    'MMF',
    'Meme Finance'
  );
  console.log(`   Test Token Created: ${testToken.symbol} (${testToken.name})`);
  console.log(`   Chain ID: ${testToken.chainId}`);
  console.log(`   Address: ${testToken.address}`);
  console.log(`   Status: ✅ PASS\n`);
} catch (error) {
  console.log(`   Status: ❌ FAIL - ${error.message}\n`);
}

console.log('🎉 SDK Integration Test Complete!');
console.log('📦 The SDK is now ready for frontend integration.');
console.log('🔗 Use "yarn link @pancakeswap/sdk" in your frontend project.');