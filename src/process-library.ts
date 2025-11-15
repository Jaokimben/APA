// Process Library - Detailed Process Decompositions
// Based on industry best practices and compliance standards

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  subSteps?: string[];
  estimatedTime?: string;
  responsible?: string;
  tools?: string[];
  compliance?: string[];
}

export interface ProcessTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  industry: string[];
  sources: string[];
  steps: ProcessStep[];
}

export const processLibrary: ProcessTemplate[] = [
  {
    id: 'kyc-aml-process',
    name: 'Processus KYC/AML (Know Your Customer)',
    category: 'Compliance & Réglementation',
    description: 'Processus complet de vérification d\'identité client et conformité anti-blanchiment selon les standards internationaux 2024',
    industry: ['Finance', 'Banque', 'Fintech', 'Assurance', 'Crypto'],
    sources: [
      'Thomson Reuters Legal - KYC/AML Best Practices 2024',
      'Fenergo - KYC & AML Compliance Guide',
      'ComplyCube - Know Your Customer Process',
      'FATF Guidelines (Financial Action Task Force)'
    ],
    steps: [
      {
        id: 'kyc-1',
        name: 'Initial Documentation (Programme d\'Identification Client - CIP)',
        description: 'Collecte des informations et documents d\'identité de base du client',
        subSteps: [
          'Collecte des informations personnelles (nom, prénom, date de naissance, adresse)',
          'Vérification de l\'identité via documents officiels (passeport, carte d\'identité, permis de conduire)',
          'Capture de photo/selfie pour comparaison biométrique',
          'Vérification de l\'adresse (justificatif de domicile < 3 mois)',
          'Collecte des informations professionnelles (employeur, source de revenus)',
          'Signature numérique et consentement RGPD'
        ],
        estimatedTime: '5-15 minutes (digital) / 1-3 jours (physique)',
        responsible: 'Service Onboarding / KYC Analyst',
        tools: ['Jumio', 'Onfido', 'Veriff', 'Sumsub', 'Trulioo'],
        compliance: ['FATF Recommendations', 'RGPD', 'AML Directives 5 & 6']
      },
      {
        id: 'kyc-2',
        name: 'Third-Party Verification (Vérification Tierce)',
        description: 'Vérification de l\'authenticité des documents et des informations via bases de données externes',
        subSteps: [
          'Vérification des documents d\'identité auprès des autorités émettrice',
          'Validation biométrique (reconnaissance faciale, liveness detection)',
          'Vérification contre les listes de sanctions (OFAC, UN, EU)',
          'Screening PEP (Politically Exposed Persons)',
          'Contrôle des médias négatifs (adverse media screening)',
          'Vérification de l\'adresse via bases de données publiques',
          'Validation du numéro de téléphone et email',
          'Vérification de solvabilité (si applicable)'
        ],
        estimatedTime: '2-5 minutes (automatisé) / 1-2 jours (manuel)',
        responsible: 'Système KYC automatisé / Compliance Officer',
        tools: ['Refinitiv World-Check', 'Dow Jones Risk & Compliance', 'LexisNexis', 'ComplyAdvantage'],
        compliance: ['AML/CFT Standards', 'Sanctions Compliance', 'PEP Screening Requirements']
      },
      {
        id: 'kyc-3',
        name: 'Secure Data Storage (Stockage Sécurisé des Données)',
        description: 'Stockage conforme et sécurisé des données client avec chiffrement et contrôle d\'accès',
        subSteps: [
          'Chiffrement des données sensibles (AES-256)',
          'Stockage dans des bases de données sécurisées (ISO 27001)',
          'Mise en place des contrôles d\'accès basés sur les rôles (RBAC)',
          'Journalisation de tous les accès (audit trail)',
          'Backup automatique et redondance géographique',
          'Respect des obligations de conservation (5-10 ans selon juridiction)',
          'Anonymisation des données après expiration',
          'Conformité RGPD : droit à l\'oubli, portabilité'
        ],
        estimatedTime: 'Instantané (automatisé)',
        responsible: 'Data Security Team / DPO',
        tools: ['AWS KMS', 'Azure Key Vault', 'HashiCorp Vault', 'Encrypted databases'],
        compliance: ['RGPD', 'ISO 27001', 'SOC 2', 'PCI-DSS', 'Data Retention Laws']
      },
      {
        id: 'kyc-4',
        name: 'Ongoing Monitoring (Surveillance Continue)',
        description: 'Surveillance continue des transactions et du comportement client pour détecter les activités suspectes',
        subSteps: [
          'Monitoring en temps réel des transactions',
          'Détection d\'anomalies via machine learning',
          'Alertes automatiques sur transactions inhabituelles',
          'Vérification périodique des changements de statut PEP',
          'Re-screening régulier contre les listes de sanctions (quotidien/hebdomadaire)',
          'Analyse des patterns de transactions (velocity checks)',
          'Surveillance des changements d\'adresse ou coordonnées',
          'Suivi des interactions multi-canaux'
        ],
        estimatedTime: 'Continu 24/7',
        responsible: 'Transaction Monitoring Team / AML Compliance',
        tools: ['NICE Actimize', 'SAS AML', 'Feedzai', 'FIS AML', 'Oracle FCCM'],
        compliance: ['AML Transaction Monitoring Requirements', 'Suspicious Activity Reporting']
      },
      {
        id: 'kyc-5',
        name: 'Risk Assessment and Profiling (Évaluation et Profilage des Risques)',
        description: 'Classification du niveau de risque client et ajustement des mesures de vigilance',
        subSteps: [
          'Calcul du score de risque client (risk scoring)',
          'Classification : Low Risk / Medium Risk / High Risk',
          'Évaluation des facteurs de risque géographique',
          'Analyse du type de produits/services utilisés',
          'Évaluation du volume et fréquence des transactions',
          'Due Diligence Simplifiée (SDD) pour clients low-risk',
          'Due Diligence Renforcée (EDD) pour clients high-risk',
          'Révision périodique du profil de risque (annuel/trimestriel)'
        ],
        estimatedTime: '10-30 minutes (initial) / Révision périodique',
        responsible: 'Risk Assessment Team / Compliance Analyst',
        tools: ['Risk scoring engines', 'ML-based risk models', 'Compliance software'],
        compliance: ['Risk-Based Approach (RBA)', 'CDD/EDD Requirements', 'FATF Guidelines']
      },
      {
        id: 'kyc-6',
        name: 'Compliance with AML Regulations (Conformité Réglementaire AML)',
        description: 'Garantir la conformité continue avec les réglementations anti-blanchiment et reporting aux autorités',
        subSteps: [
          'Génération de rapports de transactions suspectes (STR/SAR)',
          'Déclaration TRACFIN (France) ou FinCEN (USA)',
          'Reporting régulier aux autorités de régulation',
          'Audit interne des procédures KYC/AML',
          'Formation continue des équipes sur les nouvelles réglementations',
          'Mise à jour des politiques et procédures',
          'Tests de conformité et simulation de scénarios',
          'Documentation complète pour audits externes'
        ],
        estimatedTime: 'Variable selon activité / Reporting mensuel/trimestriel',
        responsible: 'Compliance Officer / MLRO (Money Laundering Reporting Officer)',
        tools: ['Regulatory reporting systems', 'Case management software', 'Audit tools'],
        compliance: [
          'AML Directives (EU: 5AMLD, 6AMLD)',
          'Bank Secrecy Act (USA)',
          'FATF 40 Recommendations',
          'Local AML regulations'
        ]
      }
    ]
  },
  {
    id: 'customer-onboarding-digital',
    name: 'Onboarding Client Digital (Banque/Fintech)',
    category: 'Customer Experience',
    description: 'Processus complet d\'ouverture de compte et onboarding digital pour services financiers',
    industry: ['Banque', 'Fintech', 'Néobanque'],
    sources: [
      'Forrester - Digital Banking Onboarding Best Practices',
      'McKinsey - Customer Onboarding Excellence',
      'Gartner - Digital Customer Journey'
    ],
    steps: [
      {
        id: 'onboard-1',
        name: 'Pré-qualification et Éligibilité',
        description: 'Vérification rapide de l\'éligibilité du client avant de commencer le processus complet',
        subSteps: [
          'Questionnaire de pré-qualification (âge, résidence, nationalité)',
          'Vérification de l\'éligibilité géographique',
          'Sélection du type de compte/produit',
          'Présentation des conditions générales',
          'Estimation des besoins (usage prévu, volume)'
        ],
        estimatedTime: '2-3 minutes',
        responsible: 'Système automatisé / Chatbot',
        tools: ['Chatbot IA', 'Formulaires intelligents', 'Géolocalisation API']
      },
      {
        id: 'onboard-2',
        name: 'Capture d\'Identité (e-KYC)',
        description: 'Vérification d\'identité numérique avec documents et biométrie',
        subSteps: [
          'Prise de photo du document d\'identité (recto/verso)',
          'Extraction OCR des données',
          'Détection de falsification de document',
          'Selfie vidéo avec liveness detection',
          'Comparaison biométrique photo/selfie',
          'Vérification NFC (puce électronique du document)'
        ],
        estimatedTime: '3-5 minutes',
        responsible: 'Solution e-KYC automatisée',
        tools: ['Onfido', 'Jumio', 'iDenfy', 'Veriff']
      }
    ]
  }
];

// Function to search for process by keywords
export function searchProcessTemplates(query: string): ProcessTemplate[] {
  const queryLower = query.toLowerCase();
  return processLibrary.filter(template => 
    template.name.toLowerCase().includes(queryLower) ||
    template.description.toLowerCase().includes(queryLower) ||
    template.category.toLowerCase().includes(queryLower) ||
    template.industry.some(ind => ind.toLowerCase().includes(queryLower))
  );
}

// Function to get process template by ID
export function getProcessTemplate(id: string): ProcessTemplate | undefined {
  return processLibrary.find(template => template.id === id);
}

// Function to convert template to process description for analysis
export function templateToProcessDescription(template: ProcessTemplate): string {
  let description = `${template.name}\n\n`;
  template.steps.forEach((step, index) => {
    description += `${index + 1}. ${step.name}\n`;
    if (step.subSteps && step.subSteps.length > 0) {
      step.subSteps.forEach(subStep => {
        description += `   - ${subStep}\n`;
      });
    }
  });
  return description;
}
