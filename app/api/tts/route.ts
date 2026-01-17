import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Ensure Node.js runtime for access to fs/path/crypto
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ status: 'ok', hint: 'POST text + lang JSON to generate TTS.' });
}

// Azure Cognitive Services TTS
// Requires environment variables:
// - AZURE_TTS_KEY
// - AZURE_TTS_REGION (e.g., 'eastus')

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();
    const apiKey = process.env.AZURE_TTS_KEY;
    const region = process.env.AZURE_TTS_REGION;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }
    if (!apiKey || !region) {
      return NextResponse.json({ error: 'Server TTS not configured. Set AZURE_TTS_KEY and AZURE_TTS_REGION.' }, { status: 501 });
    }

    const trimmed = text.trim();
    if (trimmed.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 characters).' }, { status: 413 });
    }

    // Compute cache key (text + lang)
    const key = `${(lang || 'unknown').toLowerCase()}|${trimmed}`;
    const hash = crypto.createHash('sha1').update(key).digest('hex');
    const fileName = `${hash}.mp3`;
    const dirPath = path.join(process.cwd(), 'public', 'tts');
    const filePath = path.join(dirPath, fileName);

    // If cached file exists, return it regardless of provider config
    try {
      const data = await fs.readFile(filePath);
      return new Response(new Uint8Array(data), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'x-tts-cache': 'hit'
        }
      });
    } catch {}

    // Choose default voice based on language hint
    const l = (lang || '').toLowerCase();
    let voiceName = 'en-IN-NeerjaNeural';
    if (l.includes('hi') || l.includes('hindi') || l.includes('हिं') || l.includes('हिन्द')) {
      voiceName = 'hi-IN-SwaraNeural';
    } else if (l.includes('sa') || l.includes('sanskrit') || l.includes('संस्क')) {
      // Sanskrit-specific voices may be unavailable; fallback to Hindi
      voiceName = 'hi-IN-SwaraNeural';
    }

    const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xml:lang="en-US">
  <voice name="${voiceName}">
    <prosody rate="0%">${escapeXml(trimmed)}</prosody>
  </voice>
</speak>`;

    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'sarvdev-temple'
      },
      body: ssml
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'TTS provider error', details: text }, { status: 502 });
    }

    const audioBuffer = await resp.arrayBuffer();

    // Ensure directory exists and persist cache
    try {
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, new Uint8Array(audioBuffer));
    } catch (e) {
      // Non-fatal: proceed to return audio without cache on failure
    }

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'x-tts-cache': 'miss'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected server error', details: err?.message || String(err) }, { status: 500 });
  }
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
