import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get user subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Get available products
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')

    if (productsError) {
        console.error('Error fetching products:', productsError)
    } else {
        console.log('Server-side products fetched:', products)
    }

    // Get user one-time purchases
    const { data: purchases, error: purchasesError } = await supabase
        .from('one_time_purchases')
        .select('*')
        .eq('user_id', user.id)

    if (purchasesError) {
        console.error('Error fetching purchases:', purchasesError)
    } else {
        console.log('Server-side purchases fetched:', purchases)
    }

    // Get libros
    const { data: libros, error: librosError } = await supabase
        .from('libros')
        .select('*')
        .order('orden', { ascending: true })

    if (librosError) {
        console.error('Error fetching libros:', librosError)
    }

    // Get videos if subscription is active
    let videos = []
    if (subscription && subscription.status === 'active') {
        const { data: videosData, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .eq('is_published', true)

        if (videosError) {
            console.error('Error fetching videos:', videosError)
        } else {
            videos = videosData || []
        }
    }

    return <DashboardClient
        user={user}
        profile={profile}
        subscription={subscription}
        products={products || []}
        purchases={purchases || []}
        libros={libros || []}
        videos={videos}
    />
}
