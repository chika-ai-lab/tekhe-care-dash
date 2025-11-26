# Guide de Déploiement TEKHE sur Netlify

Ce guide explique comment déployer l'application TEKHE sur Netlify en évitant les erreurs 404 lors du rafraîchissement.

## Configuration Netlify incluse ✅

Le projet contient déjà toute la configuration nécessaire :

### 1. `netlify.toml` (racine du projet)
Configuration principale avec :
- Build command : `npm run build`
- Publish directory : `dist`
- Redirections SPA (Single Page App)
- En-têtes de sécurité
- Optimisations de cache

### 2. `public/_redirects`
Fichier de backup pour les redirections React Router.
Assure que toutes les routes pointent vers `index.html` avec un code 200.

## Méthodes de Déploiement

### Méthode 1 : Via GitHub (Recommandée) 🚀

1. **Pousser le code sur GitHub**
   ```bash
   git add .
   git commit -m "Configuration Netlify pour éviter 404"
   git push origin main
   ```

2. **Connecter à Netlify**
   - Aller sur [app.netlify.com](https://app.netlify.com)
   - Cliquer "Add new site" > "Import an existing project"
   - Choisir "GitHub" et sélectionner votre repo
   - Netlify détectera automatiquement `netlify.toml`

3. **Configuration automatique**
   Netlify utilisera automatiquement :
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Toutes les redirections et en-têtes

4. **Déployer**
   - Cliquer "Deploy site"
   - Chaque push sur `main` déclenchera un nouveau déploiement

### Méthode 2 : Via Netlify CLI

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter**
   ```bash
   netlify login
   ```

3. **Initialiser le site**
   ```bash
   netlify init
   ```
   Suivre les instructions pour créer ou lier un site

4. **Déployer**
   ```bash
   # Build local
   npm run build

   # Déployer en production
   netlify deploy --prod
   ```

### Méthode 3 : Drag & Drop manuel

1. **Build local**
   ```bash
   npm run build
   ```

2. **Vérifier que `_redirects` est dans dist/**
   ```bash
   ls dist/_redirects
   ```
   Le fichier `public/_redirects` doit être copié automatiquement dans `dist/` lors du build.

3. **Drag & Drop**
   - Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
   - Glisser-déposer le dossier `dist/`

## Vérification Post-Déploiement

Une fois déployé, testez les points suivants :

### ✅ Tests essentiels

1. **Page d'accueil**
   - [ ] `https://votre-site.netlify.app/` charge correctement

2. **Navigation**
   - [ ] Cliquer sur "Login" fonctionne
   - [ ] Après login, le dashboard s'affiche
   - [ ] Navigation dans les sous-pages (Risques, CSU, SONU, etc.)

3. **Rafraîchissement (Test critique)**
   - [ ] Sur `/dashboard` → Appuyer F5 → Pas de 404 ✨
   - [ ] Sur `/dashboard/risques` → Appuyer F5 → Pas de 404 ✨
   - [ ] Sur `/dashboard/csu` → Appuyer F5 → Pas de 404 ✨
   - [ ] Sur n'importe quelle route → F5 → Aucune erreur 404 ✨

4. **Routes protégées**
   - [ ] Accès direct à `/dashboard` sans login → Redirige vers `/login`
   - [ ] Après login, accès autorisé

5. **En-têtes de sécurité** (facultatif)
   - Tester sur [securityheaders.com](https://securityheaders.com)
   - Vérifier que les en-têtes de sécurité sont présents

## Résolution de Problèmes

### Problème : Toujours des 404 après déploiement

**Solution 1 : Vérifier que _redirects est dans dist/**
```bash
# Après build local
ls dist/_redirects
# Si absent, le fichier n'a pas été copié depuis public/
```

**Solution 2 : Vérifier netlify.toml**
- Le fichier doit être à la racine du projet
- Vérifier la section `[[redirects]]`

**Solution 3 : Forcer un redéploiement**
```bash
netlify deploy --prod --force
```

### Problème : Le build échoue sur Netlify

**Vérifier les logs de build** dans Netlify Dashboard

**Solutions courantes :**
- Vérifier Node version : Le projet nécessite Node 18+
- Ajouter dans `netlify.toml` :
  ```toml
  [build.environment]
    NODE_VERSION = "18"
  ```

### Problème : CSS ne charge pas

**Solution :** Vérifier que Vite génère les bons chemins
- Les assets doivent être dans `dist/assets/`
- Vérifier `vite.config.ts` → `base: '/'`

## Variables d'Environnement (si nécessaire)

Si vous utilisez des variables d'environnement :

1. **Dans Netlify Dashboard**
   - Site settings > Environment variables
   - Ajouter les variables nécessaires

2. **Format dans le code**
   ```typescript
   // Vite utilise import.meta.env
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

## Domaine Personnalisé (optionnel)

Pour utiliser votre propre domaine :

1. **Dans Netlify Dashboard**
   - Site settings > Domain management
   - Add custom domain

2. **Configuration DNS**
   - Ajouter les enregistrements DNS fournis par Netlify
   - Attendre la propagation (quelques minutes à 48h)

## Performance

Le `netlify.toml` inclut des optimisations :
- ✅ Cache des assets statiques (1 an)
- ✅ Cache HTML désactivé (toujours frais)
- ✅ Compression CSS/JS automatique
- ✅ Compression des images

## Sécurité

Les en-têtes de sécurité sont configurés automatiquement :
- ✅ X-Frame-Options : DENY (protection clickjacking)
- ✅ X-XSS-Protection : 1; mode=block
- ✅ X-Content-Type-Options : nosniff
- ✅ Referrer-Policy : strict-origin-when-cross-origin
- ✅ Permissions-Policy : restrictions caméra/micro

## Monitoring

### Logs
- Netlify Dashboard > Deploys > (cliquer sur un deploy) > Deploy log

### Analytics (optionnel)
- Activer Netlify Analytics dans le dashboard
- Voir trafic, pages populaires, etc.

## Rollback

En cas de problème avec un déploiement :

1. **Via Dashboard**
   - Deploys > (sélectionner un ancien deploy)
   - Cliquer "Publish deploy"

2. **Via CLI**
   ```bash
   netlify rollback
   ```

## Support

- 📚 [Netlify Docs](https://docs.netlify.com/)
- 💬 [Netlify Community](https://answers.netlify.com/)
- 🐛 Issues du projet : Créer une issue sur GitHub

## Checklist finale

Avant de considérer le déploiement comme terminé :

- [ ] Site accessible sur l'URL Netlify
- [ ] Login fonctionne
- [ ] Toutes les pages se chargent
- [ ] **Rafraîchissement sur toutes les pages fonctionne** ✨
- [ ] Navigation entre pages fonctionne
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Performance acceptable (PageSpeed Insights)
- [ ] (Optionnel) Domaine personnalisé configuré
- [ ] (Optionnel) HTTPS actif et certificat valide

---

**Note importante** : Le système d'authentification actuel utilise `localStorage` (frontend uniquement). Pour un environnement de production avec des données réelles, vous devrez implémenter :
- Backend API sécurisé
- Authentification JWT
- Base de données
- Validation serveur

Le déploiement Netlify actuel est parfait pour un **POC, démo ou MVP**.
