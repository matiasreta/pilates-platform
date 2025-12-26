'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface Product {
    id: string
    title: string
    description: string
    price: number
    features: string[]
    stripe_price_id: string
    payment_type: string
    thumbnail?: string
    image_url?: string
}

interface MembershipCardProps {
    product: Product
    isActive: boolean
    onStartPlan?: () => void
    color?: string
}

export default function MembershipCard({ product, isActive, onStartPlan, color = '#986C4A' }: MembershipCardProps) {
    const [loading, setLoading] = useState(false)
    const imageUrl = product.thumbnail || product.image_url

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: product.stripe_price_id,
                }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error al crear la sesión')
            window.location.href = data.url
        } catch (err: any) {
            alert(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="bg-white border text-left border-gray-200 hover:border-gray-300 transition-colors rounded-xl w-full max-w-sm flex flex-col h-full shadow-sm relative overflow-hidden group">

            {/* Image Section (Optional) */}
            {imageUrl && (
                <div className="aspect-video bg-gray-100 relative w-full">
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-6 flex flex-col flex-1">

                {isActive && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Activo
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <p className="text-3xl md:text-3xl font-serif text-[#333333] mb-1 leading-tight">
                        {product.title}
                    </p>
                    <p className="text-xs text-[#333333]/60 mb-4 font-[family-name:var(--font-inter)]">
                        {product.description}
                    </p>

                    <div className="flex items-baseline gap-1">
                        <span
                            className="text-3xl font-bold font-[family-name:var(--font-poppins)]"
                            style={{ color: color }}
                        >
                            ${product.price}
                        </span>
                        <span className="text-xs text-[#333333]/60">
                            {product.payment_type === 'subscription' ? '/mes' : ''}
                        </span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                    {product.features?.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <Check
                                className="w-4 h-4 shrink-0 mt-0.5"
                                strokeWidth={2.5}
                                style={{ color: color }}
                            />
                            <span className="text-sm text-[#333333]/80 font-[family-name:var(--font-inter)]">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Action Button */}
                <button
                    onClick={isActive && onStartPlan ? onStartPlan : handleSubscribe}
                    disabled={loading || (isActive && !onStartPlan)}
                    className={`
                    w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all
                    text-white
                    disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                `}
                    style={{ backgroundColor: color }}
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isActive ? (onStartPlan ? "Iniciar plan" : "Adquirido") : "Comprar ahora"}
                </button>
            </div>
        </div>
    )
}
