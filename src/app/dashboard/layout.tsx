import type { Metadata } from "next";
import DashboardNavbar from "@/components/DashboardNavbar";
import { createClient } from '@/lib/supabase/server';
import { getCachedLatestSubscription } from '@/lib/cache';

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

    // Get user subscription from cache
    const subscription = user ? await getCachedLatestSubscription(user.id) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <DashboardNavbar userEmail={user?.email} subscription={subscription} />
            {children}
        </div>
    );
}
