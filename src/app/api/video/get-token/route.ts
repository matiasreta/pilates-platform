import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCachedProducts, getCachedUserAccess } from '@/lib/cache'

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

        // Get video info (not cached - dynamic content)
        const { data: videoRecord } = await supabase
            .from('videos')
            .select('product_id')
            .eq('cloudflare_video_id', videoId)
            .single()

        let hasAccess = false

        if (videoRecord && videoRecord.product_id) {
            // Video is linked to a specific product. Check if user owns that product.
            // Use cached data for products and user access
            const [products, userAccess] = await Promise.all([
                getCachedProducts(),
                getCachedUserAccess(user.id)
            ])

            const product = products.find((p: any) => p.id === videoRecord.product_id)

            if (product) {
                // Check if user has access to this product's price
                hasAccess = userAccess.hasPriceAccess(product.stripe_price_id)
            }
        } else {
            // Legacy/Fallback: Video has no product_id. 
            // Check for ANY active subscription using cached data.
            const userAccess = await getCachedUserAccess(user.id)
            hasAccess = userAccess.hasActiveSubscription
        }

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'You do not have access to this content.' },
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
