'use client'

import PlanPrenatal from './PlanPrenatal'

interface VideosProps {
    subscription: any
    videos?: any[]
}

export default function Videos({ subscription, videos = [] }: VideosProps) {
    const hasActiveSubscription = subscription?.status === 'active'

    // If user has active subscription, show the prenatal plan
    // In the future, we can add logic to determine which plan to show based on subscription type
    if (hasActiveSubscription) {
        return <PlanPrenatal videos={videos} />
    }

    // If no active subscription, show empty state or message
    return (
        <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-lg font-medium text-gray-500 mb-2">
                No tienes una suscripción activa
            </p>
            <p className="text-sm text-gray-400">
                Suscríbete a un plan para acceder a los videos
            </p>
        </div>
    )
}

