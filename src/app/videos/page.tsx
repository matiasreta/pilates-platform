import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VideosPageClient from './VideosPageClient'

export default async function VideosPage() {
    const supabase = await createClient()

    // Get authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()

    const hasActiveSubscription = subscription?.status === 'active'

    // Get user email
    const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single()

    const userEmail = profile?.email || user.email || ''

    return (
        <VideosPageClient
            hasActiveSubscription={hasActiveSubscription}
            userEmail={userEmail}
        />
    )
}
