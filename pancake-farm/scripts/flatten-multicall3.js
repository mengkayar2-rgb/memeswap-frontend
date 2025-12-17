const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔧 Flattening Multicall3 Contract for Manual Verification...\n");

  // Create flattened directory if it doesn't exist
  const flattenedDir = path.join(__dirname, '..', 'flattened');
  if (!fs.existsSync(flattenedDir)) {
    fs.mkdirSync(flattenedDir, { recursive: true });
  }

  try {
    // Flatten Multicall3 contract
    console.log("📄 Flattening Multicall3.sol...");
    const multicall3Flattened = execSync(
      'npx hardhat flatten contracts/multicall/Multicall3.sol',
      { encoding: 'utf8', cwd: path.join(__dirname, '..') }
    );

    // Clean up the flattened code (remove duplicate SPDX and pragma statements)
    const cleanedMulticall3 = cleanFlattenedCode(multicall3Flattened);
    
    // Save flattened contract
    const multicall3File = path.join(flattenedDir, 'Multicall3_flattened.sol');
    fs.writeFileSync(multicall3File, cleanedMulticall3);
    console.log(`   ✅ Saved: ${multicall3File}`);

    console.log("\n🎉 Flattening Complete!");
    console.log("\n📁 Flattened Files Created:");
    console.log(`   - Multicall3_flattened.sol`);
    
    console.log("\n🔗 Next Steps:");
    console.log("1. Use the flattened files for manual verification on Monad Explorer");
    console.log("2. Copy the flattened source code to the block explorer");
    console.log("3. Set compiler version to 0.8.12");
    console.log("4. Enable optimization with 200 runs");

  } catch (error) {
    console.error("❌ Error flattening contracts:", error.message);
    process.exit(1);
  }
}

function cleanFlattenedCode(flattenedCode) {
  const lines = flattenedCode.split('\n');
  const cleanedLines = [];
  let seenSPDX = false;
  let seenPragma = false;

  for (const line of lines) {
    // Skip duplicate SPDX license identifiers
    if (line.includes('SPDX-License-Identifier')) {
      if (seenSPDX) continue;
      seenSPDX = true;
    }
    
    // Skip duplicate pragma statements for the same version
    if (line.includes('pragma solidity ^0.8.12')) {
      if (seenPragma) continue;
      seenPragma = true;
    }
    
    // Skip empty lines at the beginning
    if (cleanedLines.length === 0 && line.trim() === '') continue;
    
    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });