import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/videos
 * List all published videos (requires active subscription)
 */
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user has active subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .single()

        if (!subscription || subscription.status !== 'active') {
            return NextResponse.json(
                { error: 'Suscripción activa requerida' },
                { status: 403 }
            )
        }

        // Get all published videos
        const { data: videos, error } = await supabase
            .from('videos')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return NextResponse.json({ videos })
    } catch (error: any) {
        console.error('Error fetching videos:', error)
        return NextResponse.json(
            { error: 'Error al obtener videos' },
            { status: 500 }
        )
    }
}
