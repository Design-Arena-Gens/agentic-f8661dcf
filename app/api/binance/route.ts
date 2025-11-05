import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { apiKey, apiSecret } = await request.json()

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'API Key ve Secret Key gereklidir' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}`

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(queryString)
      .digest('hex')

    const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.msg || 'Binance API hatası' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Binance API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
