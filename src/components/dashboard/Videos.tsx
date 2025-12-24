'use client'

import { User } from '@supabase/supabase-js'
import PlanPrenatal from './PlanPrenatal'
import Favoritos from './Favoritos'

interface VideosProps {
    user: User
    subscription: any
    videos?: any[]
}

export default function Videos({ user, subscription, videos = [] }: VideosProps) {
    const hasActiveSubscription = subscription?.status === 'active'

    return (
        <div className="space-y-12">
            {/* Favoritos Section */}
            <Favoritos userId={user.id} />

            {/* Plan Prenatal Section */}
            {hasActiveSubscription ? (
                <PlanPrenatal videos={videos} />
            ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-lg font-medium text-gray-500 mb-2">
                        No tienes una suscripción activa
                    </p>
                    <p className="text-sm text-gray-400">
                        Suscríbete a un plan para acceder a los videos
                    </p>
                </div>
            )}
        </div>
    )
}

