'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        question: '¿Es seguro hacer pilates durante el embarazo?',
        answer: 'Sí, el pilates es una de las actividades más seguras y recomendadas durante el embarazo. Nuestras rutinas están específicamente diseñadas y adaptadas para cada trimestre, enfocándose en fortalecer el core, mejorar la postura y preparar el cuerpo para el parto. Siempre recomendamos consultar con tu médico antes de comenzar cualquier programa de ejercicio.',
    },
    {
        question: '¿Puedo empezar si nunca he hecho pilates antes?',
        answer: 'Absolutamente. Nuestros videos están diseñados tanto para principiantes como para practicantes experimentadas. Cada rutina incluye modificaciones y explicaciones detalladas para que puedas seguirlas sin importar tu nivel de experiencia. Comenzarás con ejercicios básicos y progresarás a tu propio ritmo.',
    },
    {
        question: '¿Qué necesito para empezar?',
        answer: 'Solo necesitas una mat o colchoneta de yoga, ropa cómoda y un espacio tranquilo en casa. Algunos videos pueden sugerir accesorios opcionales como bandas elásticas o pelotas pequeñas, pero no son indispensables. Todo está diseñado para que puedas practicar desde la comodidad de tu hogar.',
    },
    {
        question: '¿Cuántas veces por semana debo practicar?',
        answer: 'Recomendamos practicar entre 3 a 5 veces por semana para obtener mejores resultados. Nuestras sesiones varían de 15 a 45 minutos, permitiéndote adaptarlas a tu agenda y nivel de energía. La consistencia es más importante que la duración, así que encuentra un ritmo que funcione para ti.',
    },
    {
        question: '¿Puedo cancelar mi membresía en cualquier momento?',
        answer: 'Sí, puedes cancelar tu membresía en cualquier momento sin penalizaciones ni preguntas. No hay contratos a largo plazo ni compromisos. Si decides cancelar, mantendrás acceso hasta el final de tu período de facturación actual.',
    },
    {
        question: '¿Cómo accedo a los videos?',
        answer: 'Una vez que te suscribas, tendrás acceso inmediato a toda nuestra biblioteca de videos a través de nuestra plataforma web. Puedes acceder desde cualquier dispositivo (computadora, tablet o teléfono) con conexión a internet. Los videos están organizados por trimestre y tipo de ejercicio para que encuentres fácilmente lo que necesitas.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative bg-gradient-to-b from-[#FFFBF8] to-[#FFFFFF] py-12 lg:py-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl font-bold leading-tight text-[#333333] lg:text-3xl font-[family-name:var(--font-poppins)] mb-3">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-sm text-[#333333]/80 font-[family-name:var(--font-inter)]">
                        Resolvemos tus dudas sobre el programa
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border border-[#DCD8D3] rounded-lg overflow-hidden bg-white"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F6] transition-colors"
                            >
                                <span className="font-semibold text-[#333333] font-[family-name:var(--font-poppins)] text-sm pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#986C4A] shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? 'auto' : 0,
                                    opacity: openIndex === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-4 pt-2">
                                    <p className="text-sm text-[#333333]/80 leading-relaxed font-[family-name:var(--font-inter)]">
                                        {faq.answer}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center mt-10"
                >
                    <p className="text-sm text-[#333333]/70 font-[family-name:var(--font-inter)]">
                        ¿Tienes más preguntas?{' '}
                        <a href="#" className="text-[#986C4A] font-medium hover:underline">
                            Contáctanos
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
