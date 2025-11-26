# Script de vérification de la configuration Netlify pour Windows PowerShell
# Utilisation : .\check-netlify.ps1

Write-Host ""
Write-Host "🔍 Vérification de la configuration Netlify pour TEKHE" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

# Fonction de vérification de fichier
function Check-File {
    param($FilePath)
    if (Test-Path $FilePath) {
        Write-Host "✓ $FilePath existe" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $FilePath manquant" -ForegroundColor Red
        $script:ERRORS++
        return $false
    }
}

# Fonction de vérification du contenu
function Check-Content {
    param($FilePath, $Content)
    if ((Test-Path $FilePath) -and (Select-String -Path $FilePath -Pattern $Content -Quiet)) {
        Write-Host "✓ $FilePath contient '$Content'" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $FilePath ne contient pas '$Content'" -ForegroundColor Red
        $script:ERRORS++
        return $false
    }
}

Write-Host "📁 Vérification des fichiers de configuration..." -ForegroundColor Yellow
Write-Host ""

# Fichiers essentiels
Check-File "netlify.toml" | Out-Null
Check-File "public\_redirects" | Out-Null
Check-File ".nvmrc" | Out-Null

Write-Host ""
Write-Host "📋 Vérification du contenu de netlify.toml..." -ForegroundColor Yellow
Write-Host ""

Check-Content "netlify.toml" 'publish = "dist"' | Out-Null
Check-Content "netlify.toml" 'command = "npm run build"' | Out-Null
Check-Content "netlify.toml" 'from = "/\*"' | Out-Null
Check-Content "netlify.toml" 'to = "/index.html"' | Out-Null

Write-Host ""
Write-Host "📋 Vérification du contenu de _redirects..." -ForegroundColor Yellow
Write-Host ""

Check-Content "public\_redirects" "/\*" | Out-Null
Check-Content "public\_redirects" "/index.html" | Out-Null
Check-Content "public\_redirects" "200" | Out-Null

Write-Host ""
Write-Host "🏗️  Test du build..." -ForegroundColor Yellow
Write-Host ""

try {
    # Rediriger la sortie vers null
    $null = npm run build 2>&1
    Write-Host "✓ Build réussi" -ForegroundColor Green

    # Vérifier que _redirects est copié
    if (Test-Path "dist\_redirects") {
        Write-Host "✓ dist\_redirects existe" -ForegroundColor Green
    } else {
        Write-Host "✗ dist\_redirects manquant" -ForegroundColor Red
        $ERRORS++
    }

    if (Test-Path "dist\index.html") {
        Write-Host "✓ dist\index.html existe" -ForegroundColor Green
    } else {
        Write-Host "✗ dist\index.html manquant" -ForegroundColor Red
        $ERRORS++
    }
} catch {
    Write-Host "✗ Build échoué" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "📊 Résumé" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ($ERRORS -eq 0 -and $WARNINGS -eq 0) {
    Write-Host "✓ Tout est prêt pour le déploiement Netlify !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "1. git add ."
    Write-Host "2. git commit -m 'Configuration Netlify'"
    Write-Host "3. git push origin main"
    Write-Host "4. Connecter le repo à Netlify"
    exit 0
} else {
    Write-Host "✗ $ERRORS erreur(s) détectée(s)" -ForegroundColor Red
    if ($WARNINGS -gt 0) {
        Write-Host "⚠ $WARNINGS avertissement(s)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Corrigez les erreurs avant de déployer." -ForegroundColor Yellow
    exit 1
}
