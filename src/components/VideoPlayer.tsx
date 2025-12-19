'use client'

// import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface VideoPlayerProps {
    title: string
    onClose?: () => void
}

export default function VideoPlayer({ title, onClose }: VideoPlayerProps) {
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
                </div>

                {/* Video Player Placeholder */}
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center aspect-video border border-gray-800">
                    <div className="text-center p-8">
                        <p className="text-gray-400 mb-2">Video player not available</p>
                        <p className="text-sm text-gray-600">Cloudflare integration has been removed.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
