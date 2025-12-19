import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Verify Subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .single()

        if (!subscription || subscription.status !== 'active') {
            return NextResponse.json(
                { error: 'Active subscription required' },
                { status: 403 }
            )
        }

        const { videoId } = await req.json()

        if (!videoId) {
            return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })
        }

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
        const apiToken = process.env.CLOUDFLARE_API_TOKEN

        if (!accountId || !apiToken) {
            console.error('Missing Cloudflare credentials')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}/token`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
            console.error('Cloudflare API error:', data)
            return NextResponse.json(
                { error: 'Failed to generate token' },
                { status: response.status || 500 }
            )
        }

        return NextResponse.json({ token: data.result.token })

    } catch (error) {
        console.error('Error generating token:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
