'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import SuscripcionPrenatal from '@/components/SuscripcionPrenatal'
import SuscripcionVacaciones from '@/components/SuscripcionVacaciones'
import Guias from '@/components/Guias'
import Libros from '@/components/Libros'
import { motion } from 'framer-motion'

interface DashboardClientProps {
    user: User
    profile: any
    subscription: any
}

type TabType = 'planes' | 'guias' | 'libros'

export default function DashboardClient({ user, profile, subscription }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('planes')

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
                    {activeTab === 'guias' && <Guias />}
                    {activeTab === 'libros' && <Libros />}
                </motion.div>
            </div>
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
