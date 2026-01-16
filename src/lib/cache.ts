import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Cache TTL constants (in seconds)
const CACHE_TTL = {
    PRODUCTS: 60 * 60, // 1 hour
    USER_ACCESS: 60 * 2, // 2 minutes
}

/**
 * Get all products from cache (1 hour TTL)
 * Products rarely change and are safe to cache
 */
export const getCachedProducts = unstable_cache(
    async () => {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('price', { ascending: true })

        if (error) {
            console.error('Error fetching products:', error)
            return []
        }

        return data || []
    },
    ['products'],
    { revalidate: CACHE_TTL.PRODUCTS, tags: ['products'] }
)

/**
 * Get user access data - combines subscriptions and one_time_purchases
 * This is the main function to verify if a user has paid for content
 * Uses a 2 minute TTL for quick updates after payment
 */
export const getCachedUserAccess = (userId: string) =>
    unstable_cache(
        async () => {
            const supabase = createAdminClient()

            // Fetch subscriptions and purchases in parallel
            const [subscriptionsResult, purchasesResult] = await Promise.all([
                supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('status', 'active'),
                supabase
                    .from('one_time_purchases')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('status', 'completed')
            ])

            const subscriptions = subscriptionsResult.data || []
            const purchases = purchasesResult.data || []

            // Extract all price IDs the user has access to
            const accessiblePriceIds = [
                ...subscriptions.map(s => s.price_id),
                ...purchases.map(p => p.stripe_price_id)
            ].filter(Boolean)

            // Check if user has any active subscription
            const hasActiveSubscription = subscriptions.length > 0

            return {
                subscriptions,
                purchases,
                accessiblePriceIds,
                hasActiveSubscription,
                // Helper function to check access to a specific price
                hasPriceAccess: (priceId: string) => accessiblePriceIds.includes(priceId)
            }
        },
        [`user-access-${userId}`],
        { revalidate: CACHE_TTL.USER_ACCESS, tags: [`user-${userId}`] }
    )()

/**
 * Helper to check if a user has access to a specific product
 * Uses cached products and user access data
 */
export async function checkProductAccess(userId: string, productId: string): Promise<boolean> {
    const [products, userAccess] = await Promise.all([
        getCachedProducts(),
        getCachedUserAccess(userId)
    ])

    const product = products.find((p: any) => p.id === productId)
    if (!product) return false

    return userAccess.hasPriceAccess(product.stripe_price_id)
}

/**
 * Get the latest subscription for navbar display
 * Uses the cached user access data
 */
export async function getCachedLatestSubscription(userId: string) {
    const userAccess = await getCachedUserAccess(userId)

    if (userAccess.subscriptions.length === 0) return null

    // Return the most recent subscription
    return userAccess.subscriptions.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
}
