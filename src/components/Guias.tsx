'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface GuiasProps {
    products?: any[]
    purchases?: any[]
}

export default function Guias({ products = [], purchases = [] }: GuiasProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [playingVideo, setPlayingVideo] = useState<any | null>(null)

    const handleBuy = async (priceId: string) => {
        try {
            setIsLoading(priceId)
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId, // Sending the specific price ID
                }),
            })

            const data = await response.json()

            if (data.url) {
                window.location.href = data.url
            } else if (data.error) {
                alert(data.error)
                setIsLoading(null)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Ocurrió un error al procesar la solicitud')
            setIsLoading(null)
        }
    }

    const getEmbedUrl = (url: string) => {
        if (!url) return ''
        // Basic YouTube embed conversion (assuming standard youtube.com/watch?v= format)
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/')
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/')
        }
        return url
    }

    console.log('Guias products:', products)

    // Filter products. Default to showing everything if no type is set, or if it matches video/guia
    const guiasProducts = products.filter(p => !p.type || p.type === 'video' || p.type === 'guia')

    if (guiasProducts.length === 0) {
        return (
            <div className="bg-white border text-center border-gray-200 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Guías Disponibles</h3>
                <p className="text-gray-500">No hay guías disponibles en este momento ({products.length} productos totales).</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guiasProducts.map((product) => {
                    const isPurchased = purchases.some(p => p.stripe_price_id === product.stripe_price_id)

                    return (
                        <div key={product.id} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-xl overflow-hidden shadow-sm group">
                            <div className="aspect-video bg-gray-100 relative">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                )}
                                {isPurchased && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Adquirido
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                                {isPurchased ? (
                                    <button
                                        onClick={() => setPlayingVideo(product)}
                                        className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all bg-[#333333] text-white hover:bg-black flex items-center justify-center gap-2"
                                    >
                                        Ver Contenido
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBuy(product.stripe_price_id)}
                                        disabled={isLoading === product.stripe_price_id}
                                        className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all bg-[#333333] text-white hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isLoading === product.stripe_price_id ? (
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            'Comprar'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {playingVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setPlayingVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="font-bold text-lg">{playingVideo.title}</h3>
                                <button
                                    onClick={() => setPlayingVideo(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="aspect-video bg-black">
                                <iframe
                                    src={getEmbedUrl(playingVideo.cloudflare_video_id)}
                                    className="w-full h-full"
                                    title={playingVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
