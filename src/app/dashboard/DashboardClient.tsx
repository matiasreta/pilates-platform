'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import SuscripcionPrenatal from '@/components/SuscripcionPrenatal'
import SuscripcionVacaciones from '@/components/SuscripcionVacaciones'
import Guias from '@/components/Guias'
import Libros from '@/components/Libros'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'

interface DashboardClientProps {
    user: User
    profile: any
    subscription: any
    products: any[]
    purchases: any[]
    videos?: any[]
}

type TabType = 'planes' | 'guias' | 'libros' | 'videos'

export default function DashboardClient({ user, profile, subscription, products, purchases, videos = [] }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('planes')
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

    const hasActiveSubscription = subscription?.status === 'active'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sub-navbar / Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center">
                        <div className="flex space-x-8">
                            <TabButton
                                isActive={activeTab === 'planes'}
                                onClick={() => setActiveTab('planes')}
                                label="Planes"
                            />
                            <TabButton
                                isActive={activeTab === 'guias'}
                                onClick={() => setActiveTab('guias')}
                                label="Guías"
                            />
                            <TabButton
                                isActive={activeTab === 'libros'}
                                onClick={() => setActiveTab('libros')}
                                label="Libros"
                            />
                            {hasActiveSubscription && (
                                <TabButton
                                    isActive={activeTab === 'videos'}
                                    onClick={() => setActiveTab('videos')}
                                    label="Videos"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto p-4">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'planes' && (
                        <div className="flex flex-col md:flex-row justify-center gap-6 items-start">
                            <SuscripcionPrenatal user={user} subscription={subscription} />
                            <SuscripcionVacaciones />
                        </div>
                    )}
                    {activeTab === 'guias' && <Guias products={products} purchases={purchases} />}
                    {activeTab === 'libros' && <Libros />}
                    {activeTab === 'videos' && hasActiveSubscription && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {videos.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No hay videos disponibles por el momento exceptuando los de prueba.
                                </div>
                            ) : (
                                videos.map((video: any) => (
                                    <div
                                        key={video.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="relative aspect-video bg-gray-100">
                                            {video.thumbnail_url ? (
                                                <img
                                                    src={video.thumbnail_url}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <Play className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-lg">
                                                    <Play className="w-6 h-6 text-[#986C4A] ml-1" />
                                                </div>
                                            </div>
                                            {video.duration && (
                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    {video.duration}s
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                                            <p className="text-sm text-[#986C4A]">{video.category}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayer
                    title={selectedVideo.title}
                    videoId={selectedVideo.cloudflare_video_id}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    )
}

function TabButton({ isActive, onClick, label }: { isActive: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`
                py-4 px-2 text-sm font-medium border-b-2 transition-colors relative
                ${isActive
                    ? 'border-[#986C4A] text-[#986C4A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
            `}
        >
            {label}
        </button>
    )
}
