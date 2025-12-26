import type { Metadata } from "next";
import DashboardNavbar from "@/components/DashboardNavbar";
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: "Dashboard - Pilates con Myssis",
    description: "Panel de control para usuarios registrados",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get user subscription
    let subscription = null;
    if (user) {
        const { data } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        subscription = data;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <DashboardNavbar userEmail={user?.email} subscription={subscription} />
            {children}
        </div>
    );
}
