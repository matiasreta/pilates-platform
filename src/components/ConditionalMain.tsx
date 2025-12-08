'use client';

import { usePathname } from 'next/navigation';

interface ConditionalMainProps {
    children: React.ReactNode;
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
    const pathname = usePathname();
    
    // No aplicar pt-16 en rutas del dashboard ya que no hay navbar por defecto
    const paddingTop = pathname?.startsWith('/dashboard') ? '' : 'pt-16';
    
    return (
        <main className={paddingTop}>
            {children}
        </main>
    );
}

