'use client'

import { Check } from 'lucide-react'

export default function SuscripcionVacaciones() {
    return (
        <div className="bg-white border text-left border-gray-200 hover:border-gray-300 transition-colors p-6 rounded-xl w-full max-w-sm flex flex-col h-full shadow-sm relative overflow-hidden group">
            {/* Header */}
            <div className="mb-6">
                <p className="text-3xl md:text-4xl font-serif text-[#333333] mb-1">
                    Pilates en vacaciones
                </p>
                <p className="text-xs text-[#333333]/60 mb-4 font-[family-name:var(--font-inter)]">
                    Mantente activa donde estés
                </p>

                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#986C4A] font-[family-name:var(--font-poppins)]">
                        $29
                    </span>
                    <span className="text-xs text-[#333333]/60">/mes</span>
                </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
                {[
                    'Videos cortos y efectivos',
                    'Sin material necesario',
                    'Acceso offline',
                    'Rutinas express',
                ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#986C4A]" strokeWidth={2.5} />
                        <span className="text-sm text-[#333333]/80 font-[family-name:var(--font-inter)]">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Action Button */}
            <button
                disabled
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 flex items-center justify-center gap-2"
            >
                Próximamente
            </button>
        </div>
    )
}
