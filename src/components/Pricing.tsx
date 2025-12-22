'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
    'Acceso ilimitado a más de 200 videos organizados por trimestre',
    'Rutinas semanales adaptadas a cada etapa del embarazo',
    'Videos nuevos cada semana con ejercicios específicos',
    'Guías descargables de ejercicios y recomendaciones',
    'Acceso desde cualquier dispositivo, en cualquier momento',
    'Sesiones de 15 a 45 minutos para adaptarse a tu agenda',
];

export default function Pricing() {
    return (
        <section id="pricing" className="relative bg-[#FFF8FE] py-12 lg:py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-center">
                    {/* Pricing Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative rounded-lg bg-white border-2 border-[#751D68] p-8"
                    >
                        {/* Plan Header */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl mb-2 text-[#333333] font-[family-name:var(--font-poppins)]">
                                Plan Prenatal
                            </h3>

                            {/* Price */}
                            <div className="mb-2">
                                <span className="text-5xl font-bold text-[#751D68] font-[family-name:var(--font-poppins)]">
                                    $29
                                </span>
                            </div>

                            <p className="text-sm text-[#333333]/70 font-[family-name:var(--font-inter)]">
                                por mes • Cancela cuando quieras
                            </p>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-3 mb-6">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <Check
                                        className="w-5 h-5 shrink-0 mt-0.5 text-[#751D68]"
                                        strokeWidth={2.5}
                                    />
                                    <span className="text-sm text-[#333333]/80 font-[family-name:var(--font-inter)]">
                                        {feature}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link href="/login">
                            <motion.button
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-accent w-full flex items-center justify-center gap-2"
                            >
                                Comenzar Ahora
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] max-h-[380px] mx-auto overflow-hidden rounded-lg border border-[#DCD8D3]">
                            <Image
                                src="/pregnant-pilates-laptop.jpg"
                                alt="Mujer embarazada practicando pilates siguiendo video en laptop"
                                fill
                                className="object-cover"
                            />
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
