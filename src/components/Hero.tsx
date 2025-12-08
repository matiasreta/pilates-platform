'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">


            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-2xl"
                >
                    <h1 className="mb-2 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl font-[family-name:var(--font-poppins)]">
                        Soy Luciana,
                        instructora de pilates y acompañante
                        de movimiento consciente.
                    </h1>
                    <p className="mb-12 text-lg sm:text-xl font-[family-name:var(--font-inter)]">
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
