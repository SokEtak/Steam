import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import  { BookOpenText, BookOpen, BookPlus } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

function DashboardCard({ title, value, Icon }) {

    return (
        // Added hover and transition classes here
        <Card className="rounded-xl shadow-md border-gray-200/70 dark:border-gray-700/70 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                <Icon className={`h-4 w-4`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
            </CardContent>
        </Card>
    );
}

// Main Page component updated to accept props
export default function Page({ bookStats }) {
    const dashboardCards = [
        {
            title: 'Total E-Books Available',
            value: bookStats.ebookCount,
            Icon: BookOpen,
        },
        {
            title: 'Total Physical Books Available',
            value: bookStats.physicalBookCount,
            Icon: BookOpenText,
        },
    ];
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/70 dark:border-gray-700/70  backdrop-blur-sm">
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
                            <DashboardCard key={index} {...card} />
                        ))}
                    </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
