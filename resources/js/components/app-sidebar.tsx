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
                    title: "E-Books",
                    url: "/admin/library/books?type=ebook",
                },
                {
                    title: "Physical Books",
                    url: "/admin/library/books?type=physical",
                },
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
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <University className="size-4 text-white dark:text-black" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Dewey Steam</span>
                                    <span className="truncate text-xs">{user?.role}</span>
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
