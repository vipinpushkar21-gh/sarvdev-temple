# Sarvdev Temple

Next.js 15 + TypeScript + Tailwind CSS scaffold (App Router)

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Run development server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

Notes:

### Server TTS (Optional)

Devotionals support generating audio via Azure Cognitive Services Text-to-Speech. If you click "Generate Audio (Server)" and see an error about missing configuration, add the following to a new `.env.local` file at the project root:

```
AZURE_TTS_KEY="<your-azure-speech-key>"
AZURE_TTS_REGION="<your-azure-region>" # e.g., eastus, westus2, centralindia
```

Then restart the dev server. An example file is provided at [.env.local.example](.env.local.example).

If you prefer not to configure Azure, use the built-in browser TTS via the "Play via TTS" control.
