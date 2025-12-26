'use client'

import { User } from '@supabase/supabase-js'
import PlanPrenatal from './PlanPrenatal'
import VacationVideos from './VacationVideos'
import GuideVideos from './GuideVideos'
import Favoritos from './Favoritos'

interface VideosProps {
    user: User
    subscriptions: any[]
    videos?: any[]
    products?: any[] // Needed to map product IDs/Titles
}

export default function Videos({ user, subscriptions = [], videos = [], products = [] }: VideosProps) {
    const hasActiveSubscription = subscriptions.some(s => s.status === 'active')
    const hasAccess = hasActiveSubscription || videos.length > 0

    // Helper to get product features
    const getProductById = (id: string) => products.find(p => p.id === id)

    // Group videos by product_id
    const videosByProduct: Record<string, any[]> = {}
    videos.forEach(v => {
        if (v.product_id) {
            if (!videosByProduct[v.product_id]) {
                videosByProduct[v.product_id] = []
            }
            videosByProduct[v.product_id].push(v)
        } else {
            // Fallback for old prenatal videos with null product_id? 
            // Assuming they belong to 'Plan Prenatal' if that exists, or handle separately.
            // For now, let's treat null product_id as "Prenatal" for backward compatibility if needed, 
            // but ideally data migration fixed this.
            // If we really need a key, we can use 'legacy'.
        }
    })

    // Determine which components to render based on available video groups
    const renderedSections = Object.entries(videosByProduct).map(([productId, productVideos]) => {
        const product = getProductById(productId)
        if (!product) return null

        const titleLower = product.title.toLowerCase()

        if (titleLower.includes('prenatal')) {
            return <PlanPrenatal key={productId} videos={productVideos} />
        } else if (titleLower.includes('vacaciones')) {
            return <VacationVideos key={productId} videos={productVideos} />
        } else {
            // Default to generic Guide view
            return <GuideVideos key={productId} title={product.title} videos={productVideos} />
        }
    })

    return (
        <div className="space-y-12">
            {/* Favoritos Section - Always active if user is logged in? Or only if has access? */}
            <Favoritos userId={user.id} />

            {hasAccess ? (
                <div className="space-y-16">
                    {renderedSections}
                    {renderedSections.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No se encontraron videos disponibles para tus productos activos.
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-lg font-medium text-gray-500 mb-2">
                        No tienes acceso a ningún contenido
                    </p>
                    <p className="text-sm text-gray-400">
                        Suscríbete a un plan o adquiere una guía para ver los videos
                    </p>
                </div>
            )}
        </div>
    )
}

