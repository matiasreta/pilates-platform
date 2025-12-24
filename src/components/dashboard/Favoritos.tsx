'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import VideoPlayer from '@/components/VideoPlayer'

interface FavoritosProps {
    userId: string
}

export default function Favoritos({ userId }: FavoritosProps) {
    const [favoriteVideos, setFavoriteVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchFavorites = async () => {
            const supabase = createClient()
            try {
                const { data, error } = await supabase
                    .from('user_favorite_videos')
                    .select(`
                        video_id,
                        videos (
                            id,
                            title,
                            description,
                            cloudflare_video_id,
                            duration
                        )
                    `)
                    .eq('user_id', userId)

                if (error) {
                    console.error('Error fetching favorites:', error)
                    return
                }

                // Transform the data to extract video information
                const videos = (data || [])
                    .map((fav: any) => fav.videos)
                    .filter((video: any) => video !== null)

                setFavoriteVideos(videos)
            } catch (err) {
                console.error('Error fetching favorites:', err)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchFavorites()
        }
    }, [userId])

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-[#E8E4DF] p-6">
                <div className="text-center py-12 text-gray-400">
                    <p>Cargando favoritos...</p>
                </div>
            </div>
        )
    }

    if (favoriteVideos.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-[#E8E4DF] p-6">
                <div className="text-center py-12 text-gray-400">
                    <p className="text-lg font-medium text-gray-500 mb-2">
                        No tienes videos favoritos
                    </p>
                    <p className="text-sm text-gray-400">
                        Marca videos como favoritos para verlos aquí
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-[#E8E4DF] p-6">
                <h2 className="text-3xl md:text-4xl font-serif text-[#262422] mb-6">
                    Favoritos
                </h2>

                <div className="flex flex-wrap gap-4">
                    {favoriteVideos.map((video) => (
                        <button
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="w-[280px] text-left group focus:outline-none shrink-0"
                        >
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-[#FAF8F6] border border-[#E8E4DF] hover:border-[#751D68]/30 hover:bg-[#FFF8FE] transition-all duration-200 h-full">
                                <Star className="w-5 h-5 text-[#751D68] fill-[#751D68] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm text-[#6B6B6B] group-hover:text-[#751D68] transition-colors block truncate">
                                        {video.title}
                                    </span>
                                    {video.duration && (
                                        <span className="text-[10px] text-[#DCD8D3] mt-0.5 block">
                                            ({Math.floor(video.duration / 60)}&apos;)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Video Player Modal - Rendered via Portal */}
            {mounted && selectedVideo && createPortal(
                <VideoPlayer
                    title={selectedVideo.title}
                    videoId={selectedVideo.cloudflare_video_id}
                    videoDbId={selectedVideo.id}
                    description={selectedVideo.description}
                    onClose={() => setSelectedVideo(null)}
                />,
                document.body
            )}
        </>
    )
}

