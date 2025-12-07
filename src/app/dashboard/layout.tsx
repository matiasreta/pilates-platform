import type { Metadata } from "next";
import DashboardNavbar from "@/components/DashboardNavbar";
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: "Dashboard - Pilates con Luciana",
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
            .single();
        subscription = data;
    }

    return (
        <>
            <DashboardNavbar userEmail={user?.email} subscription={subscription} />
            <main className="pt-16">
                {children}
            </main>
        </>
    );
}
