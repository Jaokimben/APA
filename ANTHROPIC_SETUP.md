# 🚀 Configuration Rapide - Anthropic Claude Vision

## ⚡ Guide en 3 Minutes

L'analyse d'image BPMN est maintenant intégrée avec **Anthropic Claude 3.5 Sonnet**. Voici comment activer cette fonctionnalité.

---

## 📋 Prérequis

- ✅ Application déployée sur Cloudflare Pages
- ✅ Accès au dashboard Cloudflare
- ✅ Carte de crédit (pour créer un compte Anthropic)

---

## 🔑 Étape 1 : Obtenir une Clé API Anthropic

### 1.1 Créer un Compte

Allez sur : **https://console.anthropic.com/**

- Cliquez sur "Sign Up"
- Créez votre compte avec email
- Vérifiez votre email

### 1.2 Ajouter un Moyen de Paiement

- Allez dans **Settings** → **Billing**
- Ajoutez une carte de crédit
- Anthropic offre **$5 de crédit gratuit** pour commencer

### 1.3 Créer une Clé API

- Allez dans **Settings** → **API Keys**
- Cliquez sur **"Create Key"**
- Donnez un nom : `agentic-process-analyzer`
- **COPIEZ la clé immédiatement** (vous ne pourrez plus la voir après)

**Format de la clé** : `sk-ant-api03-...` (commence par `sk-ant-`)

---

## ⚙️ Étape 2 : Configurer le Secret Cloudflare

### Option A : Via Interface Web Cloudflare (Recommandé)

1. **Allez sur votre Dashboard Cloudflare** : https://dash.cloudflare.com

2. **Naviguez vers Workers & Pages**
   - Cliquez sur "Workers & Pages" dans le menu latéral
   - Trouvez votre projet : **agentic-process-analyzer**
   - Cliquez dessus

3. **Ajoutez le Secret**
   - Cliquez sur l'onglet **"Settings"**
   - Scrollez jusqu'à **"Environment Variables"**
   - Section **"Production"** → Cliquez **"Add variable"**
   - Type : **Secret** (pas Variable)
   - Name : `ANTHROPIC_API_KEY`
   - Value : Collez votre clé API Anthropic
   - Cliquez **"Save"**

4. **Redéployez**
   - Allez dans l'onglet **"Deployments"**
   - Cliquez **"Retry deployment"** sur le dernier déploiement
   - Ou attendez le prochain push GitHub (si CI/CD configuré)

### Option B : Via CLI Wrangler (Alternative)

```bash
# Depuis votre terminal local ou sandbox
cd /home/user/webapp

# Ajoutez le secret
npx wrangler secret put ANTHROPIC_API_KEY \
  --project-name agentic-process-analyzer

# Entrez votre clé API quand demandé (collez sk-ant-...)
# Appuyez sur Entrée

# Le secret est maintenant configuré !
```

---

## ✅ Étape 3 : Tester l'Analyse d'Image

### 3.1 Via l'Interface Web

1. Allez sur : **https://agentic-process-analyzer.pages.dev**
2. Cliquez sur le bouton **"Format BPMN"**
3. Uploadez une image de diagramme (PNG, JPG, JPEG)
4. Cliquez sur **"Analyser avec l'IA Agentique"**
5. ✨ **Claude Vision analyse automatiquement votre diagramme !**

### 3.2 Via API (Test)

```bash
# Créez un fichier test avec une petite image
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" > /tmp/test.b64

# Testez l'API
curl -X POST https://agentic-process-analyzer.pages.dev/api/analyze-image \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"data:image/png;base64,$(cat /tmp/test.b64)\"}" | jq
```

**Attendu** : Vous devriez voir `"source": "Extracted from image using Anthropic Claude 3.5 Sonnet"`

---

## 💰 Tarification Anthropic

### Coûts Claude 3.5 Sonnet

**Images** :
- Input : **$3.00 / million de tokens**
- Output : **$15.00 / million de tokens**

**Estimation pratique** :
- Une image moyenne (~1024x1024) = ~1500 input tokens
- Une réponse processus = ~500 output tokens
- **Coût par image** : ~$0.012 (1.2 centimes)

**Avec le crédit gratuit de $5** :
- Vous pouvez analyser **~400 images gratuitement** !

### Limites du Plan Gratuit

- **$5 de crédit gratuit** (pas de renouvellement)
- Pas de limite de requêtes par minute
- Valide pendant 3 mois

### Pour Production

**Tier 1** (paiement à l'usage) :
- $5 de crédit minimum
- 50 requêtes/minute
- Parfait pour MVP et tests

**Tier 2** (après $100 dépensés) :
- 1000 requêtes/minute
- Idéal pour production

---

## 🔍 Vérifier la Configuration

### Test Simple

```bash
# Vérifiez que le secret est configuré
npx wrangler secret list --project-name agentic-process-analyzer

# Vous devriez voir:
# ANTHROPIC_API_KEY
```

### Logs Cloudflare

1. Allez sur : https://dash.cloudflare.com
2. Workers & Pages → agentic-process-analyzer
3. Onglet **"Logs"** → **"Begin log stream"**
4. Uploadez une image sur le site
5. Vous verrez les logs en temps réel

**Success** : Pas d'erreur `ANTHROPIC_API_KEY not configured`

---

## ❓ Troubleshooting

### Erreur : "ANTHROPIC_API_KEY not configured"

**Solution** :
1. Vérifiez que le secret est bien ajouté dans Cloudflare
2. Vérifiez le nom exact : `ANTHROPIC_API_KEY` (sensible à la casse)
3. Redéployez l'application après ajout du secret

### Erreur : "Claude API error: 401 Unauthorized"

**Solution** :
1. Vérifiez que votre clé API est correcte
2. Assurez-vous qu'elle commence par `sk-ant-`
3. Vérifiez que votre compte Anthropic est actif
4. Vérifiez que vous avez du crédit disponible

### Erreur : "Claude API error: 429 Rate Limited"

**Solution** :
1. Vous avez dépassé la limite de requêtes/minute
2. Attendez 60 secondes
3. Pour production : upgrader vers Tier 2

### L'analyse retourne toujours la réponse simulée

**Vérifications** :
1. Le secret est-il configuré ? (voir ci-dessus)
2. L'application a-t-elle été redéployée après ajout du secret ?
3. Vérifiez les logs Cloudflare pour voir les erreurs exactes

---

## 🎯 Modèle Utilisé

**Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`)

**Pourquoi ce modèle ?**
- ✅ **Meilleur rapport qualité/prix** pour Vision
- ✅ Excellent pour analyser des diagrammes techniques
- ✅ Comprend le contexte métier français
- ✅ Génère des descriptions structurées
- ✅ Plus rapide que Claude Opus
- ✅ Moins cher que GPT-4 Vision

**Alternatives** :
- `claude-3-opus-20240229` : Meilleure qualité mais 2x plus cher
- `claude-3-haiku-20240307` : Moins cher mais qualité inférieure

---

## 📊 Monitoring des Coûts

### Dashboard Anthropic

1. Allez sur : https://console.anthropic.com/settings/usage
2. Vous verrez :
   - Crédit restant
   - Utilisation par jour
   - Coût par modèle
   - Nombre de tokens consommés

### Alertes de Budget

Dans **Settings** → **Usage** → **Set budget alert**
- Configurez une alerte à 80% du crédit
- Recevez un email quand vous approchez de la limite

---

## 🚀 C'est Tout !

Une fois la clé API configurée, **l'analyse d'image fonctionne automatiquement** !

**Testez maintenant** : https://agentic-process-analyzer.pages.dev

---

## 📞 Support

**Problèmes ?**
1. Vérifiez les logs Cloudflare (temps réel)
2. Consultez la documentation Anthropic : https://docs.anthropic.com/
3. Ouvrez une issue GitHub : https://github.com/Jaokimben/APA/issues

**Besoin d'aide pour la configuration ?**
- Consultez `VISION_AI_INTEGRATION.md` pour les détails techniques
- Documentation Cloudflare Workers : https://developers.cloudflare.com/workers/

---

**L'analyse d'image BPMN avec Claude Vision est maintenant active ! 🎉**
