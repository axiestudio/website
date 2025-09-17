#!/usr/bin/env pwsh

# AxieStudio Website Deployment Script
# Fixes all Sanity CMS errors and deploys to Vercel + GitHub

Write-Host "🚀 AxieStudio Website Deployment Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Step 1: Remove all Sanity CMS dependencies
Write-Host "🔧 Step 1: Removing Sanity CMS dependencies..." -ForegroundColor Yellow

# Remove Sanity client and config files
$sanityFiles = @(
    "src/lib/backend/sanity/client.ts",
    "src/lib/backend/sanity/config.ts", 
    "src/lib/backend/sanity/queries.ts",
    "src/lib/backend/sanity"
)

foreach ($file in $sanityFiles) {
    if (Test-Path $file) {
        Write-Host "  ❌ Removing $file" -ForegroundColor Red
        Remove-Item $file -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Step 2: Create placeholder Sanity files to prevent import errors
Write-Host "🔧 Step 2: Creating placeholder Sanity files..." -ForegroundColor Yellow

# Create placeholder client
New-Item -ItemType Directory -Path "src/lib/backend/sanity" -Force | Out-Null

@"
// Placeholder Sanity client - AxieStudio doesn't use Sanity CMS
export const client = null;
export const getImageUrl = (source: any): string => "";
export const sanityFetch = async <T>(query: string, params: any = {}, isDraftMode = false): Promise<T> => {
  return [] as T;
};
"@ | Out-File -FilePath "src/lib/backend/sanity/client.ts" -Encoding UTF8

@"
// Placeholder Sanity config - AxieStudio doesn't use Sanity CMS
export const config = {
  projectId: "placeholder",
  dataset: "production",
  apiVersion: "2025-06-02",
  useCdn: false,
};
export const PREVIEW_READ_API_KEY_TOKEN = "";
"@ | Out-File -FilePath "src/lib/backend/sanity/config.ts" -Encoding UTF8

@"
// Placeholder Sanity queries - AxieStudio doesn't use Sanity CMS
export const PAGE_BY_SLUG_QUERY = "";
export const METADATA_BY_SLUG_QUERY = "";
export const PAGES_SLUGS_QUERY = "";
export const BLOG_POSTS_QUERY = "";
export const BLOG_POSTS_SLUGS_QUERY = "";
export const POST_BY_SLUG_QUERY = "";
export const PUBLISHED_BLOG_POSTS_QUERY = "";
export const PUBLISHED_EVENTS_QUERY = "";
export const BLOG_POSTS_PAGINATED_QUERY = "";
"@ | Out-File -FilePath "src/lib/backend/sanity/queries.ts" -Encoding UTF8

# Step 3: Build and test locally
Write-Host "🔧 Step 3: Building project locally..." -ForegroundColor Yellow

try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "  ✅ Local build successful!" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Local build failed: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to Vercel
Write-Host "🚀 Step 4: Deploying to Vercel..." -ForegroundColor Yellow

try {
    vercel --prod --yes
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel deployment failed"
    }
    Write-Host "  ✅ Vercel deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Vercel deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Commit and push to GitHub
Write-Host "🔧 Step 5: Pushing to GitHub..." -ForegroundColor Yellow

try {
    git add .
    git commit -m "🚀 Deploy AxieStudio website: Remove Sanity CMS dependencies and deploy to Vercel

- Removed all Sanity CMS client, config, and query files
- Created placeholder files to prevent import errors  
- Fixed all 'Configuration must contain projectId' errors
- Successfully deployed to Vercel production
- Complete AxieStudio customer service automation website"
    
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub push failed"
    }
    Write-Host "  ✅ GitHub push successful!" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GitHub push failed: $_" -ForegroundColor Red
    exit 1
}

# Success message
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "✅ Sanity CMS dependencies removed" -ForegroundColor Green
Write-Host "✅ Local build successful" -ForegroundColor Green  
Write-Host "✅ Vercel deployment successful" -ForegroundColor Green
Write-Host "✅ GitHub push successful" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your AxieStudio website is now live!" -ForegroundColor Cyan
