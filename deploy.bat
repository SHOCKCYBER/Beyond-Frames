@echo off
echo ====================================================
echo   PUBLISHING BEYOND FRAMES TO GITHUB PAGES
echo ====================================================
echo.
cd /d "C:\PORTFOLIO WEB"

echo 1. Adding latest files...
git add .

echo 2. Committing changes...
git commit -m "Update Beyond Frames site (%date% %time%)"

echo 3. Pushing live to GitHub...
git push origin main

echo.
echo ====================================================
echo   SUCCESS! Your live website is being updated.
echo   Live URL: https://shockcyber.github.io/Beyond-Frames/
echo ====================================================
echo.
pause
