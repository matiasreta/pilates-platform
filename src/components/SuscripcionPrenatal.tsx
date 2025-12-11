'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface SuscripcionPrenatalProps {
    user: User
    subscription: any
}

export default function SuscripcionPrenatal({ user, subscription }: SuscripcionPrenatalProps) {
    const searchParams = useSearchParams()
    const [showSuccess, setShowSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isSubscribed = subscription && subscription.status === 'active'

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setShowSuccess(true)
            const url = new URL(window.location.href)
            url.searchParams.delete('success')
            window.history.replaceState({}, '', url.toString())
            setTimeout(() => setShowSuccess(false), 5000)
        }
    }, [searchParams])

    const handleSubscribe = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error al crear la sesión')
            window.location.href = data.url
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm">
            {showSuccess && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 shadow-lg"
                    >
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">¡Suscripción confirmada!</span>
                    </motion.div>
                </div>
            )}

            <div className="bg-white border text-left border-gray-200 hover:border-gray-300 transition-colors p-6 rounded-xl w-full flex flex-col h-full shadow-sm relative overflow-hidden group">

                {isSubscribed && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Activo
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#333333] font-[family-name:var(--font-poppins)] mb-1">
                        Plan Prenatal
                    </h3>
                    <p className="text-xs text-[#333333]/60 mb-4 font-[family-name:var(--font-inter)]">
                        Acompañamiento completo
                    </p>

                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#986C4A] font-[family-name:var(--font-poppins)]">
                            $29
                        </span>
                        <span className="text-xs text-[#333333]/60">/mes</span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                    {[
                        'Acceso ilimitado',
                        'Rutinas por trimestre',
                        'Guías descargables',
                        'Soporte prioritario',
                    ].map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#986C4A]" strokeWidth={2.5} />
                            <span className="text-sm text-[#333333]/80 font-[family-name:var(--font-inter)]">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {error && !isSubscribed && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs mb-4">
                        {error}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={isSubscribed ? () => { } : handleSubscribe}
                    disabled={loading}
                    className={`
                        cursor-pointer
                        w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all
                        bg-[#333333] text-white hover:bg-black
                        disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                    `}
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isSubscribed ? "Iniciar plan" : "Suscribir ahora"}
                </button>
            </div>
        </div>
    )
}
