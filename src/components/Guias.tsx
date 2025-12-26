'use client'

import { useState } from 'react'
import MembershipCard from './MembershipCard'

interface GuiasProps {
    products?: any[]
    purchases?: any[]
}

export default function Guias({ products = [], purchases = [] }: GuiasProps) {
    // Filter strictly for 'payment' type products (one-time purchases) AND exclude books
    const guiasProducts = products.filter(p => p.payment_type === 'payment' && !p.isBook)

    if (guiasProducts.length === 0) {
        return (
            <div className="bg-white border text-center border-gray-200 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Guías Disponibles</h3>
                <p className="text-gray-500">No hay guías disponibles en este momento.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guiasProducts.map((product) => {
                const isPurchased = purchases.some(p => p.stripe_price_id === product.stripe_price_id)

                return (
                    <MembershipCard
                        key={product.id}
                        product={product}
                        isActive={isPurchased}
                        color="#333333" // Dark color for guides/courses
                        onStartPlan={undefined} // No "Start Plan" action needed here, just "Acquired" state
                    />
                )
            })}
        </div>
    )
}
