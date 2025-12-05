import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardCards } from '@/config/dashboard-cards';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, usePage } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { BookOpen, Library, AlertCircle, Users, School, Package, Building2, Layers, ShieldCheck } from 'lucide-react';

interface DashboardProps {
    auth: { user: { name: string; email: string; roles: string[] } };
    bookStats: { ebookCount: number; physicalBookCount: number; missingBookCount: number; bookLoansCount: number; overdueLoansCount: number };
    assetStats: { totalAssets: number };
    schoolStats: { totalSchools: number; totalRooms: number };
    userStats: { totalUsers: number };
    extraStats: {
        categoryCount: number; subcategoryCount: number; bookcaseCount: number; shelfCount: number;
        assetCategoryCount: number; assetTransactionCount?: number; supplierCount: number;
        roleCount?: number; permissionCount?: number; campusCount: number; buildingCount: number; departmentCount: number;
    };
}

function DashboardCard({
                           title,
                           value,
                           Icon,
                           tooltipContent,
                           colors,     // ← keep this name exactly as in your config
                           href
                       }: {
    title: string;
    value: number | string;
    Icon: any;
    tooltipContent: string;
    colors: {
        bg: string;
        border?: string;
        icon: string;
        tooltipBg: string;
        tooltipArrow?: string;
    };
    href?: string;
}) {
    // Provide fallback colors in case something is missing
    const safeColors = {
        bg: colors?.bg || 'bg-white dark:bg-gray-800',
        border: colors?.border || 'border-gray-200 dark:border-gray-700',
        icon: colors?.icon || 'text-gray-500',
        tooltipBg: colors?.tooltipBg || 'bg-gray-800',
        tooltipArrow: colors?.tooltipArrow || 'fill-gray-800',
    };

    const cardElement = (
        <Card className={`rounded-2xl shadow-lg border ${safeColors.border} ${safeColors.bg} backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {title}
                </CardTitle>
                <Icon className={`h-6 w-6 ${safeColors.icon}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toLocaleString('km-KH') : value}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {href ? (
                        <Link href={href} className="block">
                            {cardElement}
                        </Link>
                    ) : (
                        cardElement
                    )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={`${safeColors.tooltipBg} text-white text-sm font-medium rounded-lg px-4 py-2 shadow-2xl border border-white/20`}
                        side="top"
                        sideOffset={10}
                    >
                        {tooltipContent}
                        <Tooltip.Arrow className={safeColors.tooltipArrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

// Section Header Component
function SectionHeader({ icon: Icon, title, color = "text-blue-600" }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${color}/10 ${color}`}>
                <Icon className={`h-7 w-7 ${color}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 ml-4"></div>
        </div>
    );
}

export default function Page() {
    const { auth, bookStats, assetStats, schoolStats, userStats, extraStats } = usePage<DashboardProps>().props;
    const isAdmin = auth.user.roles.includes('admin');
    const stats = { bookStats, assetStats, schoolStats, userStats, extraStats };

    const visibleCards = dashboardCards
        .map(card => ({
            ...card,
            value: typeof card.value === 'function' ? card.value(stats) : card.value,
        }))
        .filter(card => !card.showFor || card.showFor.includes('admin') ? isAdmin : true);

    // Grouped cards
    const libraryStatsCards = visibleCards.filter(card =>
        ['សៀវភៅអេឡិចត្រូនិកសរុប', 'សៀវភៅរូបវន្តសរុប', 'សៀវភៅបាត់/មិនមាន', 'កំពុងខ្ចីសរុប', 'ខ្ចីលើសកាលកំណត់'].includes(card.title)
    );

    const libraryManagementCards = visibleCards.filter(card =>
        ['ប្រភេទសៀវភៅ', 'ប្រភេទរង', 'ទូរសៀវភៅ', 'ធ្នើរ/ថតទូរ'].includes(card.title)
    );

    const assetManagementCards = visibleCards.filter(card =>
        ['សម្ភារៈសរុប', 'ប្រភេទសម្ភារៈ', 'ការផ្លាស់ទី', 'អ្នកផ្គត់ផ្គង់'].includes(card.title)
    );

    const schoolInfraCards = visibleCards.filter(card =>
        ['សាលារៀនសរុប', 'បន្ទប់សរុប', 'សាខា', 'អគារ', 'ការិយាល័យ'].includes(card.title)
    );

    const adminCards = visibleCards.filter(card => card.showFor?.includes('admin'));

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200/60 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl">
                    <div className="flex items-center gap-3 px-5 w-full">
                        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
                        <Separator orientation="vertical" className="h-5" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    ផ្ទាំងកិច្ចការ
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="p-6 lg:p-8 xl:p-10 space-y-12 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-indigo-950/20 min-h-screen">
                    {/* Welcome Hero Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl">
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                ជំរាបសួរ, {auth.user.name.split(' ')[0]}!
                            </h1>
                            <p className="mt-3 text-lg opacity-90">
                                សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងបណ្ណាល័យ និងទ្រព្យសម្បត្តិសាលារៀន
                            </p>
                        </div>
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Library Statistics */}
                    {libraryStatsCards.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl">
                                    <Library className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ស្ថិតិបណ្ណាល័យ</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-emerald-300 to-transparent dark:from-emerald-800"></div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {libraryStatsCards.map((card, i) => (
                                    <ModernDashboardCard key={i} {...card} tooltipContent={card.tooltip} colors={card.colors} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Library Management */}
                    {libraryManagementCards.length > 0 && (
                        <section className="space-y-6">
                            <SectionTitle icon={Layers} title="គ្រប់គ្រងបណ្ណាល័យ" color="text-cyan-600" gradient="from-cyan-300" />
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {libraryManagementCards.map((card, i) => (
                                    <ModernDashboardCard key={i} {...card} tooltipContent={card.tooltip} colors={card.colors} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Asset Management */}
                    {assetManagementCards.length > 0 && (
                        <section className="space-y-6">
                            <SectionTitle icon={Package} title="គ្រប់គ្រងទ្រព្យសម្បត្តិ" color="text-amber-600" gradient="from-amber-300" />
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {assetManagementCards.map((card, i) => (
                                    <ModernDashboardCard key={i} {...card} tooltipContent={card.tooltip} colors={card.colors} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* School Infrastructure */}
                    {schoolInfraCards.length > 0 && (
                        <section className="space-y-6">
                            <SectionTitle icon={School} title="ហេដ្ឋារចនាសម្ព័ន្ធសាលា" color="text-purple-600" gradient="from-purple-300" />
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {schoolInfraCards.map((card, i) => (
                                    <ModernDashboardCard key={i} {...card} tooltipContent={card.tooltip} colors={card.colors} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Admin Only */}
                    {adminCards.length > 0 && isAdmin && (
                        <section className="space-y-6">
                            <SectionTitle icon={ShieldCheck} title="គ្រប់គ្រងអ្នកប្រើប្រាស់ និងសិទ្ធិ" color="text-rose-600" gradient="from-rose-300" />
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {adminCards.map((card, i) => (
                                    <ModernDashboardCard key={i} {...card} tooltipContent={card.tooltip} colors={card.colors} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

// Modern Card Component (Smansys Style)
function ModernDashboardCard({ title, value, Icon, tooltipContent, colors, href }: any) {
    const safeColors = {
        bg: colors?.bg || 'bg-white dark:bg-gray-800',
        icon: colors?.icon || 'text-gray-600 dark:text-gray-400',
        tooltipBg: colors?.tooltipBg || 'bg-gray-800',
        tooltipArrow: colors?.tooltipArrow || 'fill-gray-800',
    };

    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {href ? (
                        <Link href={href} className="block">
                            <div className={`group relative overflow-hidden rounded-2xl ${safeColors.bg} border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900/50 shadow-inner">
                                        <Icon className={`h-7 w-7 ${safeColors.icon} group-hover:scale-110 transition-transform`} />
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {typeof value === 'number' ? value.toLocaleString('km-KH') : value}
                                </p>
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 dark:to-black/10 pointer-events-none"></div>
                            </div>
                        </Link>
                    ) : (
                        <div className={`group relative overflow-hidden rounded-2xl ${safeColors.bg} border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900/50 shadow-inner">
                                    <Icon className={`h-7 w-7 ${safeColors.icon} group-hover:scale-110 transition-transform`} />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {typeof value === 'number' ? value.toLocaleString('km-KH') : value}
                            </p>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 dark:to-black/10 pointer-events-none"></div>
                        </div>
                    )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={`${safeColors.tooltipBg} text-white text-sm font-medium rounded-xl px-4 py-2.5 shadow-2xl border border-white/20`}
                        sideOffset={10}
                    >
                        {tooltipContent}
                        <Tooltip.Arrow className={safeColors.tooltipArrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

// Reusable Section Title
function SectionTitle({ icon: Icon, title, color, gradient }: { icon: any; title: string; color: string; gradient: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-3 bg-${color.replace('text-', '')}-100 dark:bg-${color.replace('text-', '')}-900/40 rounded-2xl`}>
                <Icon className={`h-8 w-8 ${color}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            <div className={`flex-1 h-px bg-gradient-to-r ${gradient} to-transparent dark:from-${color.replace('text-', '')}-800`}></div>
        </div>
    );
}
