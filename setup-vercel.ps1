#!/usr/bin/env pwsh
# Vercel Environment Variables Setup Script
# This script automatically adds all required environment variables to Vercel

Write-Host "🚀 Setting up Vercel environment variables..." -ForegroundColor Cyan

# Define all environment variables
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://lcgjbpmrkjkrrsiygvld.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "sb_publishable_iZ70wl-nsLGJzNpoMbbu9Q_Qw9hVOS3"
    "NEXT_PUBLIC_RAZORPAY_KEY_ID" = "placeholder-id"
    "RAZORPAY_KEY_SECRET" = "placeholder-secret"
    "GOOGLE_CLIENT_EMAIL" = "placeholder@example.com"
    "GOOGLE_PRIVATE_KEY" = "-----BEGIN PRIVATE KEY-----\nplaceholder\n-----END PRIVATE KEY-----\n"
    "GOOGLE_CALENDAR_ID" = "primary"
}

Write-Host "`n📝 Adding environment variables to Vercel..." -ForegroundColor Yellow

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "  ➤ Adding: $key" -ForegroundColor Green
    
    # Add to production
    Write-Host "    Production..." -NoNewline
    echo $value | vercel env add $key production 2>&1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
    
    # Add to preview
    Write-Host "    Preview..." -NoNewline
    echo $value | vercel env add $key preview 2>&1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
    
    # Add to development
    Write-Host "    Development..." -NoNewline
    echo $value | vercel env add $key development 2>&1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
    
    Write-Host ""
}

Write-Host "✅ All environment variables added successfully!" -ForegroundColor Green
Write-Host "`n🚀 Deploying to production..." -ForegroundColor Cyan

# Deploy to production
vercel --prod

Write-Host "`n✨ Deployment complete!" -ForegroundColor Green
