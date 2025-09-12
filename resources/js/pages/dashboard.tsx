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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, SlidersHorizontal, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
export default function Page({ bookStats, bookLoansData, bookReturnsData, recentLoans }) {
    // We now manage a local state for the timeframe, defaulting to 'Last 6 months'
    const [currentTimeframe, setCurrentTimeframe] = useState('Last 6 months');
    const [activeChart, setActiveChart] = useState('loans');

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
            // change: '+9.5%', // Placeholder, as this data isn't provided
            // trend: 'up',
            // description: 'Available count trending up this month',
            Icon: ArrowUpRight,
        },
        {
            title: 'Total Physical Books Available',
            value: bookStats.physicalBookCount,
            // change: '-2.0%', // Placeholder
            // trend: 'down',
            // description: 'Stock needs review',
            Icon: ArrowDownRight,
        },
        {
            title: 'Book Loans Today',
            value: bookStats.bookLoansToday,
            // change: bookStats.bookLoansChange,
            // trend: getTrend(bookStats.bookLoansChange),
            // description: 'Compared to yesterday',
            Icon: getTrend(bookStats.bookLoansChange) === 'up' ? ArrowUpRight : getTrend(bookStats.bookLoansChange) === 'down' ? ArrowDownRight : SlidersHorizontal,
        },
        {
            title: 'New Books Added Today',
            value: bookStats.newBooksAddedToday,
            change: bookStats.newBooksChange,
            trend: getTrend(bookStats.newBooksChange),
            // description: 'Compared to yesterday',
            Icon: getTrend(bookStats.newBooksChange) === 'up' ? ArrowUpRight : getTrend(bookStats.newBooksChange) === 'down' ? ArrowDownRight : SlidersHorizontal,
        },
    ];

    // Add 'Today' to the list of timeframes
    const timeframes = ['Last 6 months', 'Last 3 months', 'Last 30 days', 'Last 7 days', 'Today'];

    // Conditional data and titles for the chart
    const chartData = activeChart === 'loans' ? bookLoansData : bookReturnsData;
    const chartTitle = activeChart === 'loans' ? 'Total Book Loans' : 'Total Book Returns';

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
                                        Library Dashboard
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

                    {/*<Card className="rounded-xl p-6 shadow-md border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">*/}
                    {/*    <div className="flex items-center justify-between mb-4">*/}
                    {/*        <div>*/}
                    {/*            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{chartTitle}</h2>*/}
                    {/*            <p className="text-sm text-gray-500 dark:text-gray-400">Total for the {currentTimeframe.toLowerCase()}</p>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <Button*/}
                    {/*                variant={activeChart === 'loans' ? 'secondary' : 'outline'}*/}
                    {/*                className="rounded-full"*/}
                    {/*                onClick={() => setActiveChart('loans')}*/}
                    {/*            >*/}
                    {/*                Loans*/}
                    {/*            </Button>*/}
                    {/*            <Button*/}
                    {/*                variant={activeChart === 'returns' ? 'secondary' : 'outline'}*/}
                    {/*                className="rounded-full"*/}
                    {/*                onClick={() => setActiveChart('returns')}*/}
                    {/*            >*/}
                    {/*                Returns*/}
                    {/*            </Button>*/}
                    {/*            <DropdownMenu>*/}
                    {/*                <DropdownMenuTrigger asChild>*/}
                    {/*                    <Button variant="outline" className="rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">*/}
                    {/*                        {currentTimeframe}*/}
                    {/*                    </Button>*/}
                    {/*                </DropdownMenuTrigger>*/}
                    {/*                <DropdownMenuContent className="w-56 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">*/}
                    {/*                    <DropdownMenuRadioGroup value={currentTimeframe} onValueChange={setCurrentTimeframe}>*/}
                    {/*                        {timeframes.map(timeframe => (*/}
                    {/*                            <DropdownMenuRadioItem key={timeframe} value={timeframe}>*/}
                    {/*                                {timeframe}*/}
                    {/*                            </DropdownMenuRadioItem>*/}
                    {/*                        ))}*/}
                    {/*                    </DropdownMenuRadioGroup>*/}
                    {/*                </DropdownMenuContent>*/}
                    {/*            </DropdownMenu>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="h-[300px] w-full">*/}
                    {/*        <ResponsiveContainer width="100%" height="100%">*/}
                    {/*            <AreaChart data={chartData}>*/}
                    {/*                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />*/}
                    {/*                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400 text-xs" />*/}
                    {/*                <YAxis stroke="#6b7280" className="dark:stroke-gray-400 text-xs" />*/}
                    {/*                <Tooltip contentStyle={{ backgroundColor: 'rgb(255 255 255 / 0.8)', borderRadius: '12px', border: '1px solid #e5e7eb' }} itemStyle={{ color: '#1f2937' }} />*/}
                    {/*                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="url(#colorUv)" />*/}
                    {/*                <defs>*/}
                    {/*                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">*/}
                    {/*                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />*/}
                    {/*                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />*/}
                    {/*                    </linearGradient>*/}
                    {/*                </defs>*/}
                    {/*            </AreaChart>*/}
                    {/*        </ResponsiveContainer>*/}
                    {/*    </div>*/}
                    {/*</Card>*/}

                    {/*<Card className="flex-1 rounded-xl p-6 shadow-md border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">*/}
                    {/*    <div className="flex justify-between items-center mb-4">*/}
                    {/*        <div className="flex space-x-2">*/}
                    {/*            <Button variant="secondary" className="rounded-full">Recent Loans</Button>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex space-x-2">*/}
                    {/*            <Button variant="outline" size="icon" className="rounded-full"><SlidersHorizontal size={16} /></Button>*/}
                    {/*            <Button variant="outline" className="rounded-full flex items-center gap-1"><Plus size={16} /> New Loan</Button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="grid grid-cols-4 gap-4 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">*/}
                    {/*        <div>Title</div>*/}
                    {/*        <div>Borrower</div>*/}
                    {/*        <div>Loan Date</div>*/}
                    {/*        <div>Status</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="text-gray-900 dark:text-gray-50">*/}
                    {/*        {recentLoans.map((loan, index) => (*/}
                    {/*            <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">*/}
                    {/*                <div className="truncate" title={loan.title}>{loan.title}</div>*/}
                    {/*                <div className="truncate">{loan.borrower}</div>*/}
                    {/*                <div>{loan.loan_date}</div>*/}
                    {/*                <div>*/}
                    {/*                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${*/}
                    {/*                        loan.status === 'Loaned' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'*/}
                    {/*                    }`}>*/}
                    {/*                        {loan.status}*/}
                    {/*                    </span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*    {recentLoans.length === 0 && (*/}
                    {/*        <div className="text-center py-4 text-gray-500 dark:text-gray-400">*/}
                    {/*            No recent loans found.*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</Card>*/}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
