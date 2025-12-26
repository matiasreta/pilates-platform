'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-bg-latest.png"
                    alt="instructora de pilates con pelota"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-white/23" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center items-center sm:items-start px-6 sm:px-12 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-xs text-center sm:text-left"
                >
                    <h1 className="mb-2 text-5xl leading-tight text-white sm:text-5xl md:text-7xl ">
                        Soy Myssis
                        <br />
                        tu instructora
                        <br />
                        de pilates
                    </h1>
                    <p className="mb-6 text-lg sm:text-xl font-[family-name:var(--font-inter)]">
                        Me encanta ayudar a las mujeres a encontrar su equilibrio
                        y conexión con su cuerpo a través de la práctica de pilates.
                    </p>

                    <Link href="/#pricing">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                        >
                            Ver plan para embarazadas
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}