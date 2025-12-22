'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import SuscripcionPrenatal from '@/components/SuscripcionPrenatal'
import SuscripcionVacaciones from '@/components/SuscripcionVacaciones'
import Guias from '@/components/Guias'
import Libros from '@/components/Libros'
import { motion } from 'framer-motion'
import { Play, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
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
    { id: 1, label: '1º Trimestre', startWeek: 1, endWeek: 15 },
    { id: 2, label: '2º Trimestre', startWeek: 16, endWeek: 30 },
    { id: 3, label: '3º Trimestre', startWeek: 31, endWeek: 45 },
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-start md:justify-center overflow-x-auto">
                        <div className="flex space-x-8 min-w-max">
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
                                    activeColor="#751D68"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'planes' && (
                        <div className="flex flex-col md:flex-row justify-center gap-6 items-start">
                            <SuscripcionPrenatal
                                user={user}
                                subscription={subscription}
                                onStartPlan={() => setActiveTab('videos')}
                            />
                            <SuscripcionVacaciones />
                        </div>
                    )}
                    {activeTab === 'guias' && <Guias products={products} purchases={purchases} />}
                    {activeTab === 'libros' && <Libros />}
                    {activeTab === 'videos' && hasActiveSubscription && (
                        <div className="space-y-6">
                            {/* Banner Pilates Embarazadas */}
                            <div className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer mb-8">
                                <Image
                                    src="/pilates-pregnant-banner.jpg"
                                    alt="Pilates para embarazadas"
                                    fill
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Background Overlay for readability */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-700" />

                                <div className="text-white absolute inset-0 flex flex-col justify-center p-8 md:p-12">
                                    <p className="text-3xl md:text-5xl font-serif  mb-2 tracking-wide">
                                        Pilates para<br />embarazadas
                                    </p>
                                    <p className=" text-sm md:text-base font-medium max-w-md">
                                        Ejercicios seguros y efectivos para cada etapa
                                    </p>
                                </div>
                            </div>
                            {/* Trimesters Accordion */}
                            {/* Trimesters Accordion */}
                            <div className="space-y-4">
                                {TRIMESTERS.map((trimester) => {
                                    const isExpanded = expandedTrimester === trimester.id
                                    const weeks = Array.from(
                                        { length: trimester.endWeek - trimester.startWeek + 1 },
                                        (_, i) => trimester.startWeek + i
                                    )

                                    return (
                                        <div
                                            key={trimester.id}
                                            className={`
                                                bg-white rounded-xl border transition-all duration-300 overflow-hidden
                                                ${isExpanded
                                                    ? 'border-[#751D68]/30 shadow-md ring-1 ring-[#751D68]/10'
                                                    : 'border-[#751D68] shadow-sm hover:border-[#751D68]/30'
                                                }
                                            `}
                                        >
                                            <button
                                                onClick={() => setExpandedTrimester(isExpanded ? null : trimester.id)}
                                                className="w-full flex items-center justify-between p-5 md:p-5 text-left transition-colors hover:bg-[#FFF8FE]"
                                            >
                                                <p className="text-2xl md:text-2xl font-serif text-[#751D68] transition-colors">
                                                    {trimester.label}
                                                </p>
                                                <div className={`
                                                    p-2 rounded-full transition-all duration-300
                                                    ${isExpanded ? 'bg-[#751D68] text-white rotate-180' : 'bg-[#FAF8F6] text-[#751D68]'}
                                                `}>
                                                    {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="p-5 md:p-6 pt-0 animate-in slide-in-from-top-2">
                                                    <div className="w-full h-px bg-[#751D68]/10 mb-6" />
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                                        {weeks.map((week) => (
                                                            <button
                                                                key={week}
                                                                onClick={() => handleWeekSelect(week)}
                                                                className={`
                                                                    py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                                                                    flex flex-col items-center justify-center gap-1
                                                                    ${selectedWeek === week
                                                                        ? 'bg-[#751D68] text-white shadow-md transform scale-105'
                                                                        : 'bg-[#FAF8F6] text-[#6B6B6B] hover:bg-[#751D68]/10 hover:text-[#751D68]'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="text-xs opacity-80 uppercase tracking-wider">Semana</span>
                                                                <span className="text-lg font-bold leading-none">{week}</span>
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
                            {/* Videos List for Selected Week */}
                            {selectedWeek && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-8"
                                >
                                    {/* Heading Style like the image */}
                                    <h2 className="text-3xl md:text-4xl font-serif text-[#262422] mb-12">
                                        Pilates + Fuerza : <span className="font-light text-[#751D68]">Semana {selectedWeek}</span>
                                    </h2>

                                    {/* Minimalist 7-Column Layout */}
                                    <div className="hidden md:grid grid-cols-7 gap-4 border-t border-[#E8E4DF] pt-6">
                                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => {
                                            const dayNumber = index + 1
                                            const video = currentVideos.find((v: any) => v.dia === dayNumber)

                                            return (
                                                <div key={day} className="flex flex-col gap-4">
                                                    {/* Day Header */}
                                                    <h4 className="text-[#262422] font-bold text-sm mb-2">
                                                        {day}
                                                    </h4>

                                                    {/* Content */}
                                                    <div className="flex flex-col gap-3">
                                                        {video ? (
                                                            <button
                                                                onClick={() => setSelectedVideo(video)}
                                                                className="group text-left focus:outline-none"
                                                            >
                                                                <div className="flex items-start gap-2">

                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm text-[#6B6B6B] group-hover:text-[#751D68] leading-tight transition-colors">
                                                                            {video.title}
                                                                        </span>
                                                                        {video.duration && (
                                                                            <span className="text-[10px] text-[#DCD8D3] mt-0.5">
                                                                                ({Math.floor(video.duration / 60)}&apos;)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center justify-center pt-2">
                                                                <div className="w-4 h-px bg-[#E8E4DF]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Mobile View (Vertical List) */}
                                    <div className="md:hidden space-y-6">
                                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => {
                                            const dayNumber = index + 1
                                            const video = currentVideos.find((v: any) => v.dia === dayNumber)
                                            if (!video) return null // Optional: Hide rest days on mobile to save space? Or show them compact. keeping logical flow.

                                            return (
                                                <div key={day} className="flex gap-4 border-b border-[#E8E4DF] pb-4 last:border-0">
                                                    <div className="w-24 shrink-0">
                                                        <span className="text-sm font-bold text-[#262422]">{day}</span>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => setSelectedVideo(video)}
                                                            className="text-left w-full group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-sm text-[#6B6B6B] group-hover:text-[#751D68]">
                                                                    {video.title}
                                                                    <span className="text-xs text-[#DCD8D3] ml-2">
                                                                        ({Math.floor(video.duration / 60)}&apos;)
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </button>
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

function TabButton({ isActive, onClick, label, activeColor = '#986C4A' }: { isActive: boolean; onClick: () => void; label: string; activeColor?: string }) {
    return (
        <button
            onClick={onClick}
            className={`
                py-4 px-2 text-sm font-medium border-b-2 transition-colors relative
                ${isActive
                    ? 'text-current'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
            `}
            style={isActive ? { borderColor: activeColor, color: activeColor } : {}}
        >
            {label}
        </button>
    )
}
