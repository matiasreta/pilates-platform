'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, MessageSquare, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardNavbarProps {
    userEmail?: string;
    subscription?: any;
}

export default function DashboardNavbar({ userEmail, subscription }: DashboardNavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [managingSubscription, setManagingSubscription] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
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

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackMessage.trim()) return;

        setIsSubmittingFeedback(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Debes iniciar sesión para enviar feedback');
                return;
            }

            const { error } = await supabase
                .from('feedback')
                .insert([
                    {
                        user_id: user.id,
                        message: feedbackMessage.trim(),
                    }
                ]);

            if (error) throw error;

            setFeedbackMessage('');
            setIsFeedbackOpen(false);
            alert('¡Gracias por tu feedback!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error al enviar feedback. Por favor intenta de nuevo.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const status = getSubscriptionStatus();

    return (
        <>
            <nav className="w-full bg-[#262422] py-4 relative z-30">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-white">
                        I I I
                    </Link>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {/* Feedback Button */}
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                            <MessageSquare size={18} />
                            Feedback
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
                                aria-label="User menu"
                            >
                                <span className="text-sm font-medium">Usuario</span>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#262422] text-white">
                                    <User size={16} />
                                </div>
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
                </div>
            </nav>

            {/* Feedback Modal */}
            {
                isFeedbackOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setIsFeedbackOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Envíanos tu Feedback</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    ¿Tienes alguna sugerencia o encontraste algún problema? Cuéntanos para poder mejorar.
                                </p>

                                <form onSubmit={handleSubmitFeedback}>
                                    <textarea
                                        value={feedbackMessage}
                                        onChange={(e) => setFeedbackMessage(e.target.value)}
                                        placeholder="Escribe tu mensaje aquí..."
                                        className="w-full h-32 px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#262422] focus:border-transparent resize-none mb-4"
                                        required
                                    />

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsFeedbackOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingFeedback}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#262422] hover:bg-[#262422]/90 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isSubmittingFeedback && <Loader2 size={16} className="animate-spin" />}
                                            Enviar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
