@echo off
REM Deploy DEX Monad Subgraph to Goldsky
REM Make sure you have goldsky CLI installed and authenticated

echo Building subgraph...
call npx graph codegen subgraph.yaml
call npx graph build subgraph.yaml

echo Deploying to Goldsky...
call goldsky subgraph deploy monad-dex/1.0.0 --path .

echo Deployment complete!
echo You can check your subgraph at: https://api.goldsky.com/api/public/project_YOUR-PROJECT-ID/subgraphs/monad-dex/1.0.0/gn
pause
