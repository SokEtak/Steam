import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Book, BookOpen, BookOpenText, BookPlus, Trash2 } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';

function DashboardCard({ title, value, Icon, tooltipContent, cardColor, iconColor }) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <Card className={`rounded-xl shadow-md ${cardColor.border} ${cardColor.bg} backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] cursor-pointer`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
                    </CardContent>
                </Card>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content
                    className={`${cardColor.tooltipBg} text-white dark:text-gray-900 text-sm rounded-md px-2 py-1 shadow-md`}
                    side="top"
                    sideOffset={5}
                >
                    {tooltipContent}
                    <Tooltip.Arrow className={`${cardColor.tooltipArrow}`} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}

export default function Page({ bookStats, role_id }) {
    const dashboardCards = [
        {
            title: 'Total E-Books Available',
            value: bookStats.ebookCount,
            Icon: BookOpen,
            actionUrl: '/admin/library/books?type=ebook',
            tooltipContent: 'View all e-books',
            cardColor: {
                bg: 'bg-blue-100 dark:bg-blue-900/50',
                border: 'border-blue-300 dark:border-blue-700',
                tooltipBg: 'bg-blue-600 dark:bg-blue-400',
                tooltipArrow: 'fill-blue-600 dark:fill-blue-400',
            },
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Total Physical Books Available',
            value: bookStats.physicalBookCount,
            Icon: BookOpenText,
            actionUrl: '/admin/library/books?type=physical',
            tooltipContent: 'View all physical books',
            cardColor: {
                bg: 'bg-green-100 dark:bg-green-900/50',
                border: 'border-green-300 dark:border-green-700',
                tooltipBg: 'bg-green-600 dark:bg-green-400',
                tooltipArrow: 'fill-green-600 dark:fill-green-400',
            },
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Total Missing Books',
            value: bookStats.missingBookCount,
            Icon: BookPlus,
            actionUrl: '/admin/library/books?type=miss',
            tooltipContent: 'View all missing books',
            cardColor: {
                bg: 'bg-yellow-100 dark:bg-yellow-900/50',
                border: 'border-yellow-300 dark:border-yellow-700',
                tooltipBg: 'bg-yellow-600 dark:bg-yellow-400',
                tooltipArrow: 'fill-yellow-600 dark:fill-yellow-400',
            },
            iconColor: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            title: 'Total Deleted Books',
            value: bookStats.deletedBookCount,
            Icon: Trash2,
            actionUrl: '/admin/library/books?type=delBook',
            tooltipContent: 'View all deleted books',
            cardColor: {
                bg: 'bg-red-100 dark:bg-red-900/50',
                border: 'border-red-300 dark:border-red-700',
                tooltipBg: 'bg-red-600 dark:bg-red-400',
                tooltipArrow: 'fill-red-600 dark:fill-red-400',
            },
            iconColor: 'text-red-600 dark:text-red-400',
        },
        {
            title: 'Total Books on Loan',
            value: bookStats.bookLoansCount,
            Icon: Book,
            actionUrl: '/admin/library/book-loans',
            tooltipContent: 'View all books on loan',
            cardColor: {
                bg: 'bg-purple-100 dark:bg-purple-900/50',
                border: 'border-purple-300 dark:border-purple-700',
                tooltipBg: 'bg-purple-600 dark:bg-purple-400',
                tooltipArrow: 'fill-purple-600 dark:fill-purple-400',
            },
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
    ].filter(card => {
        // Show all cards for role_id = 3
        if (role_id === 3) return true;
        // Show all except deleted books for role_id = 2
        if (role_id === 2 && card.title !== 'Total Deleted Books') return true;
        // Other roles are blocked by backend (403)
        return false;
    });

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/70 dark:border-gray-700/70 backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    Dashboard
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="grid auto-rows-min gap-4 p-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    {dashboardCards.map((card, index) => (
                        <Link key={index} href={card.actionUrl}>
                            <DashboardCard
                                title={card.title}
                                value={card.value}
                                Icon={card.Icon}
                                tooltipContent={card.tooltipContent}
                                cardColor={card.cardColor}
                                iconColor={card.iconColor}
                            />
                        </Link>
                    ))}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
