'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Pilates', href: '#' },
    { name: 'Contacto', href: '#' },
    { name: 'Dashboard', href: '/dashboard' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-full bg-[#262422] py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight text-white">
                    I I I
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-[#DCD8D3] transition-colors hover:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="bg-white text-black px-5 py-2 rounded text-sm font-medium transition-colors hover:bg-gray-100"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#262422] overflow-hidden">
                    <div className="flex flex-col items-center gap-6 py-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-[#DCD8D3] hover:text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="bg-white text-black px-5 py-2 rounded text-sm font-medium transition-colors hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
