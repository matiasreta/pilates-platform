'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar() {
    const pathname = usePathname();
    
    // No mostrar el navbar en rutas del dashboard
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }
    
    return <Navbar />;
}

