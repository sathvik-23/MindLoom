// app/api/get-agent/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing agent ID or API key' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      )
    }

    const agentConfig = await response.json()
    return NextResponse.json(agentConfig)
  } catch (error) {
    console.error('❌ Error fetching agent config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent configuration' },
      { status: 500 }
    )
  }
}
