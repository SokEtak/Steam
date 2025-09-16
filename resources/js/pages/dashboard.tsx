import { useState, useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, SlidersHorizontal, Plus } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { router } from '@inertiajs/react';

// DashboardCard component remains the same
function DashboardCard({ title, value, change, description, Icon, trend }) {
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    return (
        // Added hover and transition classes here
        <Card className="rounded-xl shadow-md border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
                <p className={`text-xs ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-600'} dark:${isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-400'}`}>
                    {change}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </CardContent>
        </Card>
    );
}

// Main Page component updated to accept props
export default function Page({ bookStats }) {
    // We now manage a local state for the timeframe, defaulting to 'Last 6 months'
    const [currentTimeframe, setCurrentTimeframe] = useState('Last 6 months');

    // Use a useEffect hook to update the page data when the timeframe changes
    useEffect(() => {
        router.get(route('dashboard'), { timeframe: currentTimeframe }, {
            preserveState: true,
            preserveScroll: true,
            only: ['bookLoansData', 'bookReturnsData'],
        });
    }, [currentTimeframe]);

    // Function to determine trend based on percentage
    const getTrend = (change) => {
        if (change.startsWith('+') && change !== '+0.0%') {
            return 'up';
        }
        if (change.startsWith('-')) {
            return 'down';
        }
        return 'neutral';
    };

    const dashboardCards = [
        {
            title: 'Total E-Books Available',
            value: bookStats.ebookCount,
            Icon: ArrowUpRight,
        },
        {
            title: 'Total Physical Books Available',
            value: bookStats.physicalBookCount,
            Icon: ArrowDownRight,
        },
        // {
        //     title: 'Book Loans Today',
        //     value: bookStats.bookLoansToday,
        //     Icon: getTrend(bookStats.bookLoansChange) === 'up' ? ArrowUpRight : getTrend(bookStats.bookLoansChange) === 'down' ? ArrowDownRight : SlidersHorizontal,
        // },
        {
            title: 'New Books Added Today',
            value: bookStats.newBooksAddedToday,
            trend: getTrend(bookStats.newBooksChange),
            Icon: getTrend(bookStats.newBooksChange) === 'up' ? ArrowUpRight : getTrend(bookStats.newBooksChange) === 'down' ? ArrowDownRight : SlidersHorizontal,
        },
    ];
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#" className="font-semibold text-gray-700 dark:text-gray-300">
                                         Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-semibold text-gray-900 dark:text-gray-50">Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                    <div className="grid auto-rows-min gap-4 p-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                        {dashboardCards.map((card, index) => (
                            <DashboardCard key={index} {...card} />
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
