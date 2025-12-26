'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Play } from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'

interface VacationVideosProps {
    videos: any[]
}

export default function VacationVideos({ videos = [] }: VacationVideosProps) {
    const [playingVideo, setPlayingVideo] = useState<any | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="space-y-8">
            {/* Banner Section */}
            <div className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer mb-8">
                <Image
                    src="/vacation-banner.png"
                    alt="Pilates en Vacaciones"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Background Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-700" />

                <div className="text-white absolute inset-0 flex flex-col justify-center p-8 md:p-12">
                    <p className="text-3xl md:text-5xl font-serif  mb-2 tracking-wide">
                        Pilates en<br />Vacaciones
                    </p>
                    <p className="text-sm md:text-base font-medium max-w-md text-white/90">
                        Mantente activa donde estés
                    </p>
                </div>
            </div>

            {/* Videos List */}
            <div className="bg-white rounded-xl border border-[#E8E4DF] p-6">
                <div className="flex flex-wrap gap-4">
                    {videos.map((video) => (
                        <button
                            key={video.id}
                            onClick={() => setPlayingVideo(video)}
                            className="w-[280px] text-left group focus:outline-none shrink-0"
                        >
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-[#FAF8F6] border border-[#E8E4DF] hover:border-[#986C4A]/30 hover:bg-[#FFF8FE] transition-all duration-200 h-full">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#E8E4DF] group-hover:border-[#986C4A]/30 transition-colors">
                                    <Play className="w-4 h-4 text-[#986C4A] fill-[#986C4A] ml-0.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm text-[#6B6B6B] group-hover:text-[#986C4A] transition-colors block truncate font-medium">
                                        {video.title}
                                    </span>
                                    {video.duration ? (
                                        <span className="text-[10px] text-[#DCD8D3] mt-0.5 block">
                                            ({Math.floor(video.duration / 60)}&apos;)
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-[#DCD8D3] mt-0.5 block">
                                            Video
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}

                    {videos.length === 0 && (
                        <div className="w-full text-center py-12 text-gray-400">
                            No hay videos cargados para esta sección todavía.
                        </div>
                    )}
                </div>
            </div>

            {/* Video Player Modal - Rendered via Portal */}
            {mounted && playingVideo && createPortal(
                <VideoPlayer
                    title={playingVideo.title}
                    videoId={playingVideo.cloudflare_video_id}
                    videoDbId={playingVideo.id}
                    description={playingVideo.description}
                    onClose={() => setPlayingVideo(null)}
                />,
                document.body
            )}
        </div>
    )
}
