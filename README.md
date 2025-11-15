# Agentic Process Analyzer 🤖

Analyseur intelligent de processus métier utilisant l'IA Agentique pour identifier les opportunités d'automatisation.

## 🎯 Vue d'ensemble du projet

**Agentic Process Analyzer** est une application web innovante qui analyse vos processus métier et identifie automatiquement:
- Les étapes automatisables par **digitalisation classique** (RPA, workflows, scripts)
- Les étapes nécessitant des **agents IA autonomes** (décisions complexes, adaptation contextuelle)
- Les **recommandations stratégiques** pour maximiser le ROI de votre transformation digitale

## 🚀 URLs du projet

### Environnement de développement
- **URL Sandbox**: https://3000-i8cg55gj533mr7z6bw2ma-18e660f9.sandbox.novita.ai
- **API Endpoint**: `/api/analyze` (POST)

### Production
- **Déploiement**: À venir sur Cloudflare Pages
- **GitHub**: À configurer

## ✨ Fonctionnalités actuellement implémentées

### ✅ Complété
1. **Interface utilisateur intuitive**
   - Design moderne avec TailwindCSS et animations
   - Support multi-format (description textuelle + BPMN)
   - Interface responsive et accessible

2. **Analyse intelligente des processus**
   - Extraction automatique des étapes du processus
   - Classification intelligente des tâches:
     - 🔵 Digitalisation classique (tâches répétitives)
     - 🟣 IA Agentique (décisions complexes)
     - 🔷 Hybride (combinaison des deux)
     - ⚪ Manuel (avec support IA possible)

3. **Visualisations riches**
   - Statistiques d'automatisation en temps réel
   - Analyse détaillée étape par étape
   - Vue comparative: Digitalisation vs IA Agentique
   - Recommandations stratégiques priorisées

4. **API Backend robuste**
   - Endpoint `/api/analyze` pour analyse de processus
   - Support CORS pour intégrations tierces
   - Gestion d'erreurs complète

### 🔄 En cours / À venir
1. **Intégration IA réelle**
   - Connexion à un modèle LLM pour analyse contextuelle avancée
   - Apprentissage des patterns d'automatisation

2. **Export et rapports**
   - Export PDF des analyses
   - Rapports exécutifs personnalisés
   - Export BPMN avec annotations

3. **Base de données persistante**
   - Historique des analyses
   - Bibliothèque de processus types
   - Suivi des recommandations

## 🏗️ Architecture technique

### Stack technologique
- **Framework**: Hono (edge-first, ultra-rapide)
- **Runtime**: Cloudflare Workers/Pages
- **Frontend**: HTML5 + TailwindCSS + Vanilla JS
- **Backend**: TypeScript + Hono
- **Déploiement**: PM2 (sandbox) + Cloudflare Pages (prod)

### Structure du projet
```
webapp/
├── src/
│   ├── index.tsx          # Application Hono principale
│   └── renderer.tsx       # Renderer JSX
├── public/static/
│   └── app.js            # Logique frontend
├── dist/                 # Build de production
├── ecosystem.config.cjs  # Configuration PM2
├── wrangler.jsonc        # Config Cloudflare
└── package.json          # Dépendances
```

### Modèles de données

#### Requête d'analyse
```typescript
{
  processDescription: string,  // Description du processus
  processType: 'text' | 'bpmn' // Type de format
}
```

#### Réponse d'analyse
```typescript
{
  processName: string,
  totalSteps: number,
  steps: [{
    id: number,
    description: string,
    automationType: 'digital' | 'agentic' | 'hybrid' | 'manual',
    complexity: string,
    reason: string,
    effort: string,
    benefits: string
  }],
  statistics: {
    total: number,
    digital: number,
    agentic: number,
    hybrid: number,
    manual: number,
    automationPotential: number,
    ...percentages
  },
  recommendations: [{
    priority: string,
    type: string,
    title: string,
    description: string,
    icon: string
  }]
}
```

## 📖 Guide utilisateur

### Comment utiliser l'application

1. **Accédez à l'application** via l'URL sandbox
2. **Choisissez le type de processus**:
   - Description textuelle (recommandé pour débuter)
   - Format BPMN (pour processus structurés)
3. **Décrivez votre processus** étape par étape
4. **Cliquez sur "Analyser avec l'IA Agentique"**
5. **Consultez les résultats**:
   - Vue d'ensemble du processus
   - Statistiques d'automatisation
   - Analyse détaillée par étape
   - Comparaison Digitalisation vs IA
   - Recommandations stratégiques

### Exemple de processus
```
Processus de commande de pizza jusqu'à sa livraison

1. Client passe commande (téléphone, site web, app)
2. Validation de la commande et paiement
3. Préparation de la pizza en cuisine
4. Cuisson
5. Emballage
6. Assignation au livreur
7. Livraison au client
8. Confirmation de livraison
```

## 🎯 Recommandations d'amélioration

### Priorité Immédiate
- ✅ Application fonctionnelle avec analyse de base
- 🔄 Connexion à une vraie API d'IA (OpenAI, Anthropic, etc.)
- 🔄 Persistance des données avec Cloudflare D1

### Moyen terme
- Export des analyses en PDF
- Bibliothèque de processus types pré-analysés
- Dashboard de suivi des transformations

### Long terme
- Module de calcul ROI détaillé
- Intégration avec outils BPM existants
- Marketplace d'agents IA spécialisés

## 🚀 Déploiement

### Environnement de développement (Sandbox)
```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Production (Cloudflare Pages)
```bash
npm run build
wrangler pages deploy dist --project-name agentic-process-analyzer
```

## 📊 Statut du projet

- **Version**: 1.0.0 (MVP)
- **Statut**: ✅ Fonctionnel en développement
- **Dernière mise à jour**: 15 novembre 2025
- **Tech Stack**: Hono + TypeScript + TailwindCSS
- **Hébergement**: Sandbox Novita.ai (dev)

## 🎨 Caractéristiques distinctives

- **IA Agentique**: Focus sur les agents IA autonomes, pas seulement l'automatisation classique
- **Analyse contextuelle**: Différenciation intelligente entre digitalisation et IA
- **Recommandations actionnables**: Priorisation stratégique (Quick Wins vs Investissements long terme)
- **Interface élégante**: Design moderne avec animations et UX soignée
- **Architecture edge-first**: Performance optimale avec Cloudflare Workers

---

**Développé avec ❤️ pour la transformation digitale et l'innovation IA**
