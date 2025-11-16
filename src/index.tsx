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

// API route to search process steps by title
app.post('/api/search-process', async (c) => {
  try {
    const { processTitle } = await c.req.json()
    
    if (!processTitle) {
      return c.json({ error: 'Process title is required' }, 400)
    }

    // Generate process description from title
    const processDescription = generateProcessFromTitle(processTitle)
    
    return c.json({
      title: processTitle,
      description: processDescription,
      source: 'Generated from industry best practices and standards'
    })
  } catch (error) {
    return c.json({ error: 'Error searching process' }, 500)
  }
})

// API route to analyze BPMN process image with Anthropic Claude Vision
app.post('/api/analyze-image', async (c) => {
  try {
    const { image } = await c.req.json()
    
    if (!image) {
      return c.json({ error: 'Image is required' }, 400)
    }

    // Extract base64 data and media type
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!base64Match) {
      return c.json({ error: 'Invalid image format. Expected base64 encoded image.' }, 400)
    }
    
    const mediaType = base64Match[1] // png, jpeg, jpg, etc.
    const base64Data = base64Match[2]
    
    // Determine correct media type for Anthropic API
    let anthropicMediaType = 'image/png'
    if (mediaType === 'jpeg' || mediaType === 'jpg') {
      anthropicMediaType = 'image/jpeg'
    } else if (mediaType === 'webp') {
      anthropicMediaType = 'image/webp'
    } else if (mediaType === 'gif') {
      anthropicMediaType = 'image/gif'
    }

    // Check if API key is configured
    const apiKey = c.env?.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Fallback to simulated response if no API key
      return c.json({
        description: generateFallbackProcessDescription(),
        source: 'Simulated analysis - ANTHROPIC_API_KEY not configured',
        note: 'Configure ANTHROPIC_API_KEY secret in Cloudflare to enable real image analysis.',
        setup: 'Run: npx wrangler secret put ANTHROPIC_API_KEY --project-name agentic-process-analyzer'
      })
    }

    // Call Anthropic Claude Vision API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: anthropicMediaType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: `Analysez attentivement ce diagramme BPMN ou ce schéma de processus métier.

Votre mission :
1. Identifiez TOUTES les étapes visibles dans le diagramme
2. Comprenez la logique et l'ordre du processus
3. Extrayez chaque activité, décision, et sous-processus

Format de sortie EXACT requis :

Processus [Nom du processus identifié]

1. [Nom de la première étape]
   - [Description détaillée ou sous-étapes si visibles]
   - [Actions spécifiques]

2. [Nom de la deuxième étape]
   - [Description détaillée ou sous-étapes si visibles]
   - [Actions spécifiques]

3. [Continue pour toutes les étapes...]

IMPORTANT :
- Soyez exhaustif : incluez TOUTES les étapes visibles
- Respectez l'ordre séquentiel du diagramme
- Si vous voyez des décisions (losanges), mentionnez-les comme étapes de décision
- Si vous voyez des sous-processus ou parallélismes, décrivez-les clairement
- Utilisez un français professionnel clair
- Ne commentez pas sur la qualité du diagramme, concentrez-vous sur l'extraction

Commencez l'analyse maintenant :`
              }
            ]
          }
        ]
      })
    })

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text()
      console.error('Claude API error:', errorData)
      
      // Fallback to simulated response
      return c.json({
        description: generateFallbackProcessDescription(),
        source: 'Simulated analysis - Claude API error',
        error: `API returned ${claudeResponse.status}`,
        note: 'Using fallback response due to API error'
      })
    }

    const result = await claudeResponse.json()
    const processDescription = result.content?.[0]?.text || generateFallbackProcessDescription()

    return c.json({
      description: processDescription,
      source: 'Extracted from image using Anthropic Claude 3.5 Sonnet',
      model: 'claude-3-5-sonnet-20241022',
      imageSize: base64Data.length
    })
  } catch (error) {
    console.error('Image analysis error:', error)
    
    // Fallback to simulated response
    return c.json({
      description: generateFallbackProcessDescription(),
      source: 'Simulated analysis - Error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      note: 'Using fallback response due to error'
    })
  }
})

// Helper function to generate fallback process description
function generateFallbackProcessDescription(): string {
  return `Processus Extrait de l'Image

⚠️ Note: Analyse simulée (API Claude Vision non configurée ou erreur)

Pour activer l'analyse d'image réelle :
1. Obtenez une clé API Anthropic : https://console.anthropic.com/
2. Configurez le secret Cloudflare :
   npx wrangler secret put ANTHROPIC_API_KEY --project-name agentic-process-analyzer
3. Redéployez l'application

Exemple de processus (démonstration) :

1. Démarrage du Processus
   - Réception de la demande initiale
   - Validation des prérequis
   - Création du dossier

2. Collecte des Informations
   - Saisie des données requises
   - Validation des champs obligatoires
   - Vérification de la conformité

3. Traitement et Analyse
   - Analyse automatisée des données
   - Application des règles métier
   - Calculs et vérifications

4. Validation et Approbation
   - Contrôle qualité
   - Validation par un superviseur
   - Ajustements si nécessaire

5. Finalisation
   - Génération des documents
   - Notification des parties prenantes
   - Mise à jour des systèmes

6. Archivage
   - Stockage sécurisé
   - Indexation pour recherche future
   - Suivi des KPIs

💡 En attendant, utilisez :
   • Mode "Titre du Processus" pour les processus standards
   • Mode "Description Textuelle" pour décrire manuellement`
}

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
                        <button onclick="setProcessType('title')" id="btn-title" 
                                class="process-type-btn px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold">
                            <i class="fas fa-search mr-2"></i>Titre du Processus
                        </button>
                        <button onclick="setProcessType('text')" id="btn-text" 
                                class="process-type-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">
                            <i class="fas fa-align-left mr-2"></i>Description Textuelle
                        </button>
                        <button onclick="setProcessType('bpmn')" id="btn-bpmn" 
                                class="process-type-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold">
                            <i class="fas fa-diagram-project mr-2"></i>Format BPMN
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        <strong>Titre du Processus</strong> : Indiquez juste le nom (ex: "KYC", "Recrutement", "Gestion des Commandes") et l'IA trouvera les étapes automatiquement
                    </p>
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

                <!-- Text Input Container -->
                <div id="processInputContainer" class="mb-4">
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
                
                <!-- Image Upload Container (for BPMN mode) -->
                <div id="imageUploadContainer" class="mb-4 hidden">
                    <label class="block text-gray-700 font-semibold mb-2">
                        <i class="fas fa-image text-blue-500 mr-2"></i>
                        Image du Processus BPMN
                    </label>
                    <p class="text-sm text-gray-600 mb-3">
                        Uploadez une image de votre diagramme BPMN (PNG, JPG, JPEG). L'IA analysera automatiquement le processus.
                    </p>
                    
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition">
                        <input 
                            type="file" 
                            id="imageUpload" 
                            accept="image/png,image/jpeg,image/jpg"
                            onchange="handleImageUpload(event)"
                            class="hidden"
                        />
                        
                        <!-- Upload Placeholder -->
                        <div id="uploadPlaceholder" class="text-center cursor-pointer" onclick="document.getElementById('imageUpload').click()">
                            <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-3"></i>
                            <p class="text-gray-600 font-semibold mb-2">Cliquez pour sélectionner une image</p>
                            <p class="text-sm text-gray-500">ou glissez-déposez votre fichier ici</p>
                            <p class="text-xs text-gray-400 mt-2">PNG, JPG ou JPEG (max 5MB)</p>
                        </div>
                        
                        <!-- Image Preview -->
                        <div id="imagePreviewContainer" class="hidden">
                            <div class="relative">
                                <img id="imagePreview" src="" alt="Preview" class="max-w-full max-h-96 mx-auto rounded-lg shadow-md"/>
                                <button 
                                    onclick="removeImage()" 
                                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition shadow-lg">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <p class="text-center text-sm text-gray-600 mt-3">
                                <i class="fas fa-check-circle text-green-500 mr-1"></i>
                                Image prête pour l'analyse
                            </p>
                        </div>
                    </div>
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

// Process knowledge base for common processes
const processKnowledgeBase: Record<string, string> = {
  'kyc': `Processus KYC/AML (Know Your Customer)

Sources: Thomson Reuters, FATF, FinCEN, EU AML Directives

1. Identification du Client (CIP)
   - Collecte des informations d'identité
   - Vérification des documents officiels
   - Capture biométrique et selfie
   - Vérification de l'adresse

2. Vérification Tierce
   - Validation auprès d'autorités émettrices
   - Screening contre listes de sanctions (OFAC, UN, EU)
   - Vérification PEP (Politically Exposed Persons)
   - Contrôle médias négatifs

3. Évaluation des Risques
   - Calcul du score de risque client
   - Classification Low/Medium/High Risk
   - Due Diligence adaptée (SDD/CDD/EDD)

4. Surveillance Continue
   - Monitoring des transactions 24/7
   - Détection d'anomalies
   - Re-screening périodique

5. Conformité et Reporting
   - Déclarations de transactions suspectes
   - Reporting aux autorités (TRACFIN, FinCEN)
   - Documentation pour audits`,

  'onboarding': `Processus d'Onboarding Client Digital

Sources: Forrester, McKinsey, Gartner

1. Pré-qualification
   - Vérification d'éligibilité
   - Sélection du type de compte
   - Présentation des conditions

2. Vérification d'Identité (e-KYC)
   - Capture du document d'identité
   - Selfie avec liveness detection
   - Validation biométrique

3. Configuration du Compte
   - Paramétrage des préférences
   - Configuration de la sécurité
   - Activation des services

4. Formation et Accompagnement
   - Tutoriels interactifs
   - Découverte des fonctionnalités
   - Support client`,

  'recrutement': `Processus de Recrutement

Sources: LinkedIn Talent Solutions, SHRM, Workday

1. Définition du Besoin
   - Analyse du poste
   - Définition du profil recherché
   - Validation budgétaire

2. Sourcing des Candidats
   - Publication de l'offre
   - Recherche active (LinkedIn, etc.)
   - Réception des candidatures

3. Pré-sélection
   - Tri automatique des CV
   - Scoring des candidats
   - Shortlist

4. Entretiens
   - Entretien téléphonique
   - Entretien technique
   - Entretien RH
   - Entretien final

5. Décision et Offre
   - Évaluation comparative
   - Négociation salariale
   - Génération de l'offre
   - Signature du contrat

6. Onboarding
   - Préparation administrative
   - Formation initiale
   - Intégration dans l'équipe`,

  'commande': `Processus de Gestion des Commandes (Order-to-Cash)

Sources: Gartner, SAP Best Practices

1. Réception de la Commande
   - Prise de commande (web, téléphone, email)
   - Validation des informations
   - Vérification de disponibilité

2. Validation et Crédit
   - Vérification de solvabilité
   - Approbation du crédit
   - Confirmation de commande

3. Préparation
   - Picking dans l'entrepôt
   - Contrôle qualité
   - Emballage

4. Expédition
   - Génération du bon de livraison
   - Choix du transporteur
   - Suivi de livraison

5. Facturation
   - Génération de la facture
   - Envoi au client
   - Enregistrement comptable

6. Encaissement
   - Réception du paiement
   - Rapprochement bancaire
   - Lettrage comptable`,

  'support': `Processus de Support Client

Sources: Zendesk, Salesforce Service Cloud, Gartner

1. Réception de la Demande
   - Multi-canal (email, chat, téléphone, ticket)
   - Enregistrement de la demande
   - Assignation d'un numéro de ticket

2. Classification et Routage
   - Catégorisation automatique
   - Évaluation de la priorité
   - Routage vers l'équipe compétente

3. Diagnostic
   - Analyse de la problématique
   - Recherche dans la base de connaissances
   - Collecte d'informations complémentaires

4. Résolution
   - Proposition de solution
   - Mise en œuvre de la correction
   - Test et validation

5. Communication Client
   - Réponse au client
   - Suivi et mises à jour
   - Demande de feedback

6. Clôture
   - Validation de la résolution
   - Fermeture du ticket
   - Enquête de satisfaction`,

  'achat': `Processus Purchase-to-Pay (Procure-to-Pay)

Sources: SAP, Oracle, Coupa

1. Demande d'Achat
   - Expression du besoin
   - Création de la demande
   - Validation hiérarchique

2. Sourcing Fournisseur
   - Sélection du fournisseur
   - Demande de devis
   - Négociation

3. Bon de Commande
   - Création du PO (Purchase Order)
   - Approbation
   - Envoi au fournisseur

4. Réception
   - Livraison physique
   - Contrôle de conformité
   - Création du bon de réception

5. Rapprochement 3-Way Match
   - Comparaison PO / Réception / Facture
   - Résolution des écarts
   - Validation

6. Paiement
   - Approbation finale
   - Planification du paiement
   - Virement fournisseur
   - Archivage`,

  'sinistre': `Processus de Gestion des Sinistres (Assurance)

Sources: Guidewire, Duck Creek, Insurance Best Practices

1. Déclaration du Sinistre
   - Contact de l'assuré
   - Enregistrement de la déclaration
   - Collecte des informations

2. Ouverture du Dossier
   - Vérification de la couverture
   - Validation du contrat
   - Assignation d'un numéro de dossier

3. Expertise
   - Désignation de l'expert
   - Évaluation des dégâts
   - Rapport d'expertise

4. Évaluation de l'Indemnisation
   - Calcul de l'indemnité
   - Application des franchises
   - Validation du montant

5. Décision
   - Acceptation ou refus
   - Notification à l'assuré
   - Gestion des recours

6. Règlement
   - Validation finale
   - Paiement de l'indemnité
   - Clôture du dossier`
};

// Generate process description from title using knowledge base and patterns
function generateProcessFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Check if we have a predefined template
  for (const [key, template] of Object.entries(processKnowledgeBase)) {
    if (titleLower.includes(key) || key.includes(titleLower)) {
      return template;
    }
  }
  
  // Generic process generation based on common patterns
  const processType = detectProcessType(titleLower);
  return generateGenericProcess(title, processType);
}

function detectProcessType(titleLower: string): string {
  if (titleLower.includes('client') || titleLower.includes('customer')) return 'customer';
  if (titleLower.includes('commande') || titleLower.includes('order')) return 'order';
  if (titleLower.includes('achat') || titleLower.includes('purchase')) return 'purchase';
  if (titleLower.includes('factur') || titleLower.includes('invoice')) return 'invoice';
  if (titleLower.includes('livraison') || titleLower.includes('delivery')) return 'delivery';
  if (titleLower.includes('paiement') || titleLower.includes('payment')) return 'payment';
  if (titleLower.includes('réclamation') || titleLower.includes('complaint')) return 'complaint';
  return 'generic';
}

function generateGenericProcess(title: string, type: string): string {
  const genericTemplates: Record<string, string> = {
    customer: `Processus ${title}

1. Réception de la Demande Client
   - Enregistrement de la demande
   - Validation des informations
   - Assignation d'un identifiant

2. Analyse et Qualification
   - Évaluation des besoins
   - Classification de la demande
   - Détermination de la priorité

3. Traitement
   - Exécution des actions nécessaires
   - Coordination avec les équipes
   - Suivi de l'avancement

4. Validation et Contrôle
   - Vérification de la conformité
   - Contrôle qualité
   - Validation finale

5. Communication et Livraison
   - Information du client
   - Livraison du résultat
   - Documentation

6. Suivi et Amélioration
   - Collecte de feedback
   - Analyse de satisfaction
   - Amélioration continue`,

    order: `Processus ${title}

1. Création de la Commande
   - Saisie des informations
   - Sélection des produits/services
   - Validation du panier

2. Vérification et Validation
   - Contrôle de disponibilité
   - Vérification des prix
   - Validation des conditions

3. Préparation
   - Traitement de la commande
   - Préparation des éléments
   - Contrôle qualité

4. Expédition
   - Emballage
   - Choix du mode de livraison
   - Envoi et suivi

5. Réception et Confirmation
   - Livraison au destinataire
   - Confirmation de réception
   - Feedback client`,

    generic: `Processus ${title}

1. Initialisation
   - Démarrage du processus
   - Collecte des informations initiales
   - Validation des prérequis

2. Analyse
   - Étude de la demande
   - Évaluation des options
   - Prise de décision

3. Exécution
   - Mise en œuvre des actions
   - Coordination des intervenants
   - Suivi de l'avancement

4. Contrôle
   - Vérification des résultats
   - Validation de conformité
   - Ajustements si nécessaire

5. Finalisation
   - Clôture du processus
   - Documentation
   - Archivage

6. Suivi
   - Analyse post-processus
   - Retour d'expérience
   - Amélioration continue`
  };

  return genericTemplates[type] || genericTemplates['generic'];
}

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
