'use client';

import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-[#DCD8D3] py-8">
            <div className="mx-auto max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-[#6B6B6B] font-[family-name:var(--font-inter)]">
                    &copy; {currentYear} Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
