'use client'

import { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'

interface VacationVideosProps {
    videos: any[]
}

export default function VacationVideos({ videos = [] }: VacationVideosProps) {
    const [playingVideo, setPlayingVideo] = useState<any | null>(null)

    return (
        <div className="space-y-8">
            {/* Banner Section */}
            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm">
                {/* Fallback pattern or image if available. For now using a nice gradient/pattern matching the requested style */}
                <div className="absolute inset-0 bg-[#986C4A] flex items-center justify-center">
                    <div className="text-center text-white p-6">
                        <h2 className="text-3xl md:text-5xl font-serif mb-2">Pilates en Vacaciones</h2>
                        <p className="text-white/80 font-light tracking-wide">Mantente activa donde estés</p>
                    </div>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
                        onClick={() => setPlayingVideo(video)}
                    >
                        <div className="aspect-video bg-gray-100 relative">
                            {video.thumbnail_url ? (
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                    <span className="text-3xl">🏖️</span>
                                </div>
                            )}
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg">
                                    <svg className="w-5 h-5 text-[#986C4A] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="font-bold text-gray-900 group-hover:text-[#986C4A] transition-colors">
                                {video.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {video.description || 'Sin descripción disponible'}
                            </p>
                        </div>
                    </div>
                ))}

                {videos.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No hay videos cargados para esta sección todavía.
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
                <VideoPlayer
                    title={playingVideo.title}
                    videoId={playingVideo.cloudflare_video_id}
                    videoDbId={playingVideo.id}
                    description={playingVideo.description}
                    onClose={() => setPlayingVideo(null)}
                />
            )}
        </div>
    )
}
