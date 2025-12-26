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

    // Get user subscriptions
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

    // Get available products
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: true }) // Optional ordering

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

    // Get videos based on access 
    // Logic: If any subscription or purchase links to a product, get that product's videos.
    let videos: any[] = []

    // Collect all valid product IDs from subscriptions and purchases
    const activeProductIds = [
        ...(subscriptions?.map(s => s.price_id) || []), // Note: using price_id for now, but better if subscription had product_id. 
        // Actually, our API stores price_id. We need to map price_id back to product_id if possible, 
        // OR products table.stripe_price_id matches.
        ...(purchases?.map(p => p.stripe_price_id) || [])
    ]

    // If we have any active product access, fetch the videos linked to those products (via product_idFK?)
    // WAIT: Subscription table has `price_id`. We need to find products where `stripe_price_id` is in `activeProductIds`.
    // Then get videos where `product_id` is in that list of product IDs.

    if (activeProductIds.length > 0) {
        // First, get the product IDs (UUIDs) corresponding to these Price IDs
        const { data: activeProducts } = await supabase
            .from('products')
            .select('id')
            .in('stripe_price_id', activeProductIds)

        const validProductUUIDs = activeProducts?.map(p => p.id) || []

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
