# Configuration des Secrets GitHub pour CI/CD

Pour activer le déploiement automatique vers Cloudflare Pages, vous devez configurer 2 secrets dans votre repository GitHub.

## 📋 Secrets Requis

### 1. CLOUDFLARE_API_TOKEN

**Valeur** : Votre token API Cloudflare
- Allez sur https://dash.cloudflare.com/profile/api-tokens
- Cliquez sur "Create Token"
- Utilisez le template "Edit Cloudflare Workers"
- Ou créez un custom token avec les permissions :
  - Account > Cloudflare Pages > Edit
  - Zone > DNS > Edit (optionnel pour custom domains)

**Permissions requises** :
```
Account Resources:
- Include > Specific account > [Votre compte]
  
Account Permissions:
- Cloudflare Pages: Edit

Zone Permissions (optionnel):
- DNS: Edit (pour custom domains)
```

### 2. CLOUDFLARE_ACCOUNT_ID

**Valeur** : `42f26f615d8977d2e673e75397f4d73b`

Votre Account ID est affiché dans :
- Cloudflare Dashboard > Workers & Pages > Overview
- URL : https://dash.cloudflare.com/<ACCOUNT_ID>
- Commande : `npx wrangler whoami`

## 🔧 Étapes de Configuration

### 1. Accédez aux Settings du Repository

Allez sur : https://github.com/Jaokimben/APA/settings/secrets/actions

### 2. Ajoutez les Secrets

Pour chaque secret :

1. Cliquez sur **"New repository secret"**
2. Entrez le nom exactement comme indiqué :
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Collez la valeur
4. Cliquez sur **"Add secret"**

### 3. Vérifiez les Secrets

Une fois ajoutés, vous devriez voir :
- ✅ CLOUDFLARE_API_TOKEN (créé il y a quelques secondes)
- ✅ CLOUDFLARE_ACCOUNT_ID (créé il y a quelques secondes)

## 🚀 Test du Workflow

Une fois les secrets configurés :

```bash
# 1. Faites un changement
echo "# Test" >> README.md

# 2. Commit et push
git add README.md
git commit -m "test: trigger CI/CD workflow"
git push origin main

# 3. Vérifiez les Actions
# Allez sur : https://github.com/Jaokimben/APA/actions
# Le workflow "Deploy to Cloudflare Pages" devrait démarrer automatiquement
```

## 📊 Comportement du CI/CD

### Push sur `main`
- ✅ Build automatique
- ✅ Déploiement sur production
- 🌐 URL : https://agentic-process-analyzer.pages.dev

### Pull Request
- ✅ Build automatique
- ✅ Preview deployment
- 🔗 URL de preview dans les commentaires PR

## 🔒 Sécurité

**Important** :
- ❌ Ne commitez JAMAIS vos tokens dans le code
- ❌ Ne partagez JAMAIS vos tokens publiquement
- ✅ Utilisez toujours les GitHub Secrets
- ✅ Rotez vos tokens régulièrement (tous les 90 jours)

## ❓ Troubleshooting

### "Unauthorized" Error
- Vérifiez que CLOUDFLARE_API_TOKEN est correct
- Vérifiez les permissions du token
- Régénérez un nouveau token si nécessaire

### "Project not found" Error
- Vérifiez que CLOUDFLARE_ACCOUNT_ID est correct
- Vérifiez que le projet "agentic-process-analyzer" existe
- Vérifiez les permissions du token sur ce projet

### Build Fails
- Vérifiez les logs dans GitHub Actions
- Testez localement : `npm run build`
- Vérifiez que toutes les dépendances sont dans package.json

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans : https://github.com/Jaokimben/APA/actions
2. Consultez la documentation Cloudflare : https://developers.cloudflare.com/pages/
3. Ouvrez une issue : https://github.com/Jaokimben/APA/issues

---

**Une fois configuré, chaque push sur `main` déploiera automatiquement sur Cloudflare Pages ! 🚀**
