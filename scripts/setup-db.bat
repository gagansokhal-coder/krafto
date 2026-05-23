@echo off
REM Kraafto Database Setup Script for Windows

echo ========================================
echo Kraafto Database Setup
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    copy .env.example .env
    echo [SUCCESS] Created .env file
    echo.
    echo Please update the following in .env:
    echo   1. DATABASE_URL (if not using default)
    echo   2. NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
    echo.
    pause
)

REM Install dependencies
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)
echo [SUCCESS] Prisma Client generated
echo.

REM Run migrations
echo Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [ERROR] Failed to run migrations
    echo.
    echo Please ensure:
    echo   1. PostgreSQL is running
    echo   2. DATABASE_URL in .env is correct
    echo   3. Database 'kraafto' exists
    pause
    exit /b 1
)
echo [SUCCESS] Migrations completed
echo.

REM Seed database
set /p seed="Do you want to seed the database with sample data? (y/n): "
if /i "%seed%"=="y" (
    echo.
    echo Seeding database...
    call npx prisma db seed
    if %errorlevel% neq 0 (
        echo [WARNING] Seeding failed, but you can continue
    ) else (
        echo [SUCCESS] Database seeded
        echo.
        echo Default Credentials:
        echo   Admin:    admin@kraafto.com / Admin@Kraafto2026
        echo   Customer: demo@kraafto.com / Customer@123
    )
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next steps:
echo   1. Start the development server: npm run dev
echo   2. Visit http://localhost:3000
echo   3. Access admin panel: http://localhost:3000/admin
echo   4. Open Prisma Studio: npx prisma studio
echo.
echo Useful commands:
echo   - View database: npx prisma studio
echo   - Reset database: npx prisma migrate reset
echo   - Generate client: npx prisma generate
echo.

set /p studio="Do you want to open Prisma Studio now? (y/n): "
if /i "%studio%"=="y" (
    echo Opening Prisma Studio...
    start npx prisma studio
)

pause
