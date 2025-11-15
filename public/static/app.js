let currentProcessType = 'text';
let currentDiagramType = 'flow';
let currentProcessData = null;

function setProcessType(type) {
    currentProcessType = type;
    
    // Update button styles
    const buttons = document.querySelectorAll('.process-type-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.getElementById(`btn-${type}`);
    activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    activeBtn.classList.add('bg-blue-500', 'text-white');
    
    // Update placeholder
    const input = document.getElementById('processInput');
    if (type === 'bpmn') {
        input.placeholder = 'Format BPMN XML ou description structurée:\n\n<process id="pizza-order">\n  <startEvent id="start"/>\n  <task id="order" name="Commande client"/>\n  <task id="payment" name="Paiement"/>\n  ...\n</process>\n\nOu simplement décrivez les étapes BPMN...';
    } else {
        input.placeholder = 'Exemple: Processus de commande de pizza jusqu\'à sa livraison\n\n1. Client passe commande (téléphone, site web, app)\n2. Validation de la commande et paiement\n3. Préparation de la pizza en cuisine\n4. Cuisson\n5. Emballage\n6. Assignation au livreur\n7. Livraison au client\n8. Confirmation de livraison';
    }
}

async function analyzeProcess() {
    const processInput = document.getElementById('processInput').value.trim();
    
    if (!processInput) {
        alert('Veuillez décrire votre processus avant l\'analyse.');
        return;
    }
    
    // Show loading
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    
    try {
        const response = await axios.post('/api/analyze', {
            processDescription: processInput,
            processType: currentProcessType
        });
        
        const data = response.data;
        displayResults(data);
        
        // Hide loading, show results
        document.getElementById('loadingSpinner').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        // Smooth scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de l\'analyse. Veuillez réessayer.');
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
}

function displayResults(data) {
    // Store data for diagram switching
    currentProcessData = data;
    
    // Process Overview
    displayProcessOverview(data);
    
    // Process Diagram
    displayProcessDiagram(data);
    
    // Automation Statistics
    displayAutomationStats(data.statistics);
    
    // Detailed Steps Analysis
    displayStepsAnalysis(data.steps);
    
    // Comparison View (3 levels)
    displayComparisonView(data.steps);
    
    // Recommendations
    displayRecommendations(data.recommendations);
}

function displayProcessOverview(data) {
    const container = document.getElementById('processOverview');
    container.innerHTML = `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
                ${data.processName}
            </h3>
            <p class="text-gray-600 mb-4">
                <i class="fas fa-list-check mr-2"></i>
                <strong>${data.totalSteps} étapes</strong> identifiées dans ce processus
            </p>
            <div class="flex items-center space-x-4 text-sm">
                <span class="flex items-center">
                    <i class="fas fa-chart-line text-green-500 mr-2"></i>
                    ${data.statistics.automationPotential}% automatisable
                </span>
                <span class="flex items-center">
                    <i class="fas fa-clock text-blue-500 mr-2"></i>
                    Analyse complétée
                </span>
            </div>
        </div>
    `;
}

function displayAutomationStats(stats) {
    const container = document.getElementById('automationStats');
    
    const statsCards = [
        {
            title: 'Automatisation par Règles',
            value: stats.ruleBased,
            percentage: stats.ruleBasedPercentage,
            icon: 'gears',
            color: 'blue',
            description: 'RPA, workflows, scripts'
        },
        {
            title: 'IA Déterministe',
            value: stats.deterministicAI,
            percentage: stats.deterministicAIPercentage,
            icon: 'network-wired',
            color: 'green',
            description: 'Classification, prédiction'
        },
        {
            title: 'IA Agentique (LLM)',
            value: stats.agenticAI,
            percentage: stats.agenticAIPercentage,
            icon: 'robot',
            color: 'purple',
            description: 'Agents autonomes, génération'
        }
    ];
    
    container.innerHTML = statsCards.map(stat => `
        <div class="bg-${stat.color}-50 p-6 rounded-lg border-l-4 border-${stat.color}-500 process-step">
            <div class="flex items-center justify-between mb-3">
                <i class="fas fa-${stat.icon} text-3xl text-${stat.color}-500"></i>
                <span class="text-3xl font-bold text-${stat.color}-600">${stat.percentage}%</span>
            </div>
            <h3 class="font-bold text-gray-800 mb-1">${stat.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${stat.description}</p>
            <p class="text-xs text-gray-500">${stat.value} étape(s)</p>
        </div>
    `).join('');
}

function displayStepsAnalysis(steps) {
    const container = document.getElementById('stepsAnalysis');
    
    const typeConfig = {
        'rule-based': {
            badge: 'bg-blue-100 text-blue-800',
            icon: 'gears',
            iconColor: 'text-blue-500',
            label: 'Automatisation par Règles'
        },
        'deterministic-ai': {
            badge: 'bg-green-100 text-green-800',
            icon: 'network-wired',
            iconColor: 'text-green-500',
            label: 'IA Déterministe'
        },
        'agentic-ai': {
            badge: 'bg-purple-100 text-purple-800',
            icon: 'robot',
            iconColor: 'text-purple-500',
            label: 'IA Agentique (LLM)'
        },
        'manual': {
            badge: 'bg-gray-100 text-gray-800',
            icon: 'hand',
            iconColor: 'text-gray-500',
            label: 'Manuel avec Support IA'
        }
    };
    
    container.innerHTML = steps.map(step => {
        const config = typeConfig[step.automationType] || typeConfig['rule-based'];
        return `
            <div class="mb-4 p-5 bg-gray-50 rounded-lg border border-gray-200 process-step">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start space-x-3 flex-1">
                        <div class="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-600 border-2 border-gray-300">
                            ${step.id}
                        </div>
                        <div class="flex-1">
                            <p class="text-gray-800 font-semibold mb-2">${step.description}</p>
                            <div class="space-y-1">
                                <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.badge}">
                                    <i class="fas fa-${config.icon} mr-1"></i>
                                    ${config.label}
                                </span>
                                ${step.subType ? `<span class="inline-block px-3 py-1 rounded-full text-xs bg-white border border-gray-300 text-gray-700 ml-2">
                                    ${step.subType}
                                </span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ml-13 mt-3 grid md:grid-cols-4 gap-3 text-sm">
                    <div class="bg-white p-3 rounded border border-gray-200">
                        <p class="text-gray-500 text-xs mb-1">Complexité</p>
                        <p class="font-semibold text-gray-800 text-xs">${step.complexity}</p>
                    </div>
                    <div class="bg-white p-3 rounded border border-gray-200">
                        <p class="text-gray-500 text-xs mb-1">Effort</p>
                        <p class="font-semibold text-gray-800 text-xs">${step.effort}</p>
                    </div>
                    <div class="bg-white p-3 rounded border border-gray-200 md:col-span-2">
                        <p class="text-gray-500 text-xs mb-1">Bénéfices</p>
                        <p class="font-semibold text-gray-800 text-xs">${step.benefits}</p>
                    </div>
                </div>
                <div class="ml-13 mt-3 text-sm">
                    <div class="bg-white p-3 rounded border border-gray-200">
                        <p class="text-gray-600 italic mb-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            ${step.reason}
                        </p>
                        ${step.examples ? `
                            <p class="text-xs text-gray-500 mb-1">
                                <strong>Exemples:</strong> ${step.examples}
                            </p>
                        ` : ''}
                        ${step.technology ? `
                            <p class="text-xs text-blue-600">
                                <i class="fas fa-tools mr-1"></i>
                                <strong>Technologies:</strong> ${step.technology}
                            </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function displayComparisonView(steps) {
    const container = document.getElementById('comparisonView');
    
    const ruleBasedSteps = steps.filter(s => s.automationType === 'rule-based');
    const deterministicAISteps = steps.filter(s => s.automationType === 'deterministic-ai');
    const agenticAISteps = steps.filter(s => s.automationType === 'agentic-ai');
    
    const cards = [
        {
            title: 'Niveau 1: Automatisation par Règles',
            icon: 'gears',
            color: 'blue',
            steps: ruleBasedSteps,
            description: 'RPA, workflows, scripts pour tâches répétitives',
            characteristics: [
                'Règles métier fixes et prévisibles',
                'Pas d\'apprentissage nécessaire',
                'Implémentation rapide (< 3 mois)',
                'ROI immédiat',
                'Maintenance simple'
            ],
            examples: 'UiPath, Power Automate, Zapier, Python scripts'
        },
        {
            title: 'Niveau 2: IA Déterministe',
            icon: 'network-wired',
            color: 'green',
            steps: deterministicAISteps,
            description: 'ML classique pour classification et prédiction',
            characteristics: [
                'Apprentissage supervisé sur données',
                'Modèles entraînés et déployés',
                'Prédictions déterministes',
                'Performance mesurable',
                'Nécessite données d\'entraînement'
            ],
            examples: 'Scikit-learn, TensorFlow, Random Forest, SVM'
        },
        {
            title: 'Niveau 3: IA Agentique (LLM)',
            icon: 'robot',
            color: 'purple',
            steps: agenticAISteps,
            description: 'Agents autonomes avec LLM et IA générative',
            characteristics: [
                'Raisonnement et compréhension',
                'Génération de contenu',
                'Adaptation contextuelle',
                'Autonomie et prise de décision',
                'Apprentissage continu'
            ],
            examples: 'GPT-4, Claude, LangChain, AutoGPT, CrewAI'
        }
    ];
    
    container.innerHTML = cards.map(card => `
        <div class="bg-${card.color}-50 p-6 rounded-lg border-2 border-${card.color}-300">
            <h3 class="text-lg font-bold text-${card.color}-800 mb-3 flex items-center">
                <i class="fas fa-${card.icon} text-2xl mr-3"></i>
                ${card.title}
            </h3>
            <p class="text-sm text-gray-600 mb-4 font-semibold">
                ${card.description}
            </p>
            
            ${card.steps.length > 0 ? `
                <div class="mb-4">
                    <p class="text-xs font-semibold text-${card.color}-800 mb-2">
                        Étapes concernées (${card.steps.length}):
                    </p>
                    <ul class="space-y-1">
                        ${card.steps.slice(0, 3).map(s => `
                            <li class="flex items-start text-xs">
                                <i class="fas fa-check-circle text-${card.color}-500 mr-2 mt-0.5"></i>
                                <span class="text-gray-700">${s.description}</span>
                            </li>
                        `).join('')}
                        ${card.steps.length > 3 ? `
                            <li class="text-xs text-gray-500 italic ml-5">
                                ... et ${card.steps.length - 3} autre(s)
                            </li>
                        ` : ''}
                    </ul>
                </div>
            ` : `
                <p class="text-sm text-gray-500 italic mb-4">
                    Aucune étape identifiée pour ce niveau
                </p>
            `}
            
            <div class="mt-4 pt-4 border-t border-${card.color}-200">
                <p class="text-xs font-semibold text-${card.color}-800 mb-2">Caractéristiques:</p>
                <ul class="text-xs text-gray-600 space-y-1">
                    ${card.characteristics.map(c => `
                        <li>✓ ${c}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="mt-3 pt-3 border-t border-${card.color}-200">
                <p class="text-xs text-gray-500">
                    <i class="fas fa-tools mr-1"></i>
                    <strong>Technologies:</strong> ${card.examples}
                </p>
            </div>
        </div>
    `).join('');
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    
    const priorityColors = {
        'Immédiat': 'red',
        'Court-Moyen Terme': 'orange',
        'Moyen-Long Terme': 'blue',
        'Long Terme': 'indigo',
        'Stratégique': 'green'
    };
    
    container.innerHTML = recommendations.map(rec => {
        const color = priorityColors[rec.priority] || 'gray';
        return `
            <div class="bg-white p-6 rounded-lg border-l-4 border-${color}-500 mb-4 process-step">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start space-x-3 flex-1">
                        <i class="fas fa-${rec.icon} text-3xl text-${color}-500"></i>
                        <div class="flex-1">
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                <span class="px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-xs font-bold">
                                    ${rec.priority}
                                </span>
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                    ${rec.type}
                                </span>
                                ${rec.effort ? `
                                    <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                        Effort: ${rec.effort}
                                    </span>
                                ` : ''}
                                ${rec.roi ? `
                                    <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                        ROI: ${rec.roi}
                                    </span>
                                ` : ''}
                            </div>
                            <h3 class="text-lg font-bold text-gray-800 mb-2">${rec.title}</h3>
                            <p class="text-gray-600">${rec.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function switchDiagram(type) {
    currentDiagramType = type;
    
    // Update button styles
    const buttons = document.querySelectorAll('.diagram-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.getElementById(`btn-${type}`);
    activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    activeBtn.classList.add('bg-indigo-500', 'text-white');
    
    // Redraw diagram
    if (currentProcessData) {
        displayProcessDiagram(currentProcessData);
    }
}

function displayProcessDiagram(data) {
    const container = document.getElementById('processDiagram');
    
    let mermaidCode = '';
    
    if (currentDiagramType === 'flow') {
        mermaidCode = generateFlowDiagram(data);
    } else {
        mermaidCode = generateSwimlanesDiagram(data);
    }
    
    // Create unique ID for mermaid diagram
    const diagramId = 'mermaid-' + Date.now();
    container.innerHTML = `<div class="mermaid" id="${diagramId}">${mermaidCode}</div>`;
    
    // Render mermaid diagram
    try {
        mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
        mermaid.run({
            querySelector: `#${diagramId}`
        });
    } catch (error) {
        console.error('Mermaid rendering error:', error);
        container.innerHTML = '<p class="text-red-500">Erreur lors du rendu du diagramme</p>';
    }
}

function generateFlowDiagram(data) {
    const steps = data.steps;
    
    // Color mapping for automation types
    const colorMap = {
        'rule-based': 'fill:#DBEAFE,stroke:#3B82F6,stroke-width:2px',
        'deterministic-ai': 'fill:#D1FAE5,stroke:#10B981,stroke-width:2px',
        'agentic-ai': 'fill:#E9D5FF,stroke:#A855F7,stroke-width:2px',
        'manual': 'fill:#F3F4F6,stroke:#6B7280,stroke-width:2px'
    };
    
    // Icon mapping
    const iconMap = {
        'rule-based': '⚙️',
        'deterministic-ai': '🧠',
        'agentic-ai': '🤖',
        'manual': '👤'
    };
    
    let diagram = 'graph TD\n';
    diagram += '    Start([Début du Processus])\n';
    
    // Add steps
    steps.forEach((step, index) => {
        const nodeId = `Step${step.id}`;
        const icon = iconMap[step.automationType] || '📋';
        const label = `${icon} ${step.description}`;
        const escapedLabel = label.replace(/"/g, '#quot;').substring(0, 60);
        
        diagram += `    ${nodeId}["${escapedLabel}"]\n`;
    });
    
    diagram += '    End([Fin du Processus])\n\n';
    
    // Add connections
    diagram += '    Start --> Step1\n';
    for (let i = 1; i < steps.length; i++) {
        diagram += `    Step${i} --> Step${i + 1}\n`;
    }
    diagram += `    Step${steps.length} --> End\n\n`;
    
    // Add styling
    steps.forEach((step) => {
        const style = colorMap[step.automationType] || colorMap['manual'];
        diagram += `    style Step${step.id} ${style}\n`;
    });
    
    diagram += '    style Start fill:#FEF3C7,stroke:#F59E0B,stroke-width:3px\n';
    diagram += '    style End fill:#D1FAE5,stroke:#10B981,stroke-width:3px\n';
    
    return diagram;
}

function generateSwimlanesDiagram(data) {
    const steps = data.steps;
    
    // Group steps by automation type
    const grouped = {
        'rule-based': steps.filter(s => s.automationType === 'rule-based'),
        'deterministic-ai': steps.filter(s => s.automationType === 'deterministic-ai'),
        'agentic-ai': steps.filter(s => s.automationType === 'agentic-ai'),
        'manual': steps.filter(s => s.automationType === 'manual')
    };
    
    const lanes = [
        { type: 'rule-based', label: '⚙️ Automatisation par Règles', color: '#3B82F6' },
        { type: 'deterministic-ai', label: '🧠 IA Déterministe', color: '#10B981' },
        { type: 'agentic-ai', label: '🤖 IA Agentique (LLM)', color: '#A855F7' },
        { type: 'manual', label: '👤 Manuel avec Support IA', color: '#6B7280' }
    ];
    
    let diagram = 'graph TD\n';
    diagram += '    Start([Début])\n';
    
    let previousNodes = ['Start'];
    let currentStepIndex = 0;
    
    steps.forEach((step) => {
        const nodeId = `S${step.id}`;
        const label = step.description.substring(0, 50);
        const escapedLabel = label.replace(/"/g, '#quot;');
        
        diagram += `    ${nodeId}["${escapedLabel}"]\n`;
        
        // Connect from previous nodes
        previousNodes.forEach(prev => {
            diagram += `    ${prev} --> ${nodeId}\n`;
        });
        
        previousNodes = [nodeId];
    });
    
    diagram += '    End([Fin])\n';
    previousNodes.forEach(prev => {
        diagram += `    ${prev} --> End\n`;
    });
    
    diagram += '\n';
    
    // Styling by type
    steps.forEach((step) => {
        const nodeId = `S${step.id}`;
        let style = '';
        switch(step.automationType) {
            case 'rule-based':
                style = 'fill:#DBEAFE,stroke:#3B82F6,stroke-width:3px';
                break;
            case 'deterministic-ai':
                style = 'fill:#D1FAE5,stroke:#10B981,stroke-width:3px';
                break;
            case 'agentic-ai':
                style = 'fill:#E9D5FF,stroke:#A855F7,stroke-width:3px';
                break;
            case 'manual':
                style = 'fill:#F3F4F6,stroke:#6B7280,stroke-width:3px';
                break;
        }
        diagram += `    style ${nodeId} ${style}\n`;
    });
    
    diagram += '    style Start fill:#FEF3C7,stroke:#F59E0B,stroke-width:3px\n';
    diagram += '    style End fill:#D1FAE5,stroke:#10B981,stroke-width:3px\n';
    
    return diagram;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid
    mermaid.initialize({ 
        startOnLoad: false,
        theme: 'default',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        }
    });
    
    // Add enter key support for textarea
    document.getElementById('processInput').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            analyzeProcess();
        }
    });
});
