import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

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
                        <i class="fas fa-code text-blue-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">Digitalisation Classique</h3>
                        <p class="text-sm text-gray-600">Automatisation des tâches répétitives et prévisibles</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <i class="fas fa-robot text-purple-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">IA Agentique</h3>
                        <p class="text-sm text-gray-600">Agents autonomes pour tâches complexes et décisionnelles</p>
                    </div>
                    <div class="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-500">
                        <i class="fas fa-chart-pie text-cyan-500 text-2xl mb-2"></i>
                        <h3 class="font-bold text-gray-800">Analyse ROI</h3>
                        <p class="text-sm text-gray-600">Évaluation du potentiel d'automatisation et gains</p>
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
                        <i class="fas fa-code-compare text-green-500 mr-2"></i>
                        Comparaison: Digitalisation vs IA Agentique
                    </h2>
                    <div id="comparisonView" class="grid md:grid-cols-2 gap-6"></div>
                </div>

                <!-- Recommendations -->
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Recommandations Stratégiques
                    </h2>
                    <div id="recommendations"></div>
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
      complexity: automationType.complexity,
      reason: automationType.reason,
      effort: automationType.effort,
      benefits: automationType.benefits
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
  const digitalKeywords = ['saisie', 'validation', 'enregistrement', 'notification', 'email', 'confirmation', 'calcul', 'assignation automatique']
  const agenticKeywords = ['décision', 'analyse', 'évaluation', 'jugement', 'négociation', 'créativité', 'adaptation', 'complexe', 'imprévu']
  const manualKeywords = ['préparation', 'cuisson', 'emballage', 'livraison', 'manipulation', 'assemblage']
  
  // Check for agentic (AI agents)
  if (agenticKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'agentic',
      complexity: 'Élevée',
      reason: 'Nécessite prise de décision, analyse contextuelle ou adaptation',
      effort: 'Élevé',
      benefits: 'Automatisation intelligente de tâches complexes'
    }
  }
  
  // Check for digital automation
  if (digitalKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'digital',
      complexity: 'Faible',
      reason: 'Tâche répétitive et prévisible, facile à automatiser',
      effort: 'Faible',
      benefits: 'Réduction des erreurs et gain de temps immédiat'
    }
  }
  
  // Check if partially automatable
  if (stepLower.includes('paiement') || stepLower.includes('commande') || stepLower.includes('suivi')) {
    return {
      type: 'hybrid',
      complexity: 'Moyenne',
      reason: 'Combine automatisation digitale et supervision IA',
      effort: 'Moyen',
      benefits: 'Optimisation avec surveillance intelligente'
    }
  }
  
  // Check for manual tasks
  if (manualKeywords.some(kw => stepLower.includes(kw))) {
    return {
      type: 'manual',
      complexity: 'Variable',
      reason: 'Nécessite intervention physique ou expertise humaine',
      effort: 'N/A',
      benefits: 'Support IA possible pour optimisation et guidage'
    }
  }
  
  // Default to hybrid
  return {
    type: 'hybrid',
    complexity: 'Moyenne',
    reason: 'Analyse contextuelle nécessaire',
    effort: 'Moyen',
    benefits: 'Combinaison digitalisation et IA recommandée'
  }
}

function calculateStats(steps: any[]) {
  const total = steps.length
  const digital = steps.filter(s => s.automationType === 'digital').length
  const agentic = steps.filter(s => s.automationType === 'agentic').length
  const hybrid = steps.filter(s => s.automationType === 'hybrid').length
  const manual = steps.filter(s => s.automationType === 'manual').length
  
  return {
    total,
    digital,
    agentic,
    hybrid,
    manual,
    automationPotential: Math.round(((digital + agentic + hybrid) / total) * 100),
    digitalPercentage: Math.round((digital / total) * 100),
    agenticPercentage: Math.round((agentic / total) * 100),
    hybridPercentage: Math.round((hybrid / total) * 100),
    manualPercentage: Math.round((manual / total) * 100)
  }
}

function generateRecommendations(steps: any[], stats: any) {
  const recommendations = []
  
  if (stats.digitalPercentage > 30) {
    recommendations.push({
      priority: 'Immédiat',
      type: 'Quick Win',
      title: 'Digitalisation Rapide',
      description: `${stats.digitalPercentage}% des étapes peuvent être automatisées rapidement avec des solutions digitales classiques. Commencez par ces gains rapides.`,
      icon: 'rocket'
    })
  }
  
  if (stats.agenticPercentage > 20) {
    recommendations.push({
      priority: 'Moyen Terme',
      type: 'Innovation',
      title: 'Déploiement d\'Agents IA',
      description: `${stats.agenticPercentage}% des étapes nécessitent des agents IA autonomes. Investissement stratégique pour gestion de la complexité.`,
      icon: 'brain'
    })
  }
  
  if (stats.manualPercentage > 40) {
    recommendations.push({
      priority: 'Long Terme',
      type: 'Transformation',
      title: 'Support IA pour Tâches Manuelles',
      description: `${stats.manualPercentage}% des étapes sont manuelles. Considérez des assistants IA pour optimiser ces opérations.`,
      icon: 'hands-helping'
    })
  }
  
  if (stats.automationPotential > 70) {
    recommendations.push({
      priority: 'Stratégique',
      type: 'ROI Élevé',
      title: 'Potentiel d\'Automatisation Excellent',
      description: `Avec ${stats.automationPotential}% d'automatisation possible, ce processus est un candidat idéal pour une transformation complète.`,
      icon: 'trophy'
    })
  }
  
  return recommendations
}

export default app
