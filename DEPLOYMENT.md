# Guide de Déploiement - Agentic Process Analyzer

## 🚀 Déploiement Cloudflare Pages

### Déploiement Réussi ✅

**URL de Production** : https://d35bc0e6.agentic-process-analyzer.pages.dev  
**Projet Cloudflare** : agentic-process-analyzer  
**Date de déploiement** : 15 novembre 2025  

### URLs Disponibles

- **Production** : https://d35bc0e6.agentic-process-analyzer.pages.dev
- **Projet principal** : https://agentic-process-analyzer.pages.dev (sera disponible après configuration du domaine principal)
- **Sandbox (développement)** : https://3000-i8cg55gj533mr7z6bw2ma-18e660f9.sandbox.novita.ai

### Commandes de Déploiement

```bash
# Build le projet
npm run build

# Déployer sur Cloudflare Pages
npx wrangler pages deploy dist --project-name agentic-process-analyzer

# Ou utiliser la commande npm
npm run deploy:prod
```

### Configuration Cloudflare

**Compte** : joakimben1234@gmail.com  
**Account ID** : 42f26f615d8977d2e673e75397f4d73b  
**Project Name** : agentic-process-analyzer  
**Production Branch** : main  
**Compatibility Date** : 2024-01-01  

### Structure du Déploiement

```
dist/
├── _worker.js           # Application Hono compilée (54.56 KB)
├── _routes.json         # Configuration du routing
└── static/              # Assets statiques
    ├── app.js          # Frontend JavaScript
    └── styles.css      # Styles personnalisés
```

## 📦 GitHub Repository

### Configuration Requise

**⚠️ Action Requise : Autorisation GitHub**

Pour pousser le code sur GitHub :
1. Allez dans l'onglet **#github** de l'interface
2. Cliquez sur **"Authorize GitHub"**
3. Connectez votre compte GitHub
4. Sélectionnez ou créez un repository nommé `agentic-process-analyzer`

### Commandes Git (après autorisation)

```bash
# Vérifier le statut
git status

# Pousser vers GitHub
git remote add origin https://github.com/VOTRE_USERNAME/agentic-process-analyzer.git
git push -u origin main

# Ou forcer le push si le repo existe déjà
git push -f origin main
```

## 🔧 Variables d'Environnement

### Développement Local (.dev.vars)
Aucune variable requise pour le moment.

### Production (Cloudflare Secrets)
Aucun secret requis pour le moment. Si nécessaire :

```bash
npx wrangler pages secret put SECRET_NAME --project-name agentic-process-analyzer
```

## 📊 Métriques de Déploiement

### Build Stats
- **Taille du Worker** : 54.56 KB
- **Temps de build** : ~400ms
- **Modules transformés** : 38

### Fonctionnalités Déployées
✅ Analyse 3 niveaux d'automatisation  
✅ Visualisation interactive (Mermaid.js)  
✅ Scénarios d'automatisation avec ROI  
✅ Bibliothèque de processus pré-définis (KYC/AML, etc.)  
✅ Recommandations stratégiques  
✅ Technologies et stack technique  

## 🧪 Tests Post-Déploiement

### Tests à Effectuer

1. **Page d'accueil**
   ```bash
   curl -I https://d35bc0e6.agentic-process-analyzer.pages.dev
   ```

2. **API d'analyse**
   ```bash
   curl -X POST https://d35bc0e6.agentic-process-analyzer.pages.dev/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"processDescription": "Test", "processType": "text"}'
   ```

3. **Processus pré-définis**
   ```bash
   curl https://d35bc0e6.agentic-process-analyzer.pages.dev/api/process/kyc-aml
   ```

4. **Assets statiques**
   ```bash
   curl -I https://d35bc0e6.agentic-process-analyzer.pages.dev/static/app.js
   ```

## 🔄 Mise à Jour Continue

### Workflow de Déploiement

1. **Développement Local**
   ```bash
   npm run build
   pm2 start ecosystem.config.cjs
   ```

2. **Tests**
   ```bash
   npm run test
   curl http://localhost:3000
   ```

3. **Commit Git**
   ```bash
   git add .
   git commit -m "feat: nouvelle fonctionnalité"
   git push origin main
   ```

4. **Déploiement Production**
   ```bash
   npm run deploy:prod
   ```

## 📈 Monitoring et Logs

### Cloudflare Dashboard
- **URL** : https://dash.cloudflare.com/
- **Projet** : Pages > agentic-process-analyzer
- **Métriques** : Visites, bande passante, erreurs
- **Logs** : Real-time logs disponibles

### Wrangler Logs
```bash
# Voir les logs en temps réel
npx wrangler pages deployment tail --project-name agentic-process-analyzer
```

## 🌐 Domaine Personnalisé (Optionnel)

### Ajouter un Domaine Custom

```bash
# Ajouter un domaine
npx wrangler pages domain add votredomaine.com --project-name agentic-process-analyzer

# Lister les domaines
npx wrangler pages domain list --project-name agentic-process-analyzer
```

### Configuration DNS
1. Allez sur Cloudflare Dashboard
2. Pages > agentic-process-analyzer > Custom domains
3. Suivez les instructions pour configurer le CNAME

## 🔐 Sécurité

### Headers de Sécurité
Headers automatiquement configurés par Cloudflare :
- HTTPS forcé
- HSTS activé
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN

### Rate Limiting
Cloudflare Pages inclut :
- Protection DDoS automatique
- Rate limiting sur les requêtes
- Bot protection

## 🆘 Dépannage

### Erreur : "Project not found"
```bash
# Re-créer le projet
npx wrangler pages project create agentic-process-analyzer
```

### Erreur : "Unauthorized"
```bash
# Vérifier l'authentification
npx wrangler whoami

# Re-configurer le token
# Aller dans Deploy tab et reconfigurer
```

### Build Errors
```bash
# Nettoyer et rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📚 Ressources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Hono Framework](https://hono.dev/)
- [Mermaid.js](https://mermaid.js.org/)

---

**Dernière mise à jour** : 15 novembre 2025  
**Version** : 1.3  
**Statut** : ✅ Déployé et opérationnel
