const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function flattenContract(contractPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `npx hardhat flatten ${contractPath}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error flattening ${contractPath}:`, error);
        reject(error);
        return;
      }
      
      // Write flattened code to file
      fs.writeFileSync(outputPath, stdout);
      console.log(`✅ Flattened ${contractPath} -> ${outputPath}`);
      resolve();
    });
  });
}

async function main() {
  console.log("=".repeat(60));
  console.log("📄 FLATTENING CONTRACTS FOR VERIFICATION");
  console.log("=".repeat(60));

  const contractsToFlatten = [
    {
      source: 'contracts/WETH.sol',
      output: 'flattened/WETH-flattened.sol',
      name: 'WETH'
    },
    {
      source: 'contracts/PancakeRouter.sol',
      output: 'flattened/PancakeRouter-flattened.sol',
      name: 'PancakeRouter'
    }
  ];

  // Create flattened directory if it doesn't exist
  const flattenedDir = path.join(__dirname, '..', 'flattened');
  if (!fs.existsSync(flattenedDir)) {
    fs.mkdirSync(flattenedDir, { recursive: true });
  }

  for (const contract of contractsToFlatten) {
    try {
      console.log(`\n📄 Flattening ${contract.name}...`);
      await flattenContract(contract.source, contract.output);
    } catch (error) {
      console.error(`❌ Failed to flatten ${contract.name}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ CONTRACT FLATTENING COMPLETED");
  console.log("=".repeat(60));
  console.log("Flattened files created in 'flattened/' directory:");
  console.log("- WETH-flattened.sol");
  console.log("- PancakeRouter-flattened.sol");
  console.log("\nUse these files for manual verification on block explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Flattening failed:", error);
    process.exit(1);
  });