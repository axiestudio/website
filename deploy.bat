@echo off
echo.
echo ========================================
echo   AXIESTUDIO DEPLOYMENT GUIDE
echo ========================================
echo.
echo STEP 1: DEPLOY TO VERCEL FIRST!
echo.
echo 1. Go to https://vercel.com/dashboard
echo 2. Click "Add New" - "Project"
echo 3. Import this project
echo 4. Add Environment Variables:
echo    ADMIN_KEY_1=axiestudio_admin_2024
echo    ADMIN_KEY_2=axiestudio_secure_2024
echo    ADMIN_KEY_3=axiestudio_premium_2024
echo    DATABASE_URL=your_neon_database_url
echo    RESEND_API_KEY=your_resend_key
echo    EMAIL=stefanjohnmiranda5@gmail.com
echo 5. Click Deploy
echo.
echo STEP 2: PUSH TO GITHUB (AFTER Vercel)
echo.
echo 1. Create new GitHub repository
echo 2. Run: git remote add origin https://github.com/username/repo.git
echo 3. Run: git branch -M main
echo 4. Run: git push -u origin main
echo.
echo TRINITY SECURITY CODES:
echo 1. axiestudio_admin_2024
echo 2. axiestudio_secure_2024
echo 3. axiestudio_premium_2024
echo.
echo Your AxieStudio Admin Dashboard is ready!
echo.
pause
