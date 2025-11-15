# Agentic Process Analyzer 🤖

Analyseur intelligent de processus métier utilisant l'IA Agentique pour identifier les opportunités d'automatisation.

## 🎯 Vue d'ensemble du projet

**Agentic Process Analyzer** est une application web innovante qui analyse vos processus métier et identifie automatiquement les **3 niveaux d'automatisation**:

### 🔵 Niveau 1 : Automatisation Basée sur Règles
- **RPA, workflows, scripts** pour tâches répétitives et prévisibles
- **Technologies**: UiPath, Power Automate, Zapier, Python scripts
- **ROI**: Rapide (< 6 mois)

### 🟢 Niveau 2 : IA Déterministe
- **Machine Learning classique** : classification, prédiction, détection de patterns
- **Technologies**: Scikit-learn, TensorFlow, Random Forest, SVM
- **ROI**: Moyen terme (6-12 mois)

### 🟣 Niveau 3 : IA Agentique (LLM)
- **Agents IA autonomes** avec raisonnement, génération et adaptation contextuelle
- **Technologies**: GPT-4, Claude, LangChain, AutoGPT, CrewAI
- **ROI**: Long terme (12-24 mois)

L'application fournit également des **recommandations stratégiques** pour déployer ces technologies de manière progressive et maximiser le ROI.

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
   - Classification sur 3 niveaux d'automatisation:
     - 🔵 **Automatisation par règles** (RPA, workflows, scripts)
     - 🟢 **IA Déterministe** (classification, prédiction, ML classique)
     - 🟣 **IA Agentique LLM** (agents autonomes, génération, raisonnement)
     - ⚪ **Manuel avec support IA** (IoT, vision par ordinateur, AR)

3. **Visualisations riches**
   - Statistiques d'automatisation en temps réel (3 niveaux)
   - Analyse détaillée étape par étape avec:
     - Type d'automatisation et sous-type
     - Complexité et effort d'implémentation
     - Technologies recommandées
     - Exemples concrets d'application
   - Vue comparative des 3 niveaux avec caractéristiques techniques
   - Recommandations stratégiques priorisées par phases (court, moyen, long terme)

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
    automationType: 'rule-based' | 'deterministic-ai' | 'agentic-ai' | 'manual',
    subType: string,              // Ex: "IA Déterministe", "LLM & IA Générative"
    complexity: string,
    reason: string,
    effort: string,
    benefits: string,
    examples: string,             // Exemples concrets d'application
    technology: string            // Technologies recommandées
  }],
  statistics: {
    total: number,
    ruleBased: number,
    deterministicAI: number,
    agenticAI: number,
    manual: number,
    automationPotential: number,
    ruleBasedPercentage: number,
    deterministicAIPercentage: number,
    agenticAIPercentage: number,
    manualPercentage: number
  },
  recommendations: [{
    priority: string,             // Ex: "Immédiat", "Court-Moyen Terme"
    type: string,                 // Ex: "Phase 1 - Quick Wins"
    title: string,
    description: string,
    icon: string,
    effort: string,               // Ex: "Faible", "Moyen", "Élevé"
    roi: string                   // Ex: "Rapide (< 6 mois)"
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

## 🎯 Roadmap et améliorations

### ✅ Phase actuelle (v1.0 - Complété)
- ✅ Analyse intelligente sur 3 niveaux d'automatisation
- ✅ Classification avancée : Règles, IA Déterministe, IA Agentique LLM
- ✅ Recommandations stratégiques avec effort et ROI
- ✅ Technologies recommandées par niveau

### 🔄 Phase 1 - Enrichissement (Court terme)
- 🔄 Intégration LLM réelle (GPT-4/Claude) pour analyse contextuelle
- 🔄 Base de données de patterns métier par industrie
- 🔄 Calcul ROI détaillé avec estimation des gains

### 📅 Phase 2 - Fonctionnalités avancées (Moyen terme)
- Export de rapports PDF/PowerPoint avec roadmap
- Persistance avec Cloudflare D1 (historique des analyses)
- Dashboard de suivi des transformations
- Templates de processus types

### 🚀 Phase 3 - Production et scaling (Long terme)
- Module de calcul ROI avancé avec business case
- Intégration avec outils BPM (Camunda, Bizagi)
- Marketplace d'agents IA spécialisés par cas d'usage
- API publique pour intégrations tierces

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

- **Approche 3 niveaux unique**: Distinction claire entre Règles, IA Déterministe et IA Agentique LLM
- **Analyse technique précise**: Technologies recommandées, effort d'implémentation et ROI par niveau
- **Vision stratégique progressive**: Déploiement par phases (Quick Wins → ML → LLM)
- **Recommandations actionnables**: Roadmap d'implémentation avec priorisation claire
- **Interface élégante**: Design moderne avec visualisations détaillées et UX soignée
- **Architecture edge-first**: Performance optimale avec Cloudflare Workers

---

**Développé avec ❤️ pour la transformation digitale et l'innovation IA**
