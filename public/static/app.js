let currentProcessType = 'text';

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
    // Process Overview
    displayProcessOverview(data);
    
    // Automation Statistics
    displayAutomationStats(data.statistics);
    
    // Detailed Steps Analysis
    displayStepsAnalysis(data.steps);
    
    // Comparison View
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
            title: 'Digitalisation Classique',
            value: stats.digital,
            percentage: stats.digitalPercentage,
            icon: 'code',
            color: 'blue',
            description: 'Étapes automatisables rapidement'
        },
        {
            title: 'IA Agentique',
            value: stats.agentic,
            percentage: stats.agenticPercentage,
            icon: 'robot',
            color: 'purple',
            description: 'Nécessite agents IA autonomes'
        },
        {
            title: 'Hybride / Manuel',
            value: stats.hybrid + stats.manual,
            percentage: stats.hybridPercentage + stats.manualPercentage,
            icon: 'hands',
            color: 'cyan',
            description: 'Support IA possible'
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
        digital: {
            badge: 'bg-blue-100 text-blue-800',
            icon: 'code',
            iconColor: 'text-blue-500',
            label: 'Digitalisation'
        },
        agentic: {
            badge: 'bg-purple-100 text-purple-800',
            icon: 'robot',
            iconColor: 'text-purple-500',
            label: 'IA Agentique'
        },
        hybrid: {
            badge: 'bg-cyan-100 text-cyan-800',
            icon: 'layer-group',
            iconColor: 'text-cyan-500',
            label: 'Hybride'
        },
        manual: {
            badge: 'bg-gray-100 text-gray-800',
            icon: 'hand',
            iconColor: 'text-gray-500',
            label: 'Manuel'
        }
    };
    
    container.innerHTML = steps.map(step => {
        const config = typeConfig[step.automationType] || typeConfig.hybrid;
        return `
            <div class="mb-4 p-5 bg-gray-50 rounded-lg border border-gray-200 process-step">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start space-x-3 flex-1">
                        <div class="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-600 border-2 border-gray-300">
                            ${step.id}
                        </div>
                        <div class="flex-1">
                            <p class="text-gray-800 font-semibold mb-2">${step.description}</p>
                            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.badge}">
                                <i class="fas fa-${config.icon} mr-1"></i>
                                ${config.label}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="ml-13 mt-3 grid md:grid-cols-3 gap-3 text-sm">
                    <div class="bg-white p-3 rounded border border-gray-200">
                        <p class="text-gray-500 text-xs mb-1">Complexité</p>
                        <p class="font-semibold text-gray-800">${step.complexity}</p>
                    </div>
                    <div class="bg-white p-3 rounded border border-gray-200">
                        <p class="text-gray-500 text-xs mb-1">Effort</p>
                        <p class="font-semibold text-gray-800">${step.effort}</p>
                    </div>
                    <div class="bg-white p-3 rounded border border-gray-200 md:col-span-1">
                        <p class="text-gray-500 text-xs mb-1">Bénéfices</p>
                        <p class="font-semibold text-gray-800 text-xs">${step.benefits}</p>
                    </div>
                </div>
                <div class="ml-13 mt-2 text-sm text-gray-600 italic">
                    <i class="fas fa-info-circle mr-1"></i>
                    ${step.reason}
                </div>
            </div>
        `;
    }).join('');
}

function displayComparisonView(steps) {
    const container = document.getElementById('comparisonView');
    
    const digitalSteps = steps.filter(s => s.automationType === 'digital');
    const agenticSteps = steps.filter(s => s.automationType === 'agentic');
    const hybridSteps = steps.filter(s => s.automationType === 'hybrid');
    const manualSteps = steps.filter(s => s.automationType === 'manual');
    
    const digitalHTML = `
        <div class="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
            <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <i class="fas fa-code text-2xl mr-3"></i>
                Digitalisation Classique
            </h3>
            <p class="text-sm text-gray-600 mb-4">
                Automatisation par scripts, workflows, RPA pour tâches répétitives
            </p>
            ${digitalSteps.length > 0 ? `
                <ul class="space-y-2">
                    ${digitalSteps.map(s => `
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-blue-500 mr-2 mt-1"></i>
                            <span class="text-sm text-gray-700">${s.description}</span>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p class="text-sm text-gray-500 italic">Aucune étape identifiée</p>'}
            
            <div class="mt-4 pt-4 border-t border-blue-200">
                <p class="text-xs font-semibold text-blue-800 mb-2">Caractéristiques:</p>
                <ul class="text-xs text-gray-600 space-y-1">
                    <li>✓ Tâches répétitives et prévisibles</li>
                    <li>✓ Règles métier fixes</li>
                    <li>✓ Faible effort d'implémentation</li>
                    <li>✓ ROI rapide (< 6 mois)</li>
                </ul>
            </div>
        </div>
    `;
    
    const agenticHTML = `
        <div class="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
            <h3 class="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <i class="fas fa-robot text-2xl mr-3"></i>
                IA Agentique
            </h3>
            <p class="text-sm text-gray-600 mb-4">
                Agents autonomes pour décisions complexes et adaptation contextuelle
            </p>
            ${agenticSteps.length > 0 ? `
                <ul class="space-y-2">
                    ${agenticSteps.map(s => `
                        <li class="flex items-start">
                            <i class="fas fa-brain text-purple-500 mr-2 mt-1"></i>
                            <span class="text-sm text-gray-700">${s.description}</span>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p class="text-sm text-gray-500 italic">Aucune étape identifiée</p>'}
            
            ${hybridSteps.length > 0 ? `
                <div class="mt-3">
                    <p class="text-xs font-semibold text-purple-700 mb-2">Étapes Hybrides:</p>
                    <ul class="space-y-1">
                        ${hybridSteps.map(s => `
                            <li class="flex items-start">
                                <i class="fas fa-layer-group text-cyan-500 mr-2 mt-1 text-xs"></i>
                                <span class="text-xs text-gray-600">${s.description}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="mt-4 pt-4 border-t border-purple-200">
                <p class="text-xs font-semibold text-purple-800 mb-2">Caractéristiques:</p>
                <ul class="text-xs text-gray-600 space-y-1">
                    <li>✓ Décisions complexes et contextuelles</li>
                    <li>✓ Apprentissage et adaptation</li>
                    <li>✓ Gestion de l'imprévu</li>
                    <li>✓ Investissement stratégique</li>
                </ul>
            </div>
        </div>
    `;
    
    container.innerHTML = digitalHTML + agenticHTML;
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    
    const priorityColors = {
        'Immédiat': 'red',
        'Moyen Terme': 'yellow',
        'Long Terme': 'blue',
        'Stratégique': 'green'
    };
    
    container.innerHTML = recommendations.map(rec => {
        const color = priorityColors[rec.priority] || 'gray';
        return `
            <div class="bg-white p-6 rounded-lg border-l-4 border-${color}-500 mb-4 process-step">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-${rec.icon} text-3xl text-${color}-500"></i>
                        <div>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-xs font-bold">
                                    ${rec.priority}
                                </span>
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                    ${rec.type}
                                </span>
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for textarea
    document.getElementById('processInput').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            analyzeProcess();
        }
    });
});
