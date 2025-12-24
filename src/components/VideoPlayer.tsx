'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle, Star } from 'lucide-react'
import { Stream } from '@cloudflare/stream-react'
import { createClient } from '@/lib/supabase/client'

interface VideoPlayerProps {
    title: string
    videoId: string
    videoDbId?: string // UUID del video en la tabla videos
    description?: string // Descripción del video
    onClose?: () => void
}

export default function VideoPlayer({ title, videoId, videoDbId, description, onClose }: VideoPlayerProps) {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)

    // Verificar si el video está en favoritos
    useEffect(() => {
        const checkFavorite = async () => {
            if (!videoDbId) return

            const supabase = createClient()
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('user_favorite_videos')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('video_id', videoDbId)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                    console.error('Error checking favorite:', error)
                    return
                }

                setIsFavorite(!!data)
            } catch (err) {
                console.error('Error checking favorite:', err)
            }
        }

        checkFavorite()
    }, [videoDbId])

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch('/api/video/get-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ videoId }),
                })

                if (!response.ok) {
                    throw new Error('Error obteniendo el token de video')
                }

                const data = await response.json()
                setToken(data.token)
            } catch (err) {
                console.error('Error:', err)
                setError('No se pudo cargar el video. Por favor intenta nuevamente.')
            } finally {
                setLoading(false)
            }
        }

        if (videoId) {
            fetchToken()
        }
    }, [videoId])

    const handleToggleFavorite = async () => {
        if (!videoDbId) {
            console.warn('No videoDbId provided, cannot save favorite')
            return
        }

        setFavoriteLoading(true)
        const supabase = createClient()
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                console.warn('User not authenticated')
                setFavoriteLoading(false)
                return
            }

            if (isFavorite) {
                // Remover de favoritos
                const { error } = await supabase
                    .from('user_favorite_videos')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('video_id', videoDbId)

                if (error) {
                    console.error('Error removing favorite:', error)
                } else {
                    setIsFavorite(false)
                }
            } else {
                // Agregar a favoritos
                const { error } = await supabase
                    .from('user_favorite_videos')
                    .insert({
                        user_id: user.id,
                        video_id: videoDbId,
                    })

                if (error) {
                    console.error('Error adding favorite:', error)
                } else {
                    setIsFavorite(true)
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err)
        } finally {
            setFavoriteLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-[#262422]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-6xl group bg-white rounded-xl shadow-2xl overflow-hidden flex h-[90vh]">
                {/* Sidebar izquierdo */}
                <div className="w-64 bg-[#FAF8F6] border-r border-[#E5E5E5] flex flex-col h-full">
                    {/* Botón de favoritos */}
                    <div className="p-4 border-b border-[#E5E5E5]">
                        <button
                            onClick={handleToggleFavorite}
                            disabled={!videoDbId || favoriteLoading}
                            className="w-full flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg transition-all duration-300 hover:border-[#A67C52] group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Star 
                                className={`w-5 h-5 transition-colors duration-300 ${
                                    isFavorite 
                                        ? 'fill-[#A67C52] text-[#A67C52]' 
                                        : 'text-[#6B6B6B] group-hover:text-[#A67C52]'
                                }`}
                            />
                            <span className="text-[#262422] font-medium">
                                {favoriteLoading ? 'Guardando...' : 'Favorito'}
                            </span>
                        </button>
                    </div>

                    {/* Descripción del video */}
                    {description && (
                        <div className="flex-1 p-4 overflow-y-auto">
                            <p className="text-[#6B6B6B] text-sm leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Contenido principal */}
                <div className="flex-1 flex flex-col overflow-hidden p-6">
                    {/* Header Container */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#262422] tracking-tight">{title}</h2>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 text-[#6B6B6B] hover:text-[#A67C52] hover:bg-[#FAF8F6] rounded-full transition-all duration-300"
                                aria-label="Cerrar reproductor"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Video Player Container */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-inner flex-1 min-h-0">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F6]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A67C52]"></div>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-[#FAF8F6]">
                                <AlertCircle className="w-12 h-12 text-[#8B5A5A] mb-4" />
                                <p className="text-[#262422] text-lg font-medium mb-2">{error}</p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 px-6 py-2 bg-[#262422] hover:bg-[#A67C52] text-white rounded-lg transition-colors duration-300 font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}

                        {!loading && !error && token && (
                            <div className="w-full h-full">
                                <Stream
                                    controls
                                    responsive
                                    src={token}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
