"use client"

import * as React from "react";
import {
    LayoutDashboard,
    Book,
    BookOpenCheck,
    Layers,
    Layers3,
    Boxes,
    Table,
    Users,
    ShieldCheck,
    ShieldAlert,
    GraduationCap,
    MapPinHouse,
    Building2,
    Blocks,
    DoorOpen,
    Wrench,
    Package,
    PackageSearch,
    Share2,
    Truck,
    NotepadText,
} from 'lucide-react';

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePage } from '@inertiajs/react';

interface User {
    name: string;
    email: string;
    roles: string[];
    avatar?: string;
}

interface SharedData {
    auth: {
        user: User | null;
    };
}

interface NavItem {
    title: string;
    url: string;
    icon: React.ElementType;
    iconColor?: string;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<SharedData>().props;

    const roleDisplayMap: { [key: string]: string } = {
        'staff': 'Librarian',
        'admin': 'Super Librarian',
        'super-admin': 'Admin',
    };

    const displayRole = auth.user && auth.user.roles.length > 0
        ? roleDisplayMap[auth.user.roles[0]] || 'Unknown'
        : 'Unknown';

    const user = auth.user
        ? {
            name: auth.user.name,
            email: auth.user.email,
            role: displayRole,
            avatar: auth.user.avatar || "/avatars/default.jpg",
        }
        : null;

    // Global item
    const globalNav: NavItem[] = [
        { title: "Dashboard", url: route("dashboard"), icon: LayoutDashboard, iconColor: "text-sky-500" },
    ];

    // Grouped navigation items
    const navGroups: NavGroup[] = [
        {
            label: "Library",
            items: [
                {
                    title: "Books Management",
                    url: route("books.index"),
                    icon: Book,
                    iconColor: "text-green-500",
                    items: [
                        { title: "Book Subitem", url: "/" },
                    ],
                },
                { title: "Book Loans", url: route("bookloans.index"), icon: BookOpenCheck, iconColor: "text-blue-500" },
                { title: "Categories", url: route("categories.index"), icon: Layers, iconColor: "text-purple-500" },
                { title: "Subcategories", url: route("subcategories.index"), icon: Layers3, iconColor: "text-indigo-500" },
                { title: "Bookcases", url: route("bookcases.index"), icon: Boxes, iconColor: "text-yellow-500" },
                { title: "Shelves", url: route("shelves.index"), icon: Table, iconColor: "text-teal-500" },
            ],
        },
        {
            label: "User Management",
            items: [
                { title: "User Directory", url: route("users.index"), icon: Users, iconColor: "text-orange-500" },
                { title: "Role Management", url: route("roles.index"), icon: ShieldCheck, iconColor: "text-red-500" },
                { title: "Permissions", url: route("permissions.index"), icon: ShieldAlert, iconColor: "text-pink-500" },
            ],
        },
        {
            label: "Assets",
            items: [
                { title: "Assets", url: route("assets.index"), icon: Package, iconColor: "text-orange-700" },
                { title: "Asset Categories", url: route("asset-categories.index"), icon: PackageSearch, iconColor: "text-teal-700" },
                { title: "Asset SubCategories", url: route("asset-sub-categories.index"), icon: PackageSearch, iconColor: "text-purple-700" },
                { title: "Asset Transactions", url: route("asset-transactions.index"), icon: Share2, iconColor: "text-pink-600" },
                { title: "Suppliers", url: route("suppliers.index"), icon: Truck, iconColor: "text-yellow-700" },
                { title: "Purchase Orders", url: route("purchase-orders.index"), icon: NotepadText, iconColor: "text-gray-700" },
                { title: "Maintenance Records", url: route("campuses.index"), icon: Wrench, iconColor: "text-red-600" },
            ],
        },
        {
            label: "Schools / Buildings",
            items: [
                { title: "Schools", url: route("schools.index"), icon: GraduationCap, iconColor: "text-green-700" },
                { title: "Campuses", url: route("campuses.index"), icon: MapPinHouse, iconColor: "text-fuchsia-500" },
                { title: "Buildings", url: route("buildings.index"), icon: Building2, iconColor: "text-gray-500" },
                { title: "Departments", url: route("departments.index"), icon: Blocks, iconColor: "text-blue-700" },
                { title: "Rooms", url: route("rooms.index"), icon: DoorOpen, iconColor: "text-indigo-700" },
            ],
        },
    ];

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
                                    <span className="truncate text-md text-orange-500 dark:text-orange-400 mx-4">{user?.role}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Render global items first */}
                <NavMain items={globalNav} label="" />

                {/* Render grouped items */}
                {navGroups.map((group) => (
                    <NavMain key={group.label} items={group.items} label={group.label} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
