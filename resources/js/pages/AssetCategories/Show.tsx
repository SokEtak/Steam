"use client";

import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, ArrowLeft } from "lucide-react";

interface AssetCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface AssetCategoriesShowProps {
    assetCategory: AssetCategory;
}

const commonStyles = {
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton: "bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm",
    gradientBg: "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
};

export default function AssetCategoriesShow({ assetCategory }: AssetCategoriesShowProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "ប្រភេទទ្រព្យសកម្ម", href: route("asset-categories.index") },
        { title: "បង្ហាញព័ត៌មាន", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="បង្ហាញព័ត៌មានប្រភេទទ្រព្យសកម្ម" />
            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            ព័ត៌មានប្រភេទទ្រព្យសកម្ម
                        </h1>

                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6 space-y-6">

                                {/* ID */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        លេខសម្គាល់ (ID)
                                    </h2>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                        #{assetCategory.id}
                                    </p>
                                </div>

                                {/* Name */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        ឈ្មោះប្រភេទទ្រព្យសកម្ម
                                    </h2>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                        {assetCategory.name}
                                    </p>
                                </div>

                                {/* Created At */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        កាលបរិច្ឆេទបង្កើត
                                    </h2>
                                    <p className="text-base text-gray-700 dark:text-gray-300">
                                        {new Date(assetCategory.created_at).toLocaleString()}
                                    </p>
                                </div>

                                {/* Updated At */}
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        កាលបរិច្ឆេទកែប្រែចុងក្រោយ
                                    </h2>
                                    <p className="text-base text-gray-700 dark:text-gray-300">
                                        {new Date(assetCategory.updated_at).toLocaleString()}
                                    </p>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-8">

                            {/* Edit Button */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("asset-categories.edit", assetCategory.id)}>
                                            <Button className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}>
                                                <Pencil className="h-5 w-5 mr-2" />
                                                កែប្រែ
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        កែប្រែព័ត៌មានប្រភេទទ្រព្យសកម្ម
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Back Button */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("asset-categories.index")}>
                                            <Button
                                                variant="outline"
                                                className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}
                                            >
                                                <ArrowLeft className="h-5 w-5 mr-2" />
                                                ត្រឡប់ក្រោយ
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        ត្រឡប់ទៅបញ្ជីប្រភេទទ្រព្យសកម្ម
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
