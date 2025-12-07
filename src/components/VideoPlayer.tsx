'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface VideoPlayerProps {
    videoId: string
    title: string
    watermark?: string
    onClose?: () => void
}

export default function VideoPlayer({ videoId, title, watermark, onClose }: VideoPlayerProps) {
    const playerRef = useRef<HTMLIFrameElement>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Cloudflare Stream Player will load automatically via iframe
        const timer = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [videoId])

    // Get Cloudflare Stream embed URL
    const embedUrl = `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/iframe?preload=true&autoplay=false`

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                )}

                {/* Title */}
                <div className="mb-4 text-white">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {watermark && (
                        <p className="text-sm text-gray-400 mt-1">
                            Viendo como: {watermark}
                        </p>
                    )}
                </div>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}

                    <iframe
                        ref={playerRef}
                        src={embedUrl}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        onLoad={() => setLoading(false)}
                    />
                </div>

                {/* Watermark Overlay */}
                {watermark && (
                    <div className="absolute bottom-8 right-8 text-white/30 text-xs font-mono pointer-events-none select-none">
                        {watermark}
                    </div>
                )}
            </div>
        </div>
    )
}
