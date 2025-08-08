import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Book, LibraryBig, Library, Sheet, User , BookOpenText , Layers ,BookAudio , Play} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Book',
        href: '/books',
        icon: Book,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: LibraryBig,
    },
    {
        title: 'Sub Categories',
        href: '/subcategories',
        icon: Library,
    },
    {
        title: 'Shelves',
        href: '/shelves',
        icon: Sheet,
    },
    {
        title: 'Book Loans',
        href: '/bookloans',
        icon: BookOpenText,
    },
    // {
    //     title: 'Users',
    //     href: '/users',
    //     icon: User,
    // },
    {
        title: 'Bookcases',
        href: '/bookcases',
        icon: Layers,
    },
    // {
    //     title: 'Audio Books',
    //     href: '/o',
    //     icon: BookAudio,
    // },
    // {
    //     title: 'Video',
    //     href: '/s',
    //     icon: Play,
    // },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
