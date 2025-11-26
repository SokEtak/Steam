"use client"

import * as React from "react";
import { useEffect, useRef } from "react";
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
    Package,
    PackageSearch,
    Share2,
    Truck,
    NotepadText,
    BookPlus,
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

interface User { name: string; email: string; roles: string[]; avatar?: string; }
interface SharedData { auth: { user: User | null; }; }

// Keep type compatible with NavMain
interface NavItem {
    title: string;
    url?: string;
    icon?: React.ElementType;
    iconColor?: string;
    items?: NavItem[];
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<SharedData>().props;
    const sidebarContentRef = useRef<HTMLDivElement>(null);

    // Directly use the first role as-is (no mapping)
    const rawRole = auth.user?.roles?.[0] || "Guest";

    const user = auth.user
        ? {
            name: auth.user.name,
            email: auth.user.email,
            role: rawRole, // ← Now shows "staff", "admin", etc. directly
            avatar: auth.user.avatar || "/avatars/default.jpg",
        }
        : null;

    // Save & restore scroll position
    useEffect(() => {
        const content = sidebarContentRef.current;
        if (!content) return;

        const savedScroll = sessionStorage.getItem("app-sidebar-scroll");
        if (savedScroll) content.scrollTop = Number(savedScroll);

        const saveScroll = () => {
            sessionStorage.setItem("app-sidebar-scroll", content.scrollTop.toString());
        };

        document.addEventListener("inertia:start", saveScroll);
        window.addEventListener("beforeunload", saveScroll);

        return () => {
            document.removeEventListener("inertia:start", saveScroll);
            window.removeEventListener("beforeunload", saveScroll);
        };
    }, []);

    const globalNav: NavItem[] = [
        { title: "ផ្ទាំងកិច្ចការ", url: route("dashboard"), icon: LayoutDashboard, iconColor: "text-sky-500" },
    ];

    const navGroups: NavGroup[] = [
        {
            label: "បណ្ណាល័យ",
            items: [
                {
                    title: "ការគ្រប់គ្រងសៀវភៅ",
                    url: route("books.index"),
                    icon: Book,
                    iconColor: "text-green-500",
                    items: [
                        {
                            title: "បញ្ជីសៀវភៅ",
                            url: route("books.index"),
                            icon: BookOpenCheck,
                            iconColor: "text-orange-600", // Fixed typo
                        },
                        {
                            title: "បន្ថែមសៀវភៅ",
                            url: route("books.create"),
                            icon: BookPlus,
                            iconColor: "text-blue-600",
                        },
                    ],
                },
                { title: "កម្ចីសៀវភៅ", url: route("bookloans.index"), icon: BookOpenCheck, iconColor: "text-blue-500" },
                { title: "ប្រភេទ", url: route("categories.index"), icon: Layers, iconColor: "text-purple-500" },
                { title: "ប្រភេទរង", url: route("subcategories.index"), icon: Layers3, iconColor: "text-indigo-500" },
                { title: "ទូរសៀវភៅ", url: route("bookcases.index"), icon: Boxes, iconColor: "text-yellow-500" },
                { title: "ធ្នើរ/ថតទូរ", url: route("shelves.index"), icon: Table, iconColor: "text-teal-500" },
            ],
        },
        {
            label: "អ្នកប្រើប្រាស់ និង សិទ្ធ",
            items: [
                { title: "តួនាទី", url: route("roles.index"), icon: ShieldCheck, iconColor: "text-red-500" },
                { title: "អ្នកប្រើប្រាស់", url: route("users.index"), icon: Users, iconColor: "text-orange-500" },
                { title: "សិទ្ធប្រើប្រាស់", url: route("permissions.index"), icon: ShieldAlert, iconColor: "text-pink-500" },
            ],
        },
        {
            label: "សម្ភារៈ",
            items: [
                { title: "សម្ភារៈ / ទ្រព្យ", url: route("assets.index"), icon: Package, iconColor: "text-orange-700" },
                { title: "ប្រភេទ", url: route("asset-categories.index"), icon: PackageSearch, iconColor: "text-teal-700" },
                { title: "ប្រភេទរង", url: route("asset-sub-categories.index"), icon: PackageSearch, iconColor: "text-purple-700" },
                { title: "ការផ្លាស់ទី", url: route("asset-transactions.index"), icon: Share2, iconColor: "text-pink-600" },
                { title: "អ្នកផ្គត់ផ្គង់", url: route("suppliers.index"), icon: Truck, iconColor: "text-yellow-700" },
                { title: "ការបញ្ជាទិញ", url: route("purchase-orders.index"), icon: NotepadText, iconColor: "text-gray-700" },
            ],
        },
        {
            label: "សាលារៀន / អគារ",
            items: [
                { title: "សាលារៀន", url: route("schools.index"), icon: GraduationCap, iconColor: "text-green-700" },
                { title: "សាខា", url: route("campuses.index"), icon: MapPinHouse, iconColor: "text-fuchsia-500" },
                { title: "អគារ", url: route("buildings.index"), icon: Building2, iconColor: "text-gray-500" },
                { title: "ការិយាល័យ", url: route("departments.index"), icon: Blocks, iconColor: "text-blue-700" },
                { title: "បន្ទប់", url: route("rooms.index"), icon: DoorOpen, iconColor: "text-indigo-700" },
            ],
        },
    ];

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/" className="flex items-center gap-3">
                                <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-sidebar-primary p-1 transition-transform hover:scale-110">
                                    <img
                                        src="/images/DIS(no back).png"
                                        alt="Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ការិយាល័យស្ទីម
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent
                ref={sidebarContentRef}
                className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/70 dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/80 scrollbar-track-transparent transition-colors duration-200"
            >
                <NavMain items={globalNav} label="សង្ខេបរបាយការណ៍" />

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
