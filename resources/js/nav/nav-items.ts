// resources/js/nav/nav-items.ts

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
} from "lucide-react";

export interface NavItem {
    title: string;
    url?: string;
    icon?: any;
    iconColor?: string;
    items?: NavItem[];
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const globalNav: NavItem[] = [
    {
        title: "ផ្ទាំងកិច្ចការ",
        url: route("dashboard"),
        icon: LayoutDashboard,
        iconColor: "text-sky-500",
    },
];

export const navGroups: NavGroup[] = [
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
                        title: "សៀវភៅ",
                        url: route("books.index", { type: "physical" }),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                    {
                        title: "សៀវភៅបោះបង់",
                        url: route("books.index", { type: "del" }),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                    {
                        title: "សៀវភៅឡិចត្រូនិក",
                        url: route("books.index", { type: "ebook" }),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                    {
                        title: "បន្ថែមសៀវភៅ",
                        url: route("books.create"),
                        icon: BookPlus,
                        iconColor: "text-blue-600",
                    },
                ],
            },
            {
                title: "កម្ចីសៀវភៅ",
                url: route("bookloans.index"),
                icon: BookOpenCheck,
                iconColor: "text-blue-500",
                items: [
                    {
                        title: "បន្ថែមកម្ចីសៀវភៅ",
                        url: route("bookloans.create"),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ប្រភេទ",
                url: route("categories.index"),
                icon: Layers,
                iconColor: "text-purple-500",
                items: [
                    {
                        title: "បន្ថែមប្រភេទសៀវភៅ",
                        url: route("categories.create"),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ប្រភេទរង",
                url: route("subcategories.index"),
                icon: Layers3,
                iconColor: "text-indigo-500",
                items: [
                    {
                        title: "បន្ថែមប្រភេទសៀវភៅរង",
                        url: route("subcategories.create"),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ទូរសៀវភៅ",
                url: route("bookcases.index"),
                icon: Boxes,
                iconColor: "text-yellow-500",
                items: [
                    {
                        title: "បន្ថែមទូរសៀវភៅ",
                        url: route("bookcases.create"),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ធ្នើរ/ថតទូរ",
                url: route("shelves.index"),
                icon: Table,
                iconColor: "text-teal-500",
                items: [
                    {
                        title: "បន្ថែមថតសៀវភៅ",
                        url: route("shelves.create"),
                        icon: BookOpenCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
        ],
    },
    {
        label: "អ្នកប្រើប្រាស់ និង សិទ្ធ",
        items: [
            {
                title: "តួនាទី",
                url: route("roles.index"),
                icon: ShieldCheck,
                iconColor: "text-red-500",
                items: [
                    {
                        title: "បន្ថែមតួនាទី",
                        url: route("roles.create"),
                        icon: ShieldCheck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "អ្នកប្រើប្រាស់",
                url: route("users.index"),
                icon: Users,
                iconColor: "text-orange-500",
                items: [
                    {
                        title: "បន្ថែមអ្នកប្រើប្រាស់",
                        url: route("users.create"),
                        icon: Users,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "សិទ្ធប្រើប្រាស់",
                url: route("permissions.index"),
                icon: ShieldAlert,
                iconColor: "text-pink-500",
                items: [
                    {
                        title: "បន្ថែមសិទ្ធ",
                        url: route("permissions.create"),
                        icon: ShieldAlert,
                        iconColor: "text-orange-600",
                    },
                ],
            },
        ],
    },
    {
        label: "សម្ភារៈ",
        items: [
            {
                title: "សម្ភារៈ / ទ្រព្យ",
                url: route("assets.index"),
                icon: Package,
                iconColor: "text-orange-700",
                items: [
                    {
                        title: "បន្ថែមសម្ភារៈ",
                        url: route("assets.create"),
                        icon: Package,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ប្រភេទ",
                url: route("asset-categories.index"),
                icon: PackageSearch,
                iconColor: "text-teal-700",
                items: [
                    {
                        title: "បន្ថែមប្រភេទ",
                        url: route("asset-categories.create"),
                        icon: PackageSearch,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ប្រភេទរង",
                url: route("asset-sub-categories.index"),
                icon: PackageSearch,
                iconColor: "text-purple-700",
                items: [
                    {
                        title: "បន្ថែមប្រភេទរង",
                        url: route("asset-sub-categories.create"),
                        icon: PackageSearch,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ការផ្លាស់ទី",
                url: route("asset-transactions.index"),
                icon: Share2,
                iconColor: "text-pink-600",
                items: [
                    {
                        title: "បន្ថែមការផ្លាស់ទី",
                        url: route("asset-transactions.create"),
                        icon: Share2,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "អ្នកផ្គត់ផ្គង់",
                url: route("suppliers.index"),
                icon: Truck,
                iconColor: "text-yellow-700",
                items: [
                    {
                        title: "បន្ថែមអ្នកផ្គត់ផ្គង់",
                        url: route("suppliers.create"),
                        icon: Truck,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ការបញ្ជាទិញ",
                url: route("purchase-orders.index"),
                icon: NotepadText,
                iconColor: "text-gray-700",
                items: [
                    {
                        title: "បន្ថែមការបញ្ជាទិញ",
                        url: route("purchase-orders.create"),
                        icon: NotepadText,
                        iconColor: "text-orange-600",
                    },
                ],
            },
        ],
    },
    {
        label: "សាលារៀន / អគារ",
        items: [
            {
                title: "សាលារៀន",
                url: route("schools.index"),
                icon: GraduationCap,
                iconColor: "text-green-700",
                items: [
                    {
                        title: "បន្ថែមសាលារៀន",
                        url: route("schools.create"),
                        icon: GraduationCap,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "សាខា",
                url: route("campuses.index"),
                icon: MapPinHouse,
                iconColor: "text-fuchsia-500",
                items: [
                    {
                        title: "បន្ថែមសាខា",
                        url: route("campuses.create"),
                        icon: MapPinHouse,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "អគារ",
                url: route("buildings.index"),
                icon: Building2,
                iconColor: "text-gray-500",
                items: [
                    {
                        title: "បន្ថែមអគារ",
                        url: route("buildings.create"),
                        icon: Building2,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "ការិយាល័យ",
                url: route("departments.index"),
                icon: Blocks,
                iconColor: "text-blue-700",
                items: [
                    {
                        title: "បន្ថែមការិយាល័យ",
                        url: route("departments.create"),
                        icon: Blocks,
                        iconColor: "text-orange-600",
                    },
                ],
            },
            {
                title: "បន្ទប់",
                url: route("rooms.index"),
                icon: DoorOpen,
                iconColor: "text-indigo-700",
                items: [
                    {
                        title: "បន្ថែមបន្ទប់",
                        url: route("rooms.create"),
                        icon: DoorOpen,
                        iconColor: "text-orange-600",
                    },
                ],
            },
        ],
    },
];
