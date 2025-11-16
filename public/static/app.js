let currentProcessType = 'title';
let currentDiagramType = 'flow';
let currentProcessData = null;

function setProcessType(type) {
    currentProcessType = type;
    
    // Update button styles
    const buttons = document.querySelectorAll('.process-type-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-blue-500', 'bg-orange-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.getElementById(`btn-${type}`);
    activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    
    // Different color for title mode
    if (type === 'title') {
        activeBtn.classList.add('bg-orange-500', 'text-white');
    } else {
        activeBtn.classList.add('bg-blue-500', 'text-white');
    }
    
    // Update placeholder based on mode
    const input = document.getElementById('processInput');
    
    if (type === 'title') {
        input.placeholder = 'Entrez le titre du processus (exemples valides):\n\n• KYC\n• Recrutement\n• Gestion des Commandes\n• Onboarding Client\n• Support Client\n• Purchase-to-Pay\n• Gestion des Sinistres\n\nL\'IA recherchera automatiquement les étapes les plus pertinentes selon les meilleures pratiques internationales.';
    } else if (type === 'bpmn') {
        input.placeholder = 'Format BPMN XML standard:\n\n<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">\n  <process id="process_1">\n    <startEvent id="start" name="Début"/>\n    <task id="task1" name="Validation commande"/>\n    <task id="task2" name="Traitement paiement"/>\n    <task id="task3" name="Préparation commande"/>\n    <endEvent id="end" name="Fin"/>\n  </process>\n</definitions>\n\nOu simplement décrivez les étapes du processus BPMN...';
    } else {
        input.placeholder = 'Exemple: Processus de commande de pizza jusqu\'à sa livraison\n\n1. Client passe commande (téléphone, site web, app)\n2. Validation de la commande et paiement\n3. Préparation de la pizza en cuisine\n4. Cuisson\n5. Emballage\n6. Assignation au livreur\n7. Livraison au client\n8. Confirmation de livraison';
    }
}

async function loadPredefinedProcess(processId) {
    try {
        // Show loading
        const input = document.getElementById('processInput');
        input.value = 'Chargement du processus...';
        input.disabled = true;
        
        // Fetch predefined process
        const response = await axios.get(`/api/process/${processId}`);
        const template = response.data;
        
        // Load into textarea
        input.value = template.description;
        input.disabled = false;
        
        // Scroll to textarea
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show success message
        showNotification('success', `Processus "${template.name}" chargé avec succès !`);
        
    } catch (error) {
        console.error('Error loading predefined process:', error);
        document.getElementById('processInput').value = '';
        document.getElementById('processInput').disabled = false;
        showNotification('error', 'Erreur lors du chargement du processus pré-défini.');
    }
}

function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    
    // Color mapping for different notification types
    let bgColor, icon;
    if (type === 'success') {
        bgColor = 'bg-green-500';
        icon = 'check-circle';
    } else if (type === 'info') {
        bgColor = 'bg-blue-500';
        icon = 'info-circle';
    } else {
        bgColor = 'bg-red-500';
        icon = 'exclamation-circle';
    }
    
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${bgColor} text-white font-semibold`;
    notification.innerHTML = `
        <i class="fas fa-${icon} mr-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
        let processDescription = processInput;
        
        // Handle title search mode
        if (currentProcessType === 'title') {
            showNotification('info', `Recherche des étapes pour "${processInput}"...`);
            
            const searchResponse = await axios.post('/api/search-process', {
                processTitle: processInput
            });
            
            processDescription = searchResponse.data.description;
            
            // Update textarea with found process
            document.getElementById('processInput').value = processDescription;
            
            showNotification('success', `Processus trouvé ! Analyse en cours...`);
        }
        
        // Analyze the process
        const response = await axios.post('/api/analyze', {
            processDescription: processDescription,
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
        const errorMessage = error.response?.data?.error || 'Erreur lors de l\'analyse. Veuillez réessayer.';
        alert(errorMessage);
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
    
    // Automation Scenarios
    displayAutomationScenarios(data);
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

function displayAutomationScenarios(data) {
    const container = document.getElementById('automationScenarios');
    const steps = data.steps;
    const stats = data.statistics;
    
    // Calculate automation metrics
    const totalSteps = stats.total;
    const ruleBasedSteps = steps.filter(s => s.automationType === 'rule-based');
    const deterministicSteps = steps.filter(s => s.automationType === 'deterministic-ai');
    const agenticSteps = steps.filter(s => s.automationType === 'agentic-ai');
    const manualSteps = steps.filter(s => s.automationType === 'manual');
    
    // Scenario 1: Baseline (Manual)
    const scenario1Coverage = 0;
    const scenario1Cost = 100; // Base cost reference
    const scenario1Time = 100; // Base time reference
    
    // Scenario 2: Rule-based + Deterministic AI
    const scenario2Steps = ruleBasedSteps.length + deterministicSteps.length;
    const scenario2Coverage = Math.round((scenario2Steps / totalSteps) * 100);
    const scenario2Cost = 40; // Estimated cost reduction
    const scenario2Time = 50; // Estimated time reduction
    const scenario2Savings = 100 - scenario2Cost;
    
    // Scenario 3: Full Automation (All levels)
    const scenario3Steps = ruleBasedSteps.length + deterministicSteps.length + agenticSteps.length;
    const scenario3Coverage = Math.round((scenario3Steps / totalSteps) * 100);
    const scenario3Cost = 20; // Maximum cost reduction
    const scenario3Time = 25; // Maximum time reduction
    const scenario3Savings = 100 - scenario3Cost;
    
    const scenarios = [
        {
            id: 1,
            title: 'Scénario 1 : Processus Manuel (Baseline)',
            subtitle: 'État actuel sans automatisation',
            icon: '👤',
            color: 'gray',
            coverage: scenario1Coverage,
            automated: 0,
            manual: totalSteps,
            timeReduction: scenario1Time,
            costReduction: scenario1Cost,
            savings: 0,
            complexity: 'Faible',
            timeline: 'N/A',
            investment: 'Aucun',
            technologies: [],
            benefits: [
                'Pas d\'investissement initial',
                'Flexibilité maximale',
                'Contrôle humain total'
            ],
            risks: [
                'Coûts opérationnels élevés',
                'Erreurs humaines possibles',
                'Scalabilité limitée',
                'Lenteur d\'exécution'
            ],
            steps: manualSteps.concat(ruleBasedSteps, deterministicSteps, agenticSteps)
        },
        {
            id: 2,
            title: 'Scénario 2 : Automatisation Classique',
            subtitle: 'RPA + IA Déterministe (Quick Wins)',
            icon: '⚙️🧠',
            color: 'blue',
            coverage: scenario2Coverage,
            automated: scenario2Steps,
            manual: totalSteps - scenario2Steps,
            timeReduction: scenario2Time,
            costReduction: scenario2Cost,
            savings: scenario2Savings,
            complexity: 'Moyenne',
            timeline: '3-6 mois',
            investment: '€€',
            technologies: [
                'RPA : UiPath, Power Automate',
                'ML : Scikit-learn, TensorFlow',
                'Orchestration : Apache Airflow',
                'Monitoring : Datadog, Prometheus'
            ],
            benefits: [
                `${scenario2Savings}% de réduction des coûts opérationnels`,
                `${scenario2Steps} étapes automatisées (${scenario2Coverage}%)`,
                'ROI rapide (< 12 mois)',
                'Réduction des erreurs',
                'Technologies matures et éprouvées'
            ],
            risks: [
                'Maintenance des règles nécessaire',
                'Rigidité face aux changements',
                'Nécessite données d\'entraînement (ML)',
                `${totalSteps - scenario2Steps} étapes restent manuelles`
            ],
            steps: ruleBasedSteps.concat(deterministicSteps)
        },
        {
            id: 3,
            title: 'Scénario 3 : Automatisation Complète avec IA Agentique',
            subtitle: 'RPA + IA Déterministe + Agents LLM',
            icon: '⚙️🧠🤖',
            color: 'purple',
            coverage: scenario3Coverage,
            automated: scenario3Steps,
            manual: totalSteps - scenario3Steps,
            timeReduction: scenario3Time,
            costReduction: scenario3Cost,
            savings: scenario3Savings,
            complexity: 'Élevée',
            timeline: '6-18 mois',
            investment: '€€€',
            technologies: [
                'Scénario 2 +',
                'LLM : GPT-4, Claude, Gemini',
                'Agents IA : LangChain, AutoGPT, CrewAI',
                'Vector DB : Pinecone, Weaviate',
                'Orchestration : LangGraph, Semantic Kernel'
            ],
            benefits: [
                `${scenario3Savings}% de réduction des coûts opérationnels`,
                `${scenario3Steps} étapes automatisées (${scenario3Coverage}%)`,
                'Gestion de la complexité et l\'imprévu',
                'Adaptation contextuelle intelligente',
                'Scalabilité quasi-illimitée',
                'Expérience utilisateur personnalisée'
            ],
            risks: [
                'Investissement initial élevé',
                'Expertise IA nécessaire',
                'Coûts API LLM récurrents',
                'Temps d\'implémentation plus long',
                'Monitoring et governance critiques',
                manualSteps.length > 0 ? `${manualSteps.length} étapes restent manuelles` : 'Automatisation quasi-complète'
            ],
            steps: ruleBasedSteps.concat(deterministicSteps, agenticSteps)
        }
    ];
    
    container.innerHTML = `
        <div class="space-y-6">
            ${scenarios.map((scenario, index) => `
                <div class="bg-gradient-to-br from-${scenario.color}-50 to-white border-2 border-${scenario.color}-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                    <!-- Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-4xl">${scenario.icon}</span>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">${scenario.title}</h3>
                                    <p class="text-sm text-gray-600">${scenario.subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="bg-white rounded-lg px-4 py-2 border-2 border-${scenario.color}-300">
                                <div class="text-3xl font-bold text-${scenario.color}-600">${scenario.coverage}%</div>
                                <div class="text-xs text-gray-600">Couverture</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Metrics -->
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                            <div class="text-xs text-gray-600 mb-1">Étapes automatisées</div>
                            <div class="text-lg font-bold text-${scenario.color}-600">${scenario.automated}/${totalSteps}</div>
                        </div>
                        <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                            <div class="text-xs text-gray-600 mb-1">Économies</div>
                            <div class="text-lg font-bold text-green-600">${scenario.savings}%</div>
                        </div>
                        <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                            <div class="text-xs text-gray-600 mb-1">Complexité</div>
                            <div class="text-lg font-bold text-gray-700">${scenario.complexity}</div>
                        </div>
                        <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                            <div class="text-xs text-gray-600 mb-1">Timeline</div>
                            <div class="text-lg font-bold text-gray-700">${scenario.timeline}</div>
                        </div>
                        <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                            <div class="text-xs text-gray-600 mb-1">Investissement</div>
                            <div class="text-lg font-bold text-gray-700">${scenario.investment}</div>
                        </div>
                    </div>
                    
                    <!-- Technologies -->
                    ${scenario.technologies.length > 0 ? `
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-tools mr-2"></i>Stack Technologique
                            </h4>
                            <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200">
                                <ul class="text-sm text-gray-700 space-y-1">
                                    ${scenario.technologies.map(tech => `
                                        <li class="flex items-start">
                                            <i class="fas fa-chevron-right text-${scenario.color}-500 mr-2 mt-1 text-xs"></i>
                                            <span>${tech}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Steps Covered -->
                    ${scenario.steps.length > 0 ? `
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-tasks mr-2"></i>Étapes Concernées (${scenario.steps.length})
                            </h4>
                            <div class="bg-white rounded-lg p-3 border border-${scenario.color}-200 max-h-40 overflow-y-auto">
                                <ul class="text-sm space-y-1">
                                    ${scenario.steps.slice(0, 5).map(step => {
                                        const typeIcons = {
                                            'rule-based': '⚙️',
                                            'deterministic-ai': '🧠',
                                            'agentic-ai': '🤖',
                                            'manual': '👤'
                                        };
                                        return `
                                            <li class="flex items-start text-gray-700">
                                                <span class="mr-2">${typeIcons[step.automationType]}</span>
                                                <span>${step.description}</span>
                                            </li>
                                        `;
                                    }).join('')}
                                    ${scenario.steps.length > 5 ? `
                                        <li class="text-gray-500 italic ml-6">... et ${scenario.steps.length - 5} autre(s)</li>
                                    ` : ''}
                                </ul>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Benefits & Risks -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-semibold text-green-700 mb-2">
                                <i class="fas fa-check-circle mr-2"></i>Bénéfices
                            </h4>
                            <ul class="text-sm space-y-1">
                                ${scenario.benefits.map(benefit => `
                                    <li class="flex items-start text-gray-700">
                                        <i class="fas fa-plus text-green-500 mr-2 mt-1 text-xs"></i>
                                        <span>${benefit}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-red-700 mb-2">
                                <i class="fas fa-exclamation-triangle mr-2"></i>Risques & Contraintes
                            </h4>
                            <ul class="text-sm space-y-1">
                                ${scenario.risks.map(risk => `
                                    <li class="flex items-start text-gray-700">
                                        <i class="fas fa-minus text-red-500 mr-2 mt-1 text-xs"></i>
                                        <span>${risk}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    ${index < scenarios.length - 1 ? `
                        <div class="mt-4 pt-4 border-t border-${scenario.color}-200">
                            <div class="flex items-center text-sm text-gray-600">
                                <i class="fas fa-arrow-down mr-2"></i>
                                <span>Pour passer au scénario suivant, ajoutez : <strong>${scenarios[index + 1].title.split(':')[1]}</strong></span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        
        <!-- Comparison Summary -->
        <div class="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <h3 class="text-xl font-bold text-gray-800 mb-4">
                <i class="fas fa-balance-scale mr-2"></i>
                Tableau Comparatif
            </h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b-2 border-indigo-300">
                            <th class="text-left py-2 px-3 font-semibold">Critère</th>
                            <th class="text-center py-2 px-3 font-semibold">Scénario 1<br/>(Manuel)</th>
                            <th class="text-center py-2 px-3 font-semibold">Scénario 2<br/>(Classique)</th>
                            <th class="text-center py-2 px-3 font-semibold">Scénario 3<br/>(IA Agentique)</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700">
                        <tr class="border-b border-indigo-100">
                            <td class="py-2 px-3 font-medium">Couverture</td>
                            <td class="text-center py-2 px-3">${scenarios[0].coverage}%</td>
                            <td class="text-center py-2 px-3 bg-blue-50">${scenarios[1].coverage}%</td>
                            <td class="text-center py-2 px-3 bg-purple-50">${scenarios[2].coverage}%</td>
                        </tr>
                        <tr class="border-b border-indigo-100">
                            <td class="py-2 px-3 font-medium">Économies</td>
                            <td class="text-center py-2 px-3">${scenarios[0].savings}%</td>
                            <td class="text-center py-2 px-3 bg-blue-50 text-green-600 font-bold">${scenarios[1].savings}%</td>
                            <td class="text-center py-2 px-3 bg-purple-50 text-green-600 font-bold">${scenarios[2].savings}%</td>
                        </tr>
                        <tr class="border-b border-indigo-100">
                            <td class="py-2 px-3 font-medium">Investissement</td>
                            <td class="text-center py-2 px-3">${scenarios[0].investment}</td>
                            <td class="text-center py-2 px-3 bg-blue-50">${scenarios[1].investment}</td>
                            <td class="text-center py-2 px-3 bg-purple-50">${scenarios[2].investment}</td>
                        </tr>
                        <tr class="border-b border-indigo-100">
                            <td class="py-2 px-3 font-medium">Timeline</td>
                            <td class="text-center py-2 px-3">${scenarios[0].timeline}</td>
                            <td class="text-center py-2 px-3 bg-blue-50">${scenarios[1].timeline}</td>
                            <td class="text-center py-2 px-3 bg-purple-50">${scenarios[2].timeline}</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-3 font-medium">Complexité</td>
                            <td class="text-center py-2 px-3">${scenarios[0].complexity}</td>
                            <td class="text-center py-2 px-3 bg-blue-50">${scenarios[1].complexity}</td>
                            <td class="text-center py-2 px-3 bg-purple-50">${scenarios[2].complexity}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    <strong>Recommandation :</strong> 
                    ${scenario2Coverage >= 70 ? 
                        'Commencez par le Scénario 2 pour des gains rapides, puis évaluez le Scénario 3 selon vos besoins de complexité.' :
                        scenario3Coverage >= 80 ?
                        'Le Scénario 3 est recommandé pour maximiser l\'automatisation de ce processus complexe.' :
                        'Approche progressive recommandée : démarrez avec le Scénario 2, puis passez au Scénario 3 selon le ROI observé.'
                    }
                </p>
            </div>
        </div>
    `;
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
