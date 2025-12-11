import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
    typescript: true,
})

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
    userId: string,
    email: string
): Promise<string> {
    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({
        email,
        limit: 1,
    })

    if (customers.data.length > 0) {
        return customers.data[0].id
    }

    // Create new customer
    const customer = await stripe.customers.create({
        email,
        metadata: {
            supabase_user_id: userId,
        },
    })

    return customer.id
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string,
    mode: 'subscription' | 'payment' = 'subscription'
): Promise<string> {
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        mode: mode,
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            user_id: userId,
            price_id: priceId, // Store price_id in metadata for easier retrieval in webhooks
        },
    }

    if (mode === 'subscription') {
        sessionConfig.subscription_data = {
            metadata: {
                user_id: userId,
            },
        }
    } else {
        sessionConfig.payment_intent_data = {
            metadata: {
                user_id: userId,
                price_id: priceId,
            },
        }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return session.url!
}

/**
 * Create a Customer Portal session for subscription management
 */
export async function createCustomerPortalSession(
    customerId: string,
    returnUrl: string
): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    })

    return session.url
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
    return await stripe.subscriptions.retrieve(subscriptionId)
}
