#!/bin/bash
# Deploy DEX Monad Subgraph to Goldsky
# Make sure you have goldsky CLI installed and authenticated

echo "Building subgraph..."
npx graph codegen subgraph.yaml
npx graph build subgraph.yaml

echo "Deploying to Goldsky..."
goldsky subgraph deploy monad-dex/1.0.0 --path .

echo "Deployment complete!"
echo "You can check your subgraph at: https://api.goldsky.com/api/public/project_<your-project-id>/subgraphs/monad-dex/1.0.0/gn"
