import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('❌ ElevenLabs API error:', text)
      throw new Error('Failed to get signed URL')
    }

    const data = await res.json()
    return NextResponse.json({ signedUrl: data.signed_url })
  } catch (err) {
    console.error('🚨 API Route Error:', err)
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    )
  }
}
