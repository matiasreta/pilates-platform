'use client'

import { useState, useEffect } from 'react'
import { Play, Lock } from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'

interface Video {
    id: string
    title: string
    description: string
    thumbnail_url: string
    duration: number
    category: string
    cloudflare_video_id: string
}

interface VideosPageClientProps {
    hasActiveSubscription: boolean
    userEmail: string
}

export default function VideosPageClient({ hasActiveSubscription, userEmail }: VideosPageClientProps) {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        if (hasActiveSubscription) {
            fetchVideos()
        } else {
            setLoading(false)
        }
    }, [hasActiveSubscription])

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/videos')
            const data = await response.json()

            if (response.ok) {
                setVideos(data.videos || [])
            }
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    const categories = ['all', ...new Set(videos.map(v => v.category).filter(Boolean))]
    const filteredVideos = filter === 'all'
        ? videos
        : videos.filter(v => v.category === filter)

    if (!hasActiveSubscription) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Contenido Exclusivo
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Necesitas una suscripción activa para acceder a los videos
                    </p>
                    <Link href="/pricing">
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all w-full">
                            Ver Planes
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Pilates Platform
                        </Link>
                        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                            Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Biblioteca de Videos
                </h1>
                <p className="text-gray-600 mb-8">
                    Explora todos los videos disponibles
                </p>

                {/* Filters */}
                {categories.length > 1 && (
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === cat
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {cat === 'all' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Videos Grid */}
                {filteredVideos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No hay videos disponibles</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map(video => (
                            <div
                                key={video.id}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                                onClick={() => setSelectedVideo(video)}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
                                    {video.thumbnail_url ? (
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Play className="w-16 h-16 text-purple-600/50" />
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                                            <Play className="w-8 h-8 text-purple-600 ml-1" />
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    {video.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    {video.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {video.description}
                                        </p>
                                    )}
                                    {video.category && (
                                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                            {video.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayer
                    videoId={selectedVideo.cloudflare_video_id}
                    title={selectedVideo.title}
                    watermark={userEmail}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    )
}
