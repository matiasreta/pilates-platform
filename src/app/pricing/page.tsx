'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubscribe = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la sesión de pago')
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const features = [
        'Acceso ilimitado a todos los videos',
        'Rutinas específicas para cada trimestre',
        'Ejercicios de preparación al parto',
        'Técnicas de respiración y relajación',
        'Fortalecimiento del suelo pélvico',
        'Nuevos videos cada semana',
        'Acceso desde cualquier dispositivo',
        'Cancela cuando quieras',
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Pilates Platform
                        </Link>
                        <Link href="/login" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Pilates para Embarazadas
                    </h1>
                    <p className="text-xl text-gray-600">
                        Cuida de ti y tu bebé con ejercicios diseñados específicamente para cada etapa del embarazo
                    </p>
                </motion.div>

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                >
                    {/* Price Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-center text-white">
                        <div className="mb-4">
                            <span className="text-5xl font-bold">$29</span>
                            <span className="text-2xl font-medium">/mes</span>
                        </div>
                        <p className="text-purple-100">Acceso completo a toda la plataforma</p>
                    </div>

                    {/* Features */}
                    <div className="px-8 py-10">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Todo lo que necesitas:
                        </h3>
                        <ul className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* CTA Button */}
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Suscribirme Ahora'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            Cancela cuando quieras. Sin compromisos.
                        </p>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Preguntas Frecuentes
                    </h2>
                    <div className="space-y-4 text-left max-w-2xl mx-auto">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                ¿Puedo cancelar en cualquier momento?
                            </h3>
                            <p className="text-gray-600">
                                Sí, puedes cancelar tu suscripción cuando quieras desde tu panel de control. No hay penalizaciones ni compromisos.
                            </p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                ¿Los ejercicios son seguros durante el embarazo?
                            </h3>
                            <p className="text-gray-600">
                                Todos los ejercicios están diseñados específicamente para embarazadas y adaptados a cada trimestre. Siempre consulta con tu médico antes de comenzar.
                            </p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                ¿Qué métodos de pago aceptan?
                            </h3>
                            <p className="text-gray-600">
                                Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe, nuestra plataforma de pago segura.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-purple-600 transition-colors inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Volver al inicio
                    </Link>
                </div>
            </main>
        </div>
    )
}
