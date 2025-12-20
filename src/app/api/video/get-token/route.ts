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

        // 2. Access Control Logic
        const { videoId } = await req.json()

        if (!videoId) {
            return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })
        }

        // Check 1: Is this video a One-time Purchase Product (Guide Video)?
        const { data: product } = await supabase
            .from('products')
            .select('stripe_price_id')
            .eq('cloudflare_video_id', videoId)
            .single()

        let hasAccess = false;

        if (product) {
            // It IS a guide/product. Access requires a specific purchase.
            // Active Subscription does NOT grant access to these videos.
            const { data: purchase } = await supabase
                .from('one_time_purchases')
                .select('id')
                .eq('user_id', user.id)
                .eq('stripe_price_id', product.stripe_price_id)
                .eq('status', 'completed')
                .single()

            if (purchase) {
                hasAccess = true;
            }
        } else {
            // It is NOT a product. It must be a subscription library video.
            // Check for Active Subscription
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', user.id)
                .single()

            if (subscription && subscription.status === 'active') {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return NextResponse.json(
                { error: product ? 'Guide purchase required' : 'Active subscription required' },
                { status: 403 }
            )
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
