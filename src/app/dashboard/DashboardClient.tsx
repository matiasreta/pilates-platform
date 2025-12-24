'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import SuscripcionPrenatal from '@/components/SuscripcionPrenatal'
import SuscripcionVacaciones from '@/components/SuscripcionVacaciones'
import Guias from '@/components/Guias'
import Libros from '@/components/Libros'
import Videos from '@/components/dashboard/Videos'
import { motion } from 'framer-motion'

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
                            <TabButton
                                isActive={activeTab === 'videos'}
                                onClick={() => setActiveTab('videos')}
                                label="Videos"
                                activeColor="#751D68"
                            />
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
                    {activeTab === 'videos' && <Videos subscription={subscription} videos={videos} />}
                </motion.div>
            </div>
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
