'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Baby, Sparkles, Shield } from 'lucide-react';

const benefits = [
    {
        icon: Heart,
        title: 'Fortalece tu Core',
        description: 'Mejora la postura y reduce el dolor de espalda durante el embarazo.',
    },
    {
        icon: Baby,
        title: 'Preparación para el Parto',
        description: 'Ejercicios específicos que te ayudan a prepararte física y mentalmente.',
    },
    {
        icon: Sparkles,
        title: 'Aumenta tu Energía',
        description: 'Combate la fatiga y mejora tu bienestar general.',
    },
    {
        icon: Shield,
        title: 'Seguro y Adaptado',
        description: 'Rutinas diseñadas específicamente para cada etapa del embarazo.',
    },
];

export default function Benefits() {
    return (
        <section className="relative bg-[#FFFBF8] py-12 lg:py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] max-h-[380px] mx-auto overflow-hidden rounded-lg border border-[#DCD8D3]">
                            <Image
                                src="/pilates-intro.jpg"
                                alt="Pilates para embarazadas"
                                fill
                                className="object-cover"
                            />
                        </div>

                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <h3 className="mb-3 text-2xl font-bold leading-tight text-[#333333] lg:text-3xl font-[family-name:var(--font-poppins)]">
                            Beneficios para cada etapa de tu embarazo
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-[#333333]/80 font-[family-name:var(--font-inter)]">
                            El Pilates es una forma segura y efectiva de mantenerte activa durante el embarazo.
                            Nuestros programas están diseñados específicamente para apoyarte en cada trimestre.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="flex gap-3"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#986C4A]/10">
                                        <benefit.icon className="h-5 w-5 text-[#986C4A]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="mb-0.5 text-sm font-semibold text-[#333333] font-[family-name:var(--font-poppins)]">{benefit.title}</h4>
                                        <p className="text-xs text-[#333333]/70 font-[family-name:var(--font-inter)]">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link href="/#pricing">
                            <motion.button
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary mt-6"
                            >
                                Explorar Programas
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
