'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardNavbarProps {
    userEmail?: string;
    subscription?: any;
}

export default function DashboardNavbar({ userEmail, subscription }: DashboardNavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [managingSubscription, setManagingSubscription] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getSubscriptionStatus = () => {
        if (!subscription) {
            return {
                text: 'Sin suscripción',
                color: 'bg-gray-100 text-gray-700',
                icon: '⚠️',
            };
        }

        switch (subscription.status) {
            case 'active':
                return {
                    text: 'Activa',
                    color: 'bg-green-100 text-green-700',
                    icon: '✓',
                };
            case 'trialing':
                return {
                    text: 'Período de prueba',
                    color: 'bg-blue-100 text-blue-700',
                    icon: '🎁',
                };
            case 'past_due':
                return {
                    text: 'Pago pendiente',
                    color: 'bg-yellow-100 text-yellow-700',
                    icon: '⏰',
                };
            case 'canceled':
                return {
                    text: 'Cancelada',
                    color: 'bg-red-100 text-red-700',
                    icon: '✕',
                };
            default:
                return {
                    text: subscription.status,
                    color: 'bg-gray-100 text-gray-700',
                    icon: '•',
                };
        }
    };

    const handleManageSubscription = async () => {
        setManagingSubscription(true);
        try {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            setManagingSubscription(false);
        }
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    const status = getSubscriptionStatus();

    return (
        <nav className="w-full bg-[#262422] py-4 relative z-30">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-white">
                    PILATES
                </Link>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
                        aria-label="User menu"
                    >
                        <User size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                            {/* User Email */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cuenta</p>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {userEmail || 'usuario@ejemplo.com'}
                                </p>
                            </div>

                            {/* Subscription Status */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Suscripción</p>
                                    {subscription?.status === 'active' && (
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    )}
                                    {subscription?.status === 'canceled' && (
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    )}
                                    {subscription?.status === 'past_due' && (
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    )}
                                    {subscription?.status === 'trialing' && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    {!subscription && 'Sin suscripción activa'}
                                    {subscription?.status === 'active' && !subscription?.cancel_at_period_end && subscription?.current_period_end &&
                                        `Renovación: ${new Date(subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                    }
                                    {subscription?.status === 'active' && subscription?.cancel_at_period_end && subscription?.current_period_end &&
                                        `Acceso hasta: ${new Date(subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} (Cancelada)`
                                    }
                                    {subscription?.status === 'trialing' && subscription?.current_period_end &&
                                        `Prueba hasta: ${new Date(subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                    }
                                    {subscription?.status === 'canceled' && subscription?.current_period_end &&
                                        `Finalizó: ${new Date(subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                    }
                                    {subscription?.status === 'past_due' &&
                                        'Pago pendiente - Actualiza tu método de pago'
                                    }
                                    {subscription && !subscription.current_period_end && subscription.status !== 'past_due' &&
                                        'Suscripción sin fecha de renovación'
                                    }
                                </p>
                            </div>

                            {/* Manage Subscription Button */}
                            {subscription && subscription.status === 'active' && (
                                <button
                                    onClick={handleManageSubscription}
                                    disabled={managingSubscription}
                                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    {managingSubscription ? 'Cargando...' : 'Gestionar Suscripción'}
                                </button>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-200"></div>

                            {/* Sign Out Button */}
                            <button
                                onClick={handleSignOut}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
