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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-[60]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                )}

                {/* Title */}
                <div className="mb-4 text-white">
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>

                {/* Video Player Container */}
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center aspect-video border border-gray-800">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-white text-lg font-medium mb-2">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
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
