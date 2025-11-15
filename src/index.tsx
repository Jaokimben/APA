import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Predefined process templates
const processTemplates = {
  'kyc-aml': {
    name: 'Processus KYC/AML (Know Your Customer)',
    description: `Processus complet de vérification d'identité client et conformité anti-blanchiment selon les standards internationaux 2024

Sources: Thomson Reuters Legal, Fenergo, ComplyCube, FATF Guidelines

1. Initial Documentation (Programme d'Identification Client - CIP)
Collecte des informations et documents d'identité de base du client
   - Collecte des informations personnelles (nom, prénom, date de naissance, adresse)
   - Vérification de l'identité via documents officiels (passeport, carte d'identité, permis de conduire)
   - Capture de photo/selfie pour comparaison biométrique
   - Vérification de l'adresse (justificatif de domicile < 3 mois)
   - Collecte des informations professionnelles (employeur, source de revenus)
   - Signature numérique et consentement RGPD

2. Third-Party Verification (Vérification Tierce)
Vérification de l'authenticité des documents et des informations via bases de données externes
   - Vérification des documents d'identité auprès des autorités émettrices
   - Validation biométrique (reconnaissance faciale, liveness detection)
   - Vérification contre les listes de sanctions (OFAC, UN, EU)
   - Screening PEP (Politically Exposed Persons)
   - Contrôle des médias négatifs (adverse media screening)
   - Vérification de l'adresse via bases de données publiques
   - Validation du numéro de téléphone et email

3. Secure Data Storage (Stockage Sécurisé des Données)
Stockage conforme et sécurisé des données client avec chiffrement
   - Chiffrement des données sensibles (AES-256)
   - Stockage dans des bases de données sécurisées (ISO 27001)
   - Mise en place des contrôles d'accès basés sur les rôles (RBAC)
   - Journalisation de tous les accès (audit trail)
   - Backup automatique et redondance géographique
   - Respect des obligations de conservation (5-10 ans selon juridiction)
   - Conformité RGPD : droit à l'oubli, portabilité

4. Ongoing Monitoring (Surveillance Continue)
Surveillance continue des transactions et du comportement client
   - Monitoring en temps réel des transactions
   - Détection d'anomalies via machine learning
   - Alertes automatiques sur transactions inhabituelles
   - Vérification périodique des changements de statut PEP
   - Re-screening régulier contre les listes de sanctions
   - Analyse des patterns de transactions (velocity checks)
   - Surveillance des changements d'adresse ou coordonnées

5. Risk Assessment and Profiling (Évaluation et Profilage des Risques)
Classification du niveau de risque client et ajustement des mesures de vigilance
   - Calcul du score de risque client (risk scoring)
   - Classification : Low Risk / Medium Risk / High Risk
   - Évaluation des facteurs de risque géographique
   - Analyse du type de produits/services utilisés
   - Évaluation du volume et fréquence des transactions
   - Due Diligence Simplifiée (SDD) pour clients low-risk
   - Due Diligence Renforcée (EDD) pour clients high-risk
   - Révision périodique du profil de risque (annuel/trimestriel)

6. Compliance with AML Regulations (Conformité Réglementaire AML)
Garantir la conformité continue avec les réglementations anti-blanchiment
   - Génération de rapports de transactions suspectes (STR/SAR)
   - Déclaration TRACFIN (France) ou FinCEN (USA)
   - Reporting régulier aux autorités de régulation
   - Audit interne des procédures KYC/AML
   - Formation continue des équipes sur les nouvelles réglementations
   - Mise à jour des politiques et procédures
   - Documentation complète pour audits externes`
  },
  'customer-onboarding': {
    name: 'Onboarding Client Digital (Banque/Fintech)',
    description: `Processus complet d'ouverture de compte et onboarding digital pour services financiers

1. Pré-qualification et Éligibilité
   - Questionnaire de pré-qualification (âge, résidence, nationalité)
   - Vérification de l'éligibilité géographique
   - Sélection du type de compte/produit
   - Présentation des conditions générales

2. Vérification d'Identité (e-KYC)
   - Capture photo du document d'identité
   - Selfie vidéo avec liveness detection
   - Vérification biométrique
   - Contrôle anti-fraude documentaire`
  },
  'purchase-to-pay': {
    name: 'Processus Purchase-to-Pay (P2P)',
    description: `Processus complet d'achat et paiement fournisseurs

1. Demande d'achat
   - Expression du besoin par le demandeur
   - Création de la demande d'achat
   - Validation hiérarchique

2. Création de commande
   - Sélection du fournisseur
   - Négociation des conditions
   - Génération du bon de commande

3. Réception des biens/services
   - Contrôle de la livraison
   - Validation de la conformité
   - Enregistrement de la réception

4. Traitement de la facture
   - Réception de la facture fournisseur
   - Rapprochement 3-way match
   - Validation et approbation

5. Paiement
   - Planification du paiement
   - Exécution du virement
   - Archivage et comptabilisation`
  }
};

// API route to get predefined process
app.get('/api/process/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const template = processTemplates[id as keyof typeof processTemplates]
    
    if (!template) {
      return c.json({ error: 'Process template not found' }, 404)
    }
    
    return c.json(template)
  } catch (error) {
    return c.json({ error: 'Error loading process template' }, 500)
  }
})

// API route for process analysis
app.post('/api/analyze', async (c) => {
  try {
    const { processDescription, processType } = await c.req.json()
    
    if (!processDescription) {
      return c.json({ error: 'Process description is required' }, 400)
    }

    // Simulate AI analysis with comprehensive response
    const analysis = analyzeProcess(processDescription, processType)
    
    return c.json(analysis)
  } catch (error) {
    return c.json({ error: 'Invalid request format' }, 400)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agentic Process Analyzer - Automatisation Intelligente des Processus</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#3b82f6',
                  secondary: '#8b5cf6',
                  accent: '#06b6d4',
                }
              }
            }
          }
        </script>
        <style>
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gradient-bg {
            background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
          .process-step {
            transition: all 0.3s ease;
          }
          .process-step:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="gradient-bg text-white py-8 shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-robot text-4xl"></i>
                        <div>
                            <h1 class="text-3xl font-bold">Agentic Process Analyzer</h1>
                            <p class="text-blue-100 text-sm">Transformation Digitale & IA Agentique</p>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-4">
                        <i class="fas fa-brain text-2xl"></i>
                        <i class="fas fa-network-wired text-2xl"></i>
                        <i class="fas fa-chart-line text-2xl"></i>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Analysez et Automatisez vos Processus Métier
                </h2>
                <p class="text-gray-600 mb-4">
                    Découvrez comment l'<strong>IA Agentique</strong> peut révolutionner vos processus. 
                    Identifiez les étapes automatisables par digitalisation classique et celles qui nécessitent 
                    des agents IA autonomes pour gérer la complexité et l'imprévisibilité.
                </p>
                <div class="grid md:grid-cols-3 gap-4 mt-6">
                    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <i class="fas fa-gears text-blue-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">Automatisation Basée sur Règles</h3>
                        <p class="text-sm text-gray-600">RPA, workflows, scripts pour tâches répétitives</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <i class="fas fa-network-wired text-green-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">IA Déterministe</h3>
                        <p class="text-sm text-gray-600">Classification, prédiction, reconnaissance de patterns</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <i class="fas fa-robot text-purple-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">IA Agentique (LLM)</h3>
                        <p class="text-sm text-gray-600">Agents autonomes avec raisonnement et génération</p>
                    </div>
                </div>
            </div>

            <!-- Process Input -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-keyboard text-green-500 mr-2"></i>
                    Décrivez votre Processus
                </h2>
                
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2">Type de Processus</label>
                    <div class="flex flex-wrap gap-3">
                        <button onclick="setProcessType('text')" id="btn-text" 
                                class="process-type-btn px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold">
                            <i class="fas fa-align-left mr-2"></i>Description Textuelle
                        </button>
                        <button onclick="setProcessType('bpmn')" id="btn-bpmn" 
                                class="process-type-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">
                            <i class="fas fa-diagram-project mr-2"></i>Format BPMN
                        </button>
                    </div>
                </div>

                <div class="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <label class="block text-gray-700 font-semibold mb-2">
                        <i class="fas fa-book-open text-indigo-500 mr-2"></i>
                        Ou choisissez un processus pré-défini
                    </label>
                    <p class="text-sm text-gray-600 mb-3">
                        Processus documentés selon les meilleures pratiques internationales
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="loadPredefinedProcess('kyc-aml')" 
                                class="px-3 py-2 rounded-lg bg-white border-2 border-indigo-300 text-gray-700 hover:bg-indigo-100 text-sm font-medium transition">
                            <i class="fas fa-shield-alt mr-1"></i>KYC/AML Compliance
                        </button>
                        <button onclick="loadPredefinedProcess('customer-onboarding')" 
                                class="px-3 py-2 rounded-lg bg-white border-2 border-indigo-300 text-gray-700 hover:bg-indigo-100 text-sm font-medium transition">
                            <i class="fas fa-user-plus mr-1"></i>Onboarding Client
                        </button>
                        <button onclick="loadPredefinedProcess('purchase-to-pay')" 
                                class="px-3 py-2 rounded-lg bg-white border-2 border-indigo-300 text-gray-700 hover:bg-indigo-100 text-sm font-medium transition">
                            <i class="fas fa-shopping-cart mr-1"></i>Purchase-to-Pay
                        </button>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="processInput" class="block text-gray-700 font-semibold mb-2">
                        Description du Processus
                    </label>
                    <textarea 
                        id="processInput" 
                        rows="8" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Exemple: Processus de commande de pizza jusqu'à sa livraison&#10;&#10;1. Client passe commande (téléphone, site web, app)&#10;2. Validation de la commande et paiement&#10;3. Préparation de la pizza en cuisine&#10;4. Cuisson&#10;5. Emballage&#10;6. Assignation au livreur&#10;7. Livraison au client&#10;8. Confirmation de livraison"
                    ></textarea>
                </div>

                <button 
                    onclick="analyzeProcess()" 
                    id="analyzeBtn"
                    class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg">
                    <i class="fas fa-magic mr-2"></i>
                    Analyser avec l'IA Agentique
                </button>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" class="hidden">
                <!-- Process Overview -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-clipboard-check text-blue-500 mr-2"></i>
                        Analyse du Processus
                    </h2>
                    <div id="processOverview"></div>
                </div>

                <!-- Process Visualization -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-project-diagram text-indigo-500 mr-2"></i>
                        Visualisation du Processus
                    </h2>
                    <div class="mb-4 flex gap-2">
                        <button onclick="switchDiagram('flow')" id="btn-flow" class="diagram-btn px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold text-sm">
                            <i class="fas fa-stream mr-2"></i>Flux de Processus
                        </button>
                        <button onclick="switchDiagram('swimlane')" id="btn-swimlane" class="diagram-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm">
                            <i class="fas fa-layer-group mr-2"></i>Swimlane (par niveau)
                        </button>
                    </div>
                    <div id="processDiagram" class="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto"></div>
                </div>

                <!-- Automation Analysis -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar text-purple-500 mr-2"></i>
                        Potentiel d'Automatisation
                    </h2>
                    <div id="automationStats" class="grid md:grid-cols-3 gap-4 mb-6"></div>
                </div>

                <!-- Detailed Steps -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-list-ol text-cyan-500 mr-2"></i>
                        Analyse Détaillée des Étapes
                    </h2>
                    <div id="stepsAnalysis"></div>
                </div>

                <!-- Comparison View -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-layer-group text-green-500 mr-2"></i>
                        Niveaux d'Automatisation
                    </h2>
                    <div id="comparisonView" class="grid md:grid-cols-3 gap-4"></div>
                </div>

                <!-- Recommendations -->
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Recommandations Stratégiques
                    </h2>
                    <div id="recommendations"></div>
                </div>

                <!-- Automation Scenarios -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-rocket text-orange-500 mr-2"></i>
                        Scénarios d'Automatisation avec IA
                    </h2>
                    <p class="text-gray-600 mb-6">
                        Découvrez comment implémenter l'automatisation de votre processus selon 3 scénarios progressifs
                    </p>
                    <div id="automationScenarios"></div>
                </div>
            </div>

            <!-- Loading Spinner -->
            <div id="loadingSpinner" class="hidden text-center py-12">
                <i class="fas fa-spinner fa-spin text-6xl text-blue-500 mb-4"></i>
                <p class="text-xl text-gray-600">Analyse en cours avec l'IA...</p>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-6 mt-12">
            <div class="container mx-auto px-4 text-center">
                <p class="mb-2">
                    <i class="fas fa-brain mr-2"></i>
                    Powered by Agentic AI Technology
                </p>
                <p class="text-gray-400 text-sm">
                    Transformation Digitale & Intelligence Artificielle
                </p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Process analysis logic
function analyzeProcess(description: string, type: string = 'text') {
  const steps = extractSteps(description)
  const analyzedSteps = steps.map((step, index) => {
    const automationType = determineAutomationType(step)
    return {
      id: index + 1,
      description: step,
      automationType: automationType.type,
      subType: automationType.subType,
      complexity: automationType.complexity,
      reason: automationType.reason,
      effort: automationType.effort,
      benefits: automationType.benefits,
      examples: automationType.examples,
      technology: automationType.technology
    }
  })

  const stats = calculateStats(analyzedSteps)
  
  return {
    processName: extractProcessName(description),
    totalSteps: analyzedSteps.length,
    steps: analyzedSteps,
    statistics: stats,
    recommendations: generateRecommendations(analyzedSteps, stats)
  }
}

function extractSteps(description: string): string[] {
  const lines = description.split('\n').filter(line => line.trim())
  const steps: string[] = []
  
  for (const line of lines) {
    const cleaned = line.trim().replace(/^\d+[\.\)]\s*/, '')
    if (cleaned.length > 5) {
      steps.push(cleaned)
    }
  }
  
  return steps.length > 0 ? steps : [description]
}

function extractProcessName(description: string): string {
  const firstLine = description.split('\n')[0]
  if (firstLine.toLowerCase().includes('processus')) {
    return firstLine.replace(/processus\s+de\s+/i, '').trim()
  }
  return 'Processus analysé'
}

function determineAutomationType(step: string) {
  const stepLower = step.toLowerCase()
  
  // Keywords for different automation types
  
  // 1. Rule-based automation (RPA, workflows, scripts)
  const ruleBasedKeywords = ['saisie', 'enregistrement', 'notification', 'email', 'confirmation', 'transfert', 'copie', 'mise à jour', 'archivage']
  
  // 2. Deterministic AI (classification, prediction, pattern recognition)
  const deterministicAIKeywords = ['validation', 'vérification', 'détection', 'reconnaissance', 'classification', 'tri', 'filtrage', 'scoring', 'prédiction', 'routage intelligent']
  
  // 3. Agentic AI (LLM, generative, reasoning)
  const agenticAIKeywords = ['décision', 'analyse', 'évaluation', 'jugement', 'négociation', 'recommandation', 'rédaction', 'génération', 'adaptation', 'créativité', 'compréhension', 'interprétation', 'résolution', 'optimisation complexe']
  
  // 4. Manual tasks
  const manualKeywords = ['préparation', 'cuisson', 'emballage', 'livraison physique', 'manipulation', 'assemblage', 'fabrication']
  
  // Check for Agentic AI (LLM-based)
  if (agenticAIKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'agentic-ai',
      subType: 'LLM & IA Générative',
      complexity: 'Élevée',
      reason: 'Nécessite raisonnement, compréhension contextuelle ou génération de contenu',
      effort: 'Élevé',
      benefits: 'Automatisation de tâches cognitives complexes avec adaptation',
      examples: 'Agents autonomes, génération de réponses, analyse sémantique',
      technology: 'GPT-4, Claude, LangChain, AutoGPT'
    }
  }
  
  // Check for Deterministic AI
  if (deterministicAIKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'deterministic-ai',
      subType: 'IA Déterministe',
      complexity: 'Moyenne',
      reason: 'Classification, prédiction ou reconnaissance de patterns',
      effort: 'Moyen',
      benefits: 'Automatisation intelligente basée sur apprentissage supervisé',
      examples: 'Classification de documents, détection de fraude, scoring',
      technology: 'Scikit-learn, TensorFlow, Random Forest, SVM'
    }
  }
  
  // Check for Rule-based automation
  if (ruleBasedKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'rule-based',
      subType: 'Automatisation par Règles',
      complexity: 'Faible',
      reason: 'Tâche répétitive suivant des règles précises et prévisibles',
      effort: 'Faible',
      benefits: 'ROI rapide, réduction immédiate des erreurs',
      examples: 'RPA, workflows, scripts, intégrations API',
      technology: 'UiPath, Power Automate, Zapier, Python scripts'
    }
  }
  
  // Special cases requiring hybrid approaches
  if (stepLower.includes('paiement') || stepLower.includes('payment')) {
    return {
      type: 'rule-based',
      subType: 'Automatisation par Règles + IA Déterministe',
      complexity: 'Moyenne',
      reason: 'Processus transactionnel avec validation et détection de fraude',
      effort: 'Moyen',
      benefits: 'Sécurisation et fluidification des transactions',
      examples: 'Gateway de paiement avec détection de fraude',
      technology: 'Stripe, PayPal + ML fraud detection'
    }
  }
  
  if (stepLower.includes('commande') && !stepLower.includes('passe')) {
    return {
      type: 'deterministic-ai',
      subType: 'IA Déterministe',
      complexity: 'Moyenne',
      reason: 'Validation et routage intelligent des commandes',
      effort: 'Moyen',
      benefits: 'Optimisation du flux de commandes et priorisation',
      examples: 'Système de gestion intelligente des commandes',
      technology: 'Machine Learning pour priorisation'
    }
  }
  
  if (stepLower.includes('assignation') || stepLower.includes('attribution')) {
    return {
      type: 'deterministic-ai',
      subType: 'IA Déterministe',
      complexity: 'Moyenne',
      reason: 'Optimisation de l\'assignation basée sur critères multiples',
      effort: 'Moyen',
      benefits: 'Distribution optimale des ressources',
      examples: 'Algorithmes d\'optimisation, load balancing',
      technology: 'Algorithmes d\'optimisation, ML'
    }
  }
  
  // Check for manual tasks
  if (manualKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'manual',
      subType: 'Manuel avec Support IA',
      complexity: 'Variable',
      reason: 'Nécessite intervention physique ou expertise humaine',
      effort: 'N/A',
      benefits: 'Support IA possible : guidage, optimisation, prédiction',
      examples: 'Assistants IA, vision par ordinateur pour guidage',
      technology: 'IoT sensors, Computer Vision, AR'
    }
  }
  
  // Default: analyze based on complexity indicators
  if (stepLower.includes('client') || stepLower.includes('utilisateur') || stepLower.includes('demande')) {
    return {
      type: 'agentic-ai',
      subType: 'LLM & IA Générative',
      complexity: 'Moyenne-Élevée',
      reason: 'Interaction client nécessitant compréhension et personnalisation',
      effort: 'Moyen-Élevé',
      benefits: 'Expérience client personnalisée et scalable',
      examples: 'Chatbots intelligents, assistants virtuels',
      technology: 'GPT-4, Claude, Rasa'
    }
  }
  
  // Final default
  return {
    type: 'rule-based',
    subType: 'Automatisation par Règles',
    complexity: 'Faible-Moyenne',
    reason: 'Processus standard automatisable par règles',
    effort: 'Faible-Moyen',
    benefits: 'Gain d\'efficacité avec automatisation classique',
    examples: 'Workflows, scripts',
    technology: 'Automatisation standard'
  }
}

function calculateStats(steps: any[]) {
  const total = steps.length
  const ruleBased = steps.filter(s => s.automationType === 'rule-based').length
  const deterministicAI = steps.filter(s => s.automationType === 'deterministic-ai').length
  const agenticAI = steps.filter(s => s.automationType === 'agentic-ai').length
  const manual = steps.filter(s => s.automationType === 'manual').length
  
  const automatable = ruleBased + deterministicAI + agenticAI
  
  return {
    total,
    ruleBased,
    deterministicAI,
    agenticAI,
    manual,
    automatable,
    automationPotential: Math.round((automatable / total) * 100),
    ruleBasedPercentage: Math.round((ruleBased / total) * 100),
    deterministicAIPercentage: Math.round((deterministicAI / total) * 100),
    agenticAIPercentage: Math.round((agenticAI / total) * 100),
    manualPercentage: Math.round((manual / total) * 100)
  }
}

function generateRecommendations(steps: any[], stats: any) {
  const recommendations = []
  
  // Phase 1: Rule-based automation (Quick Wins)
  if (stats.ruleBasedPercentage > 0) {
    recommendations.push({
      priority: 'Immédiat',
      type: 'Phase 1 - Quick Wins',
      title: 'Automatisation par Règles',
      description: `${stats.ruleBasedPercentage}% des étapes (${stats.ruleBased} étapes) peuvent être automatisées rapidement avec RPA, workflows et scripts. ROI rapide (< 6 mois). Technologies : UiPath, Power Automate, Zapier.`,
      icon: 'rocket',
      effort: 'Faible',
      roi: 'Rapide (< 6 mois)'
    })
  }
  
  // Phase 2: Deterministic AI (Medium term)
  if (stats.deterministicAIPercentage > 0) {
    recommendations.push({
      priority: 'Court-Moyen Terme',
      type: 'Phase 2 - IA Déterministe',
      title: 'Classification et Prédiction',
      description: `${stats.deterministicAIPercentage}% des étapes (${stats.deterministicAI} étapes) nécessitent de l'IA déterministe pour classification, détection ou prédiction. Technologies : Scikit-learn, TensorFlow, Random Forest.`,
      icon: 'network-wired',
      effort: 'Moyen',
      roi: 'Moyen terme (6-12 mois)'
    })
  }
  
  // Phase 3: Agentic AI (Strategic)
  if (stats.agenticAIPercentage > 0) {
    recommendations.push({
      priority: 'Moyen-Long Terme',
      type: 'Phase 3 - IA Agentique',
      title: 'Agents IA Autonomes (LLM)',
      description: `${stats.agenticAIPercentage}% des étapes (${stats.agenticAI} étapes) nécessitent des agents IA avec LLM pour raisonnement, génération et adaptation. Technologies : GPT-4, Claude, LangChain, AutoGPT.`,
      icon: 'brain',
      effort: 'Élevé',
      roi: 'Long terme (12-24 mois)'
    })
  }
  
  // Manual tasks with AI support
  if (stats.manualPercentage > 30) {
    recommendations.push({
      priority: 'Long Terme',
      type: 'Support & Optimisation',
      title: 'Assistance IA pour Tâches Manuelles',
      description: `${stats.manualPercentage}% des étapes (${stats.manual} étapes) restent manuelles mais peuvent bénéficier d'assistants IA, vision par ordinateur ou IoT pour guidage et optimisation.`,
      icon: 'hands-helping',
      effort: 'Variable',
      roi: 'Cas par cas'
    })
  }
  
  // Overall potential
  if (stats.automationPotential > 70) {
    recommendations.push({
      priority: 'Stratégique',
      type: 'Vision Globale',
      title: 'Excellent Potentiel d\'Automatisation',
      description: `Avec ${stats.automationPotential}% d'automatisation possible, ce processus est un candidat prioritaire pour transformation digitale. Approche recommandée : déploiement progressif en 3 phases (Règles → IA Déterministe → IA Agentique).`,
      icon: 'trophy',
      effort: 'Progressif',
      roi: 'Très élevé'
    })
  } else if (stats.automationPotential > 40) {
    recommendations.push({
      priority: 'Stratégique',
      type: 'Vision Globale',
      title: 'Bon Potentiel d\'Automatisation',
      description: `${stats.automationPotential}% d'automatisation possible. Priorisez les quick wins (règles) puis évaluez l'opportunité d'investir dans l'IA selon le ROI attendu.`,
      icon: 'chart-line',
      effort: 'Progressif',
      roi: 'Élevé'
    })
  }
  
  return recommendations
}

export default app
