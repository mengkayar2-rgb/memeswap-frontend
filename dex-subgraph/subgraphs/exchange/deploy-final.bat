@echo off
echo ========================================================
echo    DEX Monad Subgraph - Goldsky Deployment
echo ========================================================
echo.

echo [1/3] Generating code...
call npx graph codegen subgraph.yaml
if %errorlevel% neq 0 (
    echo ERROR: Code generation failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [2/3] Building subgraph...
call npx graph build subgraph.yaml
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [3/3] Deploying to Goldsky...
call goldsky subgraph deploy monad-dex/1.0.0 --path . --force
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo    DEPLOYMENT SUCCESS!
echo    Please COPY the GraphQL API URL above.
echo ========================================================
pause
