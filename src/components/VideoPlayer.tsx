'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Stream } from '@cloudflare/stream-react'

interface VideoPlayerProps {
    title: string
    videoId: string
    onClose?: () => void
}

export default function VideoPlayer({ title, videoId, onClose }: VideoPlayerProps) {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

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

    return (
        <div className="fixed inset-0 bg-[#262422]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl group bg-white rounded-xl shadow-2xl overflow-hidden p-6">
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
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-inner">
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
    )
}
