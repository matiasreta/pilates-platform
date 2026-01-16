import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { getCachedProducts, getCachedUserAccess } from '@/lib/cache'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user profile (not cached - contains sensitive data)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get cached data in parallel
    const [products, userAccess] = await Promise.all([
        getCachedProducts(),
        getCachedUserAccess(user.id)
    ])

    const { subscriptions, purchases, accessiblePriceIds } = userAccess

    // Get libros (not cached - contains download links)
    const { data: libros, error: librosError } = await supabase
        .from('libros')
        .select('*')
        .order('orden', { ascending: true })

    if (librosError) {
        console.error('Error fetching libros:', librosError)
    }

    // Get videos based on access (not cached - dynamic content)
    let videos: any[] = []

    if (accessiblePriceIds.length > 0) {
        // Find product IDs from cached products that user has access to
        const validProductUUIDs = products
            .filter((p: any) => accessiblePriceIds.includes(p.stripe_price_id))
            .map((p: any) => p.id)

        if (validProductUUIDs.length > 0) {
            const { data: videosData, error: videosError } = await supabase
                .from('videos')
                .select('*')
                .in('product_id', validProductUUIDs)
                .eq('is_published', true)

            if (videosError) {
                console.error('Error fetching videos:', videosError)
            } else {
                videos = videosData || []
            }
        }
    }

    return <DashboardClient
        user={user}
        profile={profile}
        subscriptions={subscriptions || []}
        products={products || []}
        purchases={purchases || []}
        libros={libros || []}
        videos={videos}
    />
}
