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
    const { auth } = usePage<SharedData>().props;

    // Determine if sidebar should be shown
    const showSidebar = auth.user?.role_id !== 1;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppSidebarLayout>
    );
}

//old
// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import { type BreadcrumbItem } from '@/types';
// import { type ReactNode } from 'react';
//
// interface AppLayoutProps {
//     children: ReactNode;
//     breadcrumbs?: BreadcrumbItem[];
// }
//
// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//     </AppLayoutTemplate>
// );
