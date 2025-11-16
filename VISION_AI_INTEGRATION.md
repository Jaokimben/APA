# 🖼️ Guide d'Intégration Vision AI pour Analyse d'Images BPMN

## 📋 Vue d'Ensemble

La v1.4.0 introduit le support d'upload d'images BPMN. Actuellement, l'endpoint `/api/analyze-image` retourne une réponse simulée. Ce guide explique comment intégrer une vraie API Vision AI pour analyser automatiquement les diagrammes de processus.

---

## 🎯 Cas d'Usage

L'utilisateur peut :
1. Cliquer sur le mode "Format BPMN"
2. Uploader une image de diagramme BPMN (PNG, JPG, JPEG)
3. L'IA analyse l'image et extrait les étapes du processus
4. L'application effectue ensuite l'analyse 3 niveaux standard

---

## 🔧 Options d'Intégration

### Option 1 : OpenAI GPT-4 Vision (Recommandé)

**Avantages** :
- ✅ Excellent pour comprendre les diagrammes complexes
- ✅ Peut interpréter le contexte et la logique
- ✅ Extraction structurée des étapes
- ✅ Support multilingue

**Coût** : ~$0.01 par image (1024x1024)

**Implémentation** :

```typescript
// src/index.tsx

app.post('/api/analyze-image', async (c) => {
  try {
    const { image } = await c.req.json()
    
    if (!image) {
      return c.json({ error: 'Image is required' }, 400)
    }

    // Call OpenAI GPT-4 Vision
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}` // Cloudflare secret
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analysez ce diagramme BPMN et extrayez toutes les étapes du processus.
                
Retournez le résultat dans ce format exact:

Processus [Nom du processus]

1. [Nom de l'étape 1]
   - [Sous-étape A]
   - [Sous-étape B]

2. [Nom de l'étape 2]
   - [Sous-étape A]
   - [Sous-étape B]

Incluez toutes les étapes visibles dans le diagramme.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    })

    const result = await openaiResponse.json()
    const processDescription = result.choices[0].message.content

    return c.json({
      description: processDescription,
      source: 'Extracted from image using GPT-4 Vision',
      model: 'gpt-4-vision-preview'
    })
  } catch (error) {
    return c.json({ error: 'Error analyzing image' }, 500)
  }
})
```

**Configuration Cloudflare** :

```bash
# Ajouter la clé API OpenAI comme secret
npx wrangler secret put OPENAI_API_KEY --project-name agentic-process-analyzer

# Entrez votre clé API OpenAI quand demandé
```

**wrangler.jsonc** :

```jsonc
{
  "name": "agentic-process-analyzer",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": ["nodejs_compat"],
  // Les secrets sont automatiquement disponibles via c.env
}
```

---

### Option 2 : Anthropic Claude Vision

**Avantages** :
- ✅ Excellent pour l'analyse de documents techniques
- ✅ Peut générer des descriptions détaillées
- ✅ Bonne compréhension du contexte métier

**Coût** : ~$0.008 par image (1024x1024)

**Implémentation** :

```typescript
app.post('/api/analyze-image', async (c) => {
  try {
    const { image } = await c.req.json()
    
    // Extraire le base64 sans le préfixe
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')
    
    // Call Anthropic Claude Vision
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': c.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png', // ou image/jpeg
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: `Analysez ce diagramme BPMN et extrayez toutes les étapes du processus métier.

Format de sortie:

Processus [Nom]

1. [Étape 1]
   - [Détail A]
   - [Détail B]

2. [Étape 2]
   ...

Soyez exhaustif et incluez toutes les étapes visibles.`
              }
            ]
          }
        ]
      })
    })

    const result = await claudeResponse.json()
    const processDescription = result.content[0].text

    return c.json({
      description: processDescription,
      source: 'Extracted from image using Claude Vision',
      model: 'claude-3-opus-20240229'
    })
  } catch (error) {
    return c.json({ error: 'Error analyzing image' }, 500)
  }
})
```

**Configuration** :

```bash
npx wrangler secret put ANTHROPIC_API_KEY --project-name agentic-process-analyzer
```

---

### Option 3 : Google Cloud Vision API

**Avantages** :
- ✅ Excellent OCR multilingue
- ✅ Détection de texte dans les images
- ✅ Service mature et fiable

**Coût** : ~$1.50 pour 1000 images (OCR)

**Implémentation** :

```typescript
app.post('/api/analyze-image', async (c) => {
  try {
    const { image } = await c.req.json()
    
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')
    
    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${c.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [
                { type: 'DOCUMENT_TEXT_DETECTION' }
              ]
            }
          ]
        })
      }
    )

    const result = await visionResponse.json()
    const extractedText = result.responses[0].fullTextAnnotation?.text || ''
    
    // Post-process the OCR text to structure it as a process
    const processDescription = structureProcessFromOCR(extractedText)

    return c.json({
      description: processDescription,
      source: 'Extracted from image using Google Cloud Vision',
      rawText: extractedText
    })
  } catch (error) {
    return c.json({ error: 'Error analyzing image' }, 500)
  }
})

function structureProcessFromOCR(text: string): string {
  // Simple logic to structure OCR text into process steps
  const lines = text.split('\n').filter(l => l.trim())
  
  let structured = 'Processus Extrait de l\'Image\n\n'
  let stepCounter = 1
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length > 5) {
      structured += `${stepCounter}. ${trimmed}\n`
      stepCounter++
    }
  }
  
  return structured
}
```

**Configuration** :

```bash
npx wrangler secret put GOOGLE_CLOUD_API_KEY --project-name agentic-process-analyzer
```

---

### Option 4 : AWS Rekognition

**Avantages** :
- ✅ Intégré à l'écosystème AWS
- ✅ Détection de texte robuste
- ✅ Scalable

**Coût** : ~$1.00 pour 1000 images (text detection)

**Implémentation** :

```typescript
// Nécessite l'installation de AWS SDK
// npm install @aws-sdk/client-rekognition

import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition'

app.post('/api/analyze-image', async (c) => {
  try {
    const { image } = await c.req.json()
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')
    
    const client = new RekognitionClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: c.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY
      }
    })

    const command = new DetectTextCommand({
      Image: {
        Bytes: Buffer.from(base64Image, 'base64')
      }
    })

    const response = await client.send(command)
    const detectedText = response.TextDetections
      ?.filter(t => t.Type === 'LINE')
      .map(t => t.DetectedText)
      .join('\n') || ''
    
    const processDescription = structureProcessFromOCR(detectedText)

    return c.json({
      description: processDescription,
      source: 'Extracted from image using AWS Rekognition'
    })
  } catch (error) {
    return c.json({ error: 'Error analyzing image' }, 500)
  }
})
```

**Configuration** :

```bash
npx wrangler secret put AWS_ACCESS_KEY_ID --project-name agentic-process-analyzer
npx wrangler secret put AWS_SECRET_ACCESS_KEY --project-name agentic-process-analyzer
```

---

## 📊 Comparaison des Options

| Service | Coût/1000 imgs | Qualité Diagrammes | Setup Complexité | Latence |
|---------|----------------|-------------------|------------------|---------|
| **GPT-4 Vision** | ~$10 | ⭐⭐⭐⭐⭐ | Facile | ~3-5s |
| **Claude Vision** | ~$8 | ⭐⭐⭐⭐⭐ | Facile | ~3-5s |
| **Google Cloud Vision** | ~$1.50 | ⭐⭐⭐ | Moyenne | ~1-2s |
| **AWS Rekognition** | ~$1.00 | ⭐⭐⭐ | Moyenne | ~1-2s |

**Recommandation** : 
- **Pour les diagrammes complexes** : GPT-4 Vision ou Claude Vision
- **Pour les diagrammes simples avec beaucoup de texte** : Google Cloud Vision ou AWS Rekognition
- **Pour le meilleur rapport qualité/coût** : Claude Vision

---

## 🚀 Déploiement

### 1. Choisir un Service

Décidez quel service Vision AI utiliser selon vos besoins.

### 2. Obtenir les Clés API

- **OpenAI** : https://platform.openai.com/api-keys
- **Anthropic** : https://console.anthropic.com/
- **Google Cloud** : https://console.cloud.google.com/
- **AWS** : https://console.aws.amazon.com/

### 3. Configurer les Secrets Cloudflare

```bash
# Exemple avec OpenAI
npx wrangler secret put OPENAI_API_KEY --project-name agentic-process-analyzer
```

### 4. Modifier le Code

Remplacez l'endpoint `/api/analyze-image` dans `src/index.tsx` avec l'implémentation choisie.

### 5. Tester Localement

```bash
npm run build
npm run dev

# Test avec curl
curl -X POST http://localhost:3000/api/analyze-image \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,..."}'
```

### 6. Déployer

```bash
npm run deploy:prod
```

---

## 💡 Conseils de Production

### Gestion des Erreurs

```typescript
try {
  // Call Vision API
  const response = await fetch(...)
  
  if (!response.ok) {
    throw new Error(`Vision API error: ${response.status}`)
  }
  
  // Process response
} catch (error) {
  console.error('Vision AI error:', error)
  
  // Fallback: return simulated response
  return c.json({
    description: generateFallbackProcess(),
    source: 'Fallback response - Vision AI unavailable',
    error: error.message
  })
}
```

### Optimisation des Coûts

```typescript
// Limiter la taille des images avant envoi
function resizeImage(base64Image: string, maxWidth: number): string {
  // Redimensionner l'image si trop grande
  // Réduire la qualité JPEG si nécessaire
  // Cela réduit les coûts API
}

// Caching des résultats
const imageHash = hashBase64(image)
const cached = await cache.get(imageHash)
if (cached) {
  return c.json(cached)
}
```

### Monitoring

```typescript
// Logger les métriques
console.log('[Vision AI]', {
  model: 'gpt-4-vision',
  imageSize: base64Data.length,
  processingTime: Date.now() - startTime,
  success: true
})
```

---

## 📚 Ressources

### Documentation Officielle
- **OpenAI GPT-4 Vision** : https://platform.openai.com/docs/guides/vision
- **Anthropic Claude Vision** : https://docs.anthropic.com/claude/docs/vision
- **Google Cloud Vision** : https://cloud.google.com/vision/docs
- **AWS Rekognition** : https://docs.aws.amazon.com/rekognition/

### Exemples de Code
- Repository avec exemples : https://github.com/examples/vision-ai-integration
- Cloudflare Workers avec Vision AI : https://developers.cloudflare.com/workers/

---

## ❓ FAQ

**Q : Puis-je utiliser plusieurs services Vision AI ?**
R : Oui, vous pouvez implémenter un système de fallback qui essaie GPT-4 Vision d'abord, puis Claude Vision, puis Google Cloud Vision.

**Q : Comment gérer les images trop grandes ?**
R : Redimensionnez les images côté client avant upload, ou côté serveur avant envoi à l'API Vision.

**Q : Quel est le délai de traitement ?**
R : 1-5 secondes selon le service et la taille de l'image.

**Q : Comment sécuriser les clés API ?**
R : Toujours utiliser Cloudflare Secrets, jamais commiter les clés dans le code.

---

**Une fois intégré, les utilisateurs pourront uploader n'importe quel diagramme BPMN et obtenir une analyse automatique ! 🎉**
