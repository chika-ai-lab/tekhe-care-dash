#!/bin/bash

# Script de vérification de la configuration Netlify
# Utilisation : bash check-netlify.sh

echo "🔍 Vérification de la configuration Netlify pour TEKHE"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur
ERRORS=0
WARNINGS=0

# Fonction de vérification
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
    else
        echo -e "${RED}✗${NC} $1 manquant"
        ((ERRORS++))
    fi
}

# Fonction de vérification du contenu
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contient '$2'"
    else
        echo -e "${RED}✗${NC} $1 ne contient pas '$2'"
        ((ERRORS++))
    fi
}

echo "📁 Vérification des fichiers de configuration..."
echo ""

# Fichiers essentiels
check_file "netlify.toml"
check_file "public/_redirects"
check_file ".nvmrc"

echo ""
echo "📋 Vérification du contenu de netlify.toml..."
echo ""

check_content "netlify.toml" "publish = \"dist\""
check_content "netlify.toml" "command = \"npm run build\""
check_content "netlify.toml" "from = \"/*\""
check_content "netlify.toml" "to = \"/index.html\""

echo ""
echo "📋 Vérification du contenu de _redirects..."
echo ""

check_content "public/_redirects" "/*"
check_content "public/_redirects" "/index.html"
check_content "public/_redirects" "200"

echo ""
echo "🏗️  Test du build..."
echo ""

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build réussi"

    # Vérifier que _redirects est copié
    if [ -f "dist/_redirects" ]; then
        echo -e "${GREEN}✓${NC} dist/_redirects existe"
    else
        echo -e "${RED}✗${NC} dist/_redirects manquant"
        ((ERRORS++))
    fi

    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✓${NC} dist/index.html existe"
    else
        echo -e "${RED}✗${NC} dist/index.html manquant"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} Build échoué"
    ((ERRORS++))
fi

echo ""
echo "📊 Résumé"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Tout est prêt pour le déploiement Netlify !${NC}"
    echo ""
    echo "Prochaines étapes :"
    echo "1. git add ."
    echo "2. git commit -m 'Configuration Netlify'"
    echo "3. git push origin main"
    echo "4. Connecter le repo à Netlify"
    exit 0
else
    echo -e "${RED}✗ $ERRORS erreur(s) détectée(s)${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS avertissement(s)${NC}"
    fi
    echo ""
    echo "Corrigez les erreurs avant de déployer."
    exit 1
fi
