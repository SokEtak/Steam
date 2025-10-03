"use client"

import * as React from "react"
import {
    Book,
    University,
    BookUp2,
    LibraryBig,
    Library,
    LibrarySquare,
    Sheet,
    User,
    LayoutDashboard
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePage } from '@inertiajs/react';

// Define the User interface for TypeScript
interface User {
    name: string;
    email: string;
    role_id: number;
    avatar?: string; // Make avatar optional
}

// Define the shape of SharedData for usePage
interface SharedData {
    auth: {
        user: User | null;
    };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<SharedData>().props;

    // Set role
    const roleMap: { [key: number]: string } = {
        2: 'Librarian',
        3: 'Super Librarian',
        999: 'Admin', // Added role for User tab access
    };

    // Prepare the user object, providing a default avatar if none exists
    const user = auth.user
        ? {
            name: auth.user.name,
            email: auth.user.email,
            role: roleMap[auth.user.role_id] || 'Unknown',
            avatar: auth.user.avatar || "/avatars/default.jpg",
        }
        : null;

    // Define navigation items
    const navMain = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
            isActive: false,
        },
        {
            title: "Book",
            url: "/admin/library/books",
            icon: Book,
            isActive: false,
            items: [
                {
                    title: "E-Book",
                    url: "/admin/library/books?type=ebook",
                },
                {
                    title: "Physical Book",
                    url: "/admin/library/books?type=physical",
                },
                {
                    title: "Missing Book",
                    url: "/admin/library/books?type=miss",
                },
                // {
                //     title: "Deleted Book",
                //     url: "/admin/library/books?type=delBook",
                // },
            ],
        },
        {
            title: "Book loan",
            url: "/admin/library/bookloans",
            icon: BookUp2,
            isActive: false,
        },
        {
            title: "Category",
            url: "/admin/library/categories",
            icon: LibraryBig,
            isActive: false,
        },
        {
            title: "Sub Category",
            url: "/admin/library/subcategories",
            icon: Library,
            isActive: false,
        },
        {
            title: "Bookcase",
            url: "/admin/library/bookcases",
            icon: LibrarySquare,
            isActive: false,
        },
        {
            title: "Shelf",
            url: "/admin/library/shelves",
            icon: Sheet,
            isActive: false,
        },
        {
            title: "User",
            url: "/admin/library/users",
            icon: User,
            isActive: false,
        },
    ];

    // Determine visible navigation items based on role_id
    const visibleNavItems = auth.user
        ? auth.user.role_id === 999
            ? navMain.filter(item => item.title === "User") // Only "User" tab for role_id 999
            : auth.user.role_id === 2 || auth.user.role_id === 3
                ? navMain.filter(item => item.title !== "User") // All tabs except "User" for role_id 2 or 3
                : [] // No tabs for other roles
        : []; // No tabs if no user

    return (
        <Sidebar variant="inset" {...props} className="visability-hidden">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/" className="flex items-center gap-3">
                                <div className="p-1 flex w-12 h-10 items-center justify-center rounded-lg bg-sidebar-primary transition-transform duration-300 hover:scale-110">
                                    <img
                                        src="/images/DIS(no back).png"
                                        alt="Logo"
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-green-600 dark:text-green-400">Dewey Steam</span>
                                    <span className="truncate text-xs text-orange-500 dark:text-orange-400 mx-4">{user?.role}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
