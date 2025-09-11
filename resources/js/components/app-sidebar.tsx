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
    User
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

    //set role
    const roleMap: { [key: number]: string } = {
        2: 'Librarian',
        3: 'Super Librarian',
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
            title: "Books",
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
                },{
                    title: "Recycle Books",
                    url: "/admin/library/books/deleted",
                },
            ],
        },
        {
            title: "Book loans",
            url: "/admin/library/bookloans",
            icon: BookUp2,
            isActive: false,
        },
        {
            title: "Categories",
            url: "/admin/library/categories",
            icon: LibraryBig,
            isActive: false,
        },
        {
            title: "Sub Categories",
            url: "/admin/library/subcategories",
            icon: Library,
            isActive: false,
        },
        {
            title: "Bookcases",
            url: "/admin/library/bookcases",
            icon: LibrarySquare,
            isActive: false,
        },
        {
            title: "Shelves",
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
                                    <span className="truncate font-semibold">Dewey International</span>
                                    <span className="truncate text-xs">{user?.role}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
