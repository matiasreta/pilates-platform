'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

interface DashboardClientProps {
    user: User
    profile: any
    subscription: any
}

interface Video {
    id: number
    title: string
    duration: string
    description?: string
}

interface Trimester {
    id: number
    name: string
    weeks: string
    progress: number
    videos: Video[]
}

export default function DashboardClient({ user, profile, subscription }: DashboardClientProps) {
    const searchParams = useSearchParams()
    const [showSuccess, setShowSuccess] = useState(false)

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

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expandedTrimester, setExpandedTrimester] = useState<number | null>(1)
    const [selectedVideo, setSelectedVideo] = useState<number>(1)

    // Datos de ejemplo para los trimestres y videos
    const trimesters: Trimester[] = [
        {
            id: 1,
            name: 'Primer trimestre',
            weeks: '1-12',
            progress: 100,
            videos: [
                { 
                    id: 1, 
                    title: 'Introducción al pilates prenatal', 
                    duration: '8 min', 
                    description: 'En esta sesión trabajaremos ejercicios específicamente diseñados para el primer trimestre de tu embarazo. Nos enfocaremos en establecer una conexión consciente con tu cuerpo y comenzar a fortalecer los músculos que te acompañarán durante toda esta etapa. Aprenderás las bases del pilates prenatal: respiración diafragmática, activación del suelo pélvico y movimientos seguros que podrás practicar durante todo tu embarazo. Recuerda escuchar a tu cuerpo en todo momento. Si algo no se siente bien, simplemente detente y descansa.'
                },
                { id: 2, title: 'Respiración y conexión', duration: '12 min' },
                { id: 3, title: 'Ejercicios de suelo pélvico', duration: '15 min' },
                { id: 4, title: 'Movilidad de columna', duration: '18 min' },
            ]
        },
        {
            id: 2,
            name: 'Segundo trimestre',
            weeks: '13-27',
            progress: 0,
            videos: [
                { id: 5, title: 'Fortalecimiento de espalda', duration: '16 min' },
                { id: 6, title: 'Ejercicios de equilibrio', duration: '14 min' },
                { id: 7, title: 'Trabajo de brazos y hombros', duration: '18 min' },
            ]
        },
        {
            id: 3,
            name: 'Tercer trimestre',
            weeks: '28-40',
            progress: 0,
            videos: [
                { id: 8, title: 'Preparación para el parto', duration: '20 min' },
                { id: 9, title: 'Ejercicios de apertura pélvica', duration: '16 min' },
                { id: 10, title: 'Respiración para el parto', duration: '14 min' },
            ]
        }
    ]

    const toggleTrimester = (trimesterId: number) => {
        setExpandedTrimester(expandedTrimester === trimesterId ? null : trimesterId)
    }

    const getSelectedVideoData = () => {
        for (const trimester of trimesters) {
            const video = trimester.videos.find(v => v.id === selectedVideo)
            if (video) return video
        }
        return trimesters[0].videos[0]
    }

    const selectedVideoData = getSelectedVideoData()

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
            {/* Success Message - Fixed position */}
            {showSuccess && (
                <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 sm:w-5 sm:h-5">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-green-900">¡Suscripción Exitosa!</h4>
                            <p className="text-xs sm:text-sm text-green-700">Ya tienes acceso completo a todo el contenido.</p>
                        </div>
                    </motion.div>
                </div>
            )}

            {!subscription || subscription.status !== 'active' ? (
                /* Locked Content View */
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Welcome Section */}
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2">
                                ¡Hola, {profile?.full_name || 'Usuario'}! 👋
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Bienvenida a tu panel de control
                            </p>
                        </div>

                        {/* Content Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                                Tu Contenido
                            </h3>

                            <div className="text-center py-8 sm:py-12">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 sm:w-8 sm:h-8">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    Contenido Bloqueado
                                </h4>
                                <p className="text-sm sm:text-base text-gray-600 mb-6">
                                    Necesitas una suscripción activa para acceder a los videos
                                </p>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm mb-4 max-w-sm mx-auto">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
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
                        </motion.div>
                    </motion.div>
                </div>
            ) : (
                /* Video Content View */
                <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-50">
                    {/* Sidebar */}
                    <div className="w-full md:w-72 lg:w-80 xl:w-96 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
                        {/* Header */}
                        <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Pilates para Embarazadas</h2>
                            <p className="text-xs sm:text-sm text-gray-600">Un acompañamiento completo durante tu embarazo</p>
                        </div>

                        {/* Lista de trimestres */}
                        <div>
                            {trimesters.map((trimester) => {
                                const isExpanded = expandedTrimester === trimester.id
                                
                                return (
                                    <div key={trimester.id} className="border-b border-gray-100">
                                        {/* Header del trimestre */}
                                        <button
                                            onClick={() => toggleTrimester(trimester.id)}
                                            className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 flex items-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-gray-500 text-xs sm:text-sm">{isExpanded ? '▼' : '▶'}</span>
                                            <div className="text-left flex-1">
                                                <h4 className="text-sm sm:text-base font-semibold text-gray-900">{trimester.name}</h4>
                                                <p className="text-xs text-gray-500">Semanas {trimester.weeks}</p>
                                            </div>
                                        </button>

                                        {/* Lista de videos */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-gray-50"
                                            >
                                                {trimester.videos.map((video, index) => {
                                                    const isSelected = selectedVideo === video.id
                                                    
                                                    return (
                                                        <button
                                                            key={video.id}
                                                            onClick={() => setSelectedVideo(video.id)}
                                                            className={`w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 flex items-start gap-3 sm:gap-4 hover:bg-gray-50 transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-gray-100' 
                                                                    : ''
                                                            }`}
                                                        >
                                                            {/* Número */}
                                                            <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                                                    {index + 1}
                                                                </div>
                                                            </div>

                                                            {/* Info del video */}
                                                            <div className="flex-1 text-left">
                                                                <h6 className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                                                    {video.title}
                                                                </h6>
                                                                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                                                    {video.duration}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Área principal */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                            {/* Video player placeholder */}
                            <div className="bg-gray-900 rounded-lg h-64 sm:h-72 lg:h-80 w-full flex items-center justify-center mb-4 sm:mb-6">
                                <div className="text-center text-white">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                        <span className="text-xl sm:text-2xl text-black">▶</span>
                                    </div>
                                    <p className="text-xs sm:text-sm">Video Player</p>
                                </div>
                            </div>

                            {/* Título del video */}
                            <h6 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{selectedVideoData.title}</h6>

                            {/* Descripción */}
                            <div className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">
                                {selectedVideoData.description ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        {selectedVideoData.description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-3 sm:mb-4 leading-relaxed">{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mb-3 sm:mb-4 leading-relaxed">En esta sesión trabajaremos ejercicios específicamente diseñados para tu embarazo. Nos enfocaremos en establecer una conexión consciente con tu cuerpo y comenzar a fortalecer los músculos que te acompañarán durante toda esta etapa.</p>
                                )}
                            </div>

                            {/* Comentarios */}
                            <div className="border-t border-gray-200 pt-4 sm:pt-6">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Comentarios</h4>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs sm:text-sm font-medium text-blue-700">MG</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm sm:text-base font-medium text-gray-900">María González</span>
                                                    <span className="text-xs text-gray-500">hace 2 días</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Excelente video para comenzar. Me ayudó mucho a entender la importancia de la respiración. ¡Gracias!</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs sm:text-sm font-medium text-purple-700">LC</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm sm:text-base font-medium text-gray-900">Laura Castro</span>
                                                    <span className="text-xs text-gray-500">hace 5 días</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Perfecto para mi semana 8. Los ejercicios son suaves pero efectivos. Me siento más conectada con mi cuerpo.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
