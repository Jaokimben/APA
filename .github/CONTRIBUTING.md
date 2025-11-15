# Guide de Contribution - Agentic Process Analyzer

Merci de votre intérêt pour contribuer à **Agentic Process Analyzer** ! 🎉

## 🚀 Quick Start

### 1. Fork et Clone
```bash
# Fork le repository sur GitHub
# Puis clone votre fork
git clone https://github.com/VOTRE_USERNAME/APA.git
cd APA
```

### 2. Installation
```bash
npm install
```

### 3. Développement
```bash
# Build le projet
npm run build

# Démarrer le serveur de développement
npm run dev
# ou avec PM2
pm2 start ecosystem.config.cjs

# L'application sera accessible sur http://localhost:3000
```

### 4. Tests
```bash
# Tester l'application
npm run test

# Tester une analyse
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"processDescription":"1. Commande\n2. Paiement\n3. Livraison","processType":"text"}'

# Tester la recherche par titre
curl -X POST http://localhost:3000/api/search-process \
  -H "Content-Type: application/json" \
  -d '{"processTitle":"KYC"}'
```

## 📝 Types de Contributions

### 🐛 Corrections de Bugs
1. Créez une issue décrivant le bug
2. Créez une branche: `git checkout -b fix/description-du-bug`
3. Corrigez et testez
4. Commit: `git commit -m "fix: description claire du bug corrigé"`
5. Push et créez une Pull Request

### ✨ Nouvelles Fonctionnalités
1. Ouvrez une issue pour discuter de la fonctionnalité
2. Créez une branche: `git checkout -b feature/nom-fonctionnalite`
3. Implémentez avec tests
4. Commit: `git commit -m "feat: description de la fonctionnalité"`
5. Mettez à jour la documentation
6. Push et créez une Pull Request

### 📚 Documentation
1. Créez une branche: `git checkout -b docs/sujet`
2. Améliorez la documentation
3. Commit: `git commit -m "docs: description des changements"`
4. Push et créez une Pull Request

### 🎨 Améliorations UI/UX
1. Créez une issue avec maquettes/captures si possible
2. Créez une branche: `git checkout -b ui/description`
3. Implémentez les changements
4. Commit: `git commit -m "style: description des améliorations"`
5. Push et créez une Pull Request

## 🎯 Domaines de Contribution

### 1. Base de Connaissances de Processus
Ajoutez de nouveaux processus métier à `src/index.tsx`:

```typescript
const processKnowledgeBase: Record<string, string> = {
  'votre-processus': `Processus [Nom]
Sources: [Sources fiables]

1. Étape 1
   - Sous-étape A
   - Sous-étape B
   
2. Étape 2
   ...
`,
};
```

**Processus recherchés** :
- 🏥 Santé : Admission patient, Gestion dossier médical
- 🏦 Banque : Ouverture compte, Crédit immobilier
- 🏭 Manufacturing : Production, Contrôle qualité
- 📦 Logistique : Supply chain, Gestion stock
- 🎓 Éducation : Inscription, Gestion cours

### 2. Algorithmes d'Analyse
Améliorez la classification 3 niveaux dans `src/index.tsx`:
- Meilleure détection des patterns
- Nouveaux keywords
- Sous-types d'automatisation

### 3. Visualisations
Ajoutez de nouveaux types de diagrammes dans `public/static/app.js`:
- Gantt charts pour timeline
- Heatmaps d'automatisation
- Graphes de dépendances

### 4. Scénarios d'Automatisation
Affinez les calculs ROI et recommandations:
- Modèles de coûts par industrie
- Calculs de savings plus précis
- Recommandations contextuelles

### 5. Internationalisation (i18n)
Traduisez l'interface et la documentation:
- 🇬🇧 Anglais
- 🇪🇸 Espagnol
- 🇩🇪 Allemand
- 🇮🇹 Italien

## 📐 Standards de Code

### Structure des Commits
Suivez [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description courte

[corps du message optionnel]

[footer optionnel]
```

**Types**:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style (pas de changement de code)
- `refactor`: Refactoring
- `test`: Ajout/modification de tests
- `chore`: Tâches de maintenance

**Exemples**:
```
feat(api): add support for multi-language process templates
fix(frontend): correct button color in title mode
docs(readme): update installation instructions
style(ui): improve spacing in scenarios section
```

### Code TypeScript/JavaScript
```typescript
// ✅ Bon
function generateProcessFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  // ...
}

// ❌ Éviter
function gen(t) {
  // ...
}
```

### Documentation
- Commentez les fonctions complexes
- Utilisez JSDoc pour les fonctions publiques
- Maintenez README.md et CHANGELOG.md à jour

## 🧪 Tests

Avant de soumettre une PR:

```bash
# 1. Build réussit
npm run build

# 2. Application démarre
npm run dev
# Vérifiez http://localhost:3000

# 3. API fonctionnelle
curl http://localhost:3000/api/analyze # Test endpoint

# 4. Pas d'erreurs console
# Ouvrez DevTools → Console
```

## 📋 Checklist Pull Request

Avant de créer une PR, vérifiez:

- [ ] Le code build sans erreurs (`npm run build`)
- [ ] Les tests passent (si applicables)
- [ ] La documentation est mise à jour
- [ ] CHANGELOG.md est mis à jour (pour features/fixes)
- [ ] Les commits suivent Conventional Commits
- [ ] Le code est commenté si complexe
- [ ] Pas de secrets/tokens dans le code
- [ ] Le code fonctionne localement

## 🔍 Review Process

1. **Soumission**: Créez une PR avec description claire
2. **CI/CD**: Les GitHub Actions doivent passer
3. **Review**: Un mainteneur review dans 24-48h
4. **Feedback**: Répondez aux commentaires
5. **Merge**: Une fois approuvée, merge dans `main`
6. **Deploy**: Déploiement automatique sur Cloudflare Pages

## 🎁 Reconnaissance

Tous les contributeurs seront:
- Listés dans le README.md
- Mentionnés dans les releases notes
- Crédités dans CHANGELOG.md

## 💬 Questions ?

- **Issues**: https://github.com/Jaokimben/APA/issues
- **Discussions**: https://github.com/Jaokimben/APA/discussions
- **Email**: [Votre email de contact]

## 📜 Licence

En contribuant, vous acceptez que vos contributions soient sous la même licence que le projet (à définir).

---

**Merci de contribuer à l'avancement de l'automatisation intelligente ! 🤖✨**
