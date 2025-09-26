import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

interface SharedData {
    auth: {
        user: {
            role_id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
// Determine if sidebar should be shown
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppSidebarLayout>
    );
}

