import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSignedUrl } from '@/lib/cloudflare-stream'

/**
 * GET /api/videos/[id]/stream
 * Get signed streaming URL for a video (requires active subscription)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
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
                { error: 'Suscripción activa requerida para ver videos' },
                { status: 403 }
            )
        }

        // Get video details from database
        const { data: video, error } = await supabase
            .from('videos')
            .select('*')
            .eq('id', id)
            .eq('published', true)
            .single()

        if (error || !video) {
            return NextResponse.json(
                { error: 'Video no encontrado' },
                { status: 404 }
            )
        }

        if (!video.cloudflare_video_id) {
            return NextResponse.json(
                { error: 'Video no disponible' },
                { status: 404 }
            )
        }

        // Generate signed URL (expires in 1 hour)
        const signedUrl = generateSignedUrl(video.cloudflare_video_id, 3600)

        // Get user profile for watermark
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            streamUrl: signedUrl,
            videoId: video.cloudflare_video_id,
            title: video.title,
            description: video.description,
            duration: video.duration,
            thumbnailUrl: video.thumbnail_url,
            watermark: profile?.email || user.email,
        })
    } catch (error: any) {
        console.error('Error generating stream URL:', error)
        return NextResponse.json(
            { error: 'Error al generar URL de streaming' },
            { status: 500 }
        )
    }
}
