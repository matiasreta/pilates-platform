'use client'

import { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'

interface GuideVideosProps {
    title: string
    videos: any[]
}

export default function GuideVideos({ title, videos = [] }: GuideVideosProps) {
    const [playingVideo, setPlayingVideo] = useState<any | null>(null)

    if (videos.length === 0) return null

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl text-gray-900 mb-6">{title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="group cursor-pointer"
                        onClick={() => setPlayingVideo(video)}
                    >
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative mb-3">
                            {video.thumbnail_url ? (
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                    <span className="text-2xl">▶️</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg">
                                    <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-[#986C4A] transition-colors">
                            {video.title}
                        </h4>
                        {video.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {video.description}
                            </p>
                        )}
                    </div>
                ))}
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
