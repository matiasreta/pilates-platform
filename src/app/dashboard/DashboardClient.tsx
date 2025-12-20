'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import SuscripcionPrenatal from '@/components/SuscripcionPrenatal'
import SuscripcionVacaciones from '@/components/SuscripcionVacaciones'
import Guias from '@/components/Guias'
import Libros from '@/components/Libros'
import { motion } from 'framer-motion'
import { Play, Plus, Minus } from 'lucide-react'
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

const TRIMESTERS = [
    { id: 1, label: '1er Trimestre', startWeek: 1, endWeek: 15 },
    { id: 2, label: '2º Trimestre', startWeek: 16, endWeek: 30 },
    { id: 3, label: '3er Trimestre', startWeek: 31, endWeek: 45 },
]

export default function DashboardClient({ user, profile, subscription, products, purchases, videos = [] }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('planes')
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

    // Video navigation state
    const [expandedTrimester, setExpandedTrimester] = useState<number | null>(1)
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

    const hasActiveSubscription = subscription?.status === 'active'

    const handleWeekSelect = (week: number) => {
        setSelectedWeek(week === selectedWeek ? null : week)
    }

    // Combine real videos with dummy data for 2nd and 3rd trimesters
    const currentVideos = selectedWeek
        ? selectedWeek <= 15
            // 1st Trimester: Use real data
            ? videos.filter((v: any) => v.semana === selectedWeek).sort((a: any, b: any) => a.dia - b.dia)
            : // 2nd & 3rd Trimester: Generate dummy data
            Array.from({ length: 7 }, (_, i) => ({
                id: `dummy-${selectedWeek}-${i + 1}`,
                title: `Día ${i + 1} - Semana ${selectedWeek}`,
                description: 'Clase de Pilates prenatal enfocada en movilidad y fortalecimiento suave.',
                thumbnail_url: null, // UI handles null thumbnails
                duration: 1200 + i * 60, // ~20-25 mins
                is_published: true,
                dia: i + 1,
                semana: selectedWeek,
                category: 'Pilates para embarazadas',
                cloudflare_video_id: 'dummy-id' // Won't actually play but allows UI testing
            }))
        : []

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
                        <div className="space-y-6">
                            {/* Trimesters Accordion */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {TRIMESTERS.map((trimester) => {
                                    const isExpanded = expandedTrimester === trimester.id
                                    const weeks = Array.from(
                                        { length: trimester.endWeek - trimester.startWeek + 1 },
                                        (_, i) => trimester.startWeek + i
                                    )

                                    return (
                                        <div key={trimester.id} className="border-b last:border-0 border-gray-100">
                                            <button
                                                onClick={() => setExpandedTrimester(isExpanded ? null : trimester.id)}
                                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <h3 className="text-xl font-serif text-[#986C4A]">
                                                    {trimester.label}
                                                </h3>
                                                {isExpanded ? (
                                                    <Minus className="w-6 h-6 text-[#986C4A]" />
                                                ) : (
                                                    <Plus className="w-6 h-6 text-[#986C4A]" />
                                                )}
                                            </button>

                                            {isExpanded && (
                                                <div className="p-6 pt-0 animate-in slide-in-from-top-2">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {weeks.map((week) => (
                                                            <button
                                                                key={week}
                                                                onClick={() => handleWeekSelect(week)}
                                                                className={`
                                                                    p-4 rounded-lg border text-sm font-medium transition-all
                                                                    flex items-center gap-3
                                                                    ${selectedWeek === week
                                                                        ? 'border-[#986C4A] bg-[#986C4A]/5 text-[#986C4A]'
                                                                        : 'border-gray-200 text-gray-600 hover:border-[#986C4A]/50'
                                                                    }
                                                                `}
                                                            >
                                                                <div className={`
                                                                    w-4 h-4 rounded border flex items-center justify-center
                                                                    ${selectedWeek === week ? 'border-[#986C4A] bg-[#986C4A]' : 'border-gray-300'}
                                                                `}>
                                                                    {selectedWeek === week && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                                </div>
                                                                SEMANA {week}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Videos List for Selected Week */}
                            {selectedWeek && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
                                >
                                    <h2 className="text-3xl font-serif text-[#1e293b] mb-8 pb-4 border-b border-gray-200">
                                        Pilates + Fuerza : Semana {selectedWeek}
                                    </h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => {
                                            const dayNumber = index + 1
                                            const video = currentVideos.find((v: any) => v.dia === dayNumber)

                                            return (
                                                <div key={day} className="space-y-4">
                                                    <h3 className="text-[#334155] font-bold text-center text-sm uppercase tracking-wide">
                                                        {day}
                                                    </h3>

                                                    <div className="pt-2">
                                                        {video ? (
                                                            <div
                                                                onClick={() => setSelectedVideo(video)}
                                                                className="group cursor-pointer flex items-start gap-2 text-sm text-gray-600 hover:text-[#986C4A] transition-colors"
                                                            >
                                                                <div className="mt-1 w-4 h-4 rounded border border-gray-300 group-hover:border-[#986C4A] flex-shrink-0" />
                                                                <span className="leading-snug">
                                                                    <span className="font-medium">{video.title}</span>
                                                                    {video.duration && (
                                                                        <span className="text-gray-400 ml-1">
                                                                            ({Math.floor(video.duration / 60)}&apos;)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-gray-300 text-sm italic">
                                                                Descanso
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {!selectedWeek && expandedTrimester && (
                                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    Selecciona una semana para ver los videos disponibles
                                </div>
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
