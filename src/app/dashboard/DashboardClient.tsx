'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardClientProps {
    user: User
    profile: any
    subscription: any
}

export default function DashboardClient({ user, profile, subscription }: DashboardClientProps) {
    const searchParams = useSearchParams()
    const [showSuccess, setShowSuccess] = useState(false)
    const [managingSubscription, setManagingSubscription] = useState(false)

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setShowSuccess(true)
            // Remove success param from URL
            const url = new URL(window.location.href)
            url.searchParams.delete('success')
            window.history.replaceState({}, '', url.toString())

            // Auto-hide after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000)
        }
    }, [searchParams])

    const handleManageSubscription = async () => {
        setManagingSubscription(true)
        try {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
            })
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Error:', error)
            setManagingSubscription(false)
        }
    }

    const getSubscriptionStatus = () => {
        if (!subscription) {
            return {
                text: 'Sin suscripción',
                color: 'bg-gray-100 text-gray-700',
                icon: '⚠️',
            }
        }

        switch (subscription.status) {
            case 'active':
                return {
                    text: 'Activa',
                    color: 'bg-green-100 text-green-700',
                    icon: '✓',
                }
            case 'trialing':
                return {
                    text: 'Período de prueba',
                    color: 'bg-blue-100 text-blue-700',
                    icon: '🎁',
                }
            case 'past_due':
                return {
                    text: 'Pago pendiente',
                    color: 'bg-yellow-100 text-yellow-700',
                    icon: '⏰',
                }
            case 'canceled':
                return {
                    text: 'Cancelada',
                    color: 'bg-red-100 text-red-700',
                    icon: '✕',
                }
            default:
                return {
                    text: subscription.status,
                    color: 'bg-gray-100 text-gray-700',
                    icon: '•',
                }
        }
    }

    const status = getSubscriptionStatus()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    return (
        <>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Hola, {profile?.full_name || 'Usuario'}! 👋
                        </h2>
                        <p className="text-gray-600">
                            Bienvenida a tu panel de control
                        </p>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-900">¡Suscripción Exitosa!</h4>
                                <p className="text-sm text-green-700">Ya tienes acceso completo a todo el contenido.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Perfil</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Subscription Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-3">Suscripción</h3>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                                <span>{status.icon}</span>
                                <span>{status.text}</span>
                            </div>
                            {subscription?.current_period_end && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Renovación: {new Date(subscription.current_period_end).toLocaleDateString('es-ES')}
                                </p>
                            )}
                            {subscription && subscription.status === 'active' && (
                                <button
                                    onClick={handleManageSubscription}
                                    disabled={managingSubscription}
                                    className="mt-3 text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                >
                                    {managingSubscription ? 'Cargando...' : 'Gestionar Suscripción'}
                                </button>
                            )}
                        </motion.div>

                        {/* Quick Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
                        >
                            <h3 className="font-semibold mb-2">Acceso Rápido</h3>
                            <p className="text-sm text-purple-100 mb-4">
                                Explora nuestros videos de pilates
                            </p>
                            <Link href="/videos">
                                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                                    Ver Videos
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-8"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Tu Contenido
                        </h3>

                        {!subscription || subscription.status !== 'active' ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Contenido Bloqueado
                                </h4>
                                <p className="text-gray-600 mb-6">
                                    Necesitas una suscripción activa para acceder a los videos
                                </p>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm mb-4 max-w-sm mx-auto">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        'Suscribirme Ahora'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Placeholder for video content */}
                                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                    <p className="text-gray-600">Videos próximamente</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}
