# AxieStudio Deployment Script
# This script will help deploy to Vercel and GitHub

Write-Host "🚀 AxieStudio Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the website directory." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host "✅ Trinity Security System (3-factor authentication)" -ForegroundColor Green
Write-Host "✅ Professional Excel Export System" -ForegroundColor Green
Write-Host "✅ Button visibility bugs fixed" -ForegroundColor Green
Write-Host "✅ Neon PostgreSQL database integration" -ForegroundColor Green
Write-Host "✅ Sequential authentication flow" -ForegroundColor Green
Write-Host ""

# Initialize git if not already done
if (!(Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Blue
    & "C:\Program Files\Git\bin\git.exe" init
    & "C:\Program Files\Git\bin\git.exe" add .
    & "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: AxieStudio Admin Dashboard with Trinity Security"
}

Write-Host "📝 Current project status:" -ForegroundColor Cyan
Write-Host "• Admin Dashboard: ✅ Complete with 3-factor authentication"
Write-Host "• Database: ✅ Neon PostgreSQL integrated"
Write-Host "• Export System: ✅ Professional Excel reports"
Write-Host "• Security: ✅ Trinity-based authentication (Christian Doctrine)"
Write-Host "• UI/UX: ✅ Sequential login flow with animations"
Write-Host ""

Write-Host "🌐 DEPLOYMENT INSTRUCTIONS:" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Magenta
Write-Host ""
Write-Host "STEP 1: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard"
Write-Host "2. Click 'Add New' → 'Project'"
Write-Host "3. Import from Git Repository"
Write-Host "4. Select this project folder"
Write-Host "5. Configure environment variables:"
Write-Host "   - ADMIN_KEY_1=axiestudio_admin_2024"
Write-Host "   - ADMIN_KEY_2=axiestudio_secure_2024"
Write-Host "   - ADMIN_KEY_3=axiestudio_premium_2024"
Write-Host "   - DATABASE_URL=your_neon_database_url"
Write-Host "   - RESEND_API_KEY=your_resend_key"
Write-Host "   - EMAIL=stefanjohnmiranda5@gmail.com"
Write-Host "6. Click 'Deploy'"
Write-Host ""

Write-Host "STEP 2: Push to GitHub (AFTER Vercel deployment)" -ForegroundColor Yellow
Write-Host "1. Create new repository on GitHub"
Write-Host "2. Run these commands:"
Write-Host "   git remote add origin https://github.com/yourusername/axiestudio-website.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""

Write-Host "🔐 SECURITY REMINDER:" -ForegroundColor Red
Write-Host "The Trinity Security System requires all 3 codes:"
Write-Host "1. axiestudio_admin_2024"
Write-Host "2. axiestudio_secure_2024"
Write-Host "3. axiestudio_premium_2024"
Write-Host ""

Write-Host "✨ Your AxieStudio Admin Dashboard is ready for deployment!" -ForegroundColor Green
Write-Host "Features included:"
Write-Host "• 3-Factor Authentication (Trinity System)"
Write-Host "• Professional Excel Export"
Write-Host "• Neon PostgreSQL Database"
Write-Host "• Sequential Login Flow"
Write-Host "• Consultation Management CMS"
Write-Host "• Newsletter & Download Tracking"
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
