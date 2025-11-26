"use client";

import AppLayout from "@/layouts/app-layout";
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

// Hard-coded Khmer translations for this page
const t = {
    indexTitle: "ក្រុមអចលនទ្រព្យរង",
    showTitle: "ព័ត៌មានលម្អិតក្រុមអចលនទ្រព្យរង",
    showId: "លេខសម្គាល់",
    showName: "ឈ្មោះក្រុមអចលនទ្រព្យរង",
    showCategory: "ប្រភេទក្រុម",
    showCreated: "បានបង្កើតនៅថ្ងៃ",
    showUpdated: "បានកែប្រែចុងក្រោយ",
    showEdit: "កែប្រែ",
    showEditTooltip: "កែប្រែព័ត៌មានក្រុមអចលនទ្រព្យរងនេះ",
    showBack: "ត្រឡប់ក្រោយ",
    showBackTooltip: "ត្រឡប់ទៅបញ្ជីក្រុមអចលនទ្រព្យរង",
};

interface AssetSubCategory {
    id: number;
    name: string;
    asset_category: { id: number; name: string };
    created_at: string;
    updated_at: string;
}

interface AssetSubCategoriesShowProps {
    assetSubCategory: AssetSubCategory;
}

const commonStyles = {
    gradientBg: "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg hover:shadow-xl",
    outlineButton: "bg-transparent text-indigo-500 border-2 border-indigo-400 hover:bg-indigo-50 shadow-sm",
};

export default function AssetSubCategoriesShow({ assetSubCategory }: AssetSubCategoriesShowProps) {
    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("asset-sub-categories.index") },
            { title: assetSubCategory.name, href: "" }
        ]}>
            <Head title={t.showTitle} />

            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            {t.showTitle}
                        </h1>

                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.showId}</h2>
                                    <p className="text-xl font-semibold">#{assetSubCategory.id}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.showName}</h2>
                                    <p className="text-xl font-semibold">{assetSubCategory.name}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.showCategory}</h2>
                                    <p className="text-xl font-semibold text-indigo-600">
                                        {assetSubCategory.asset_category.name}
                                    </p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.showCreated}</h2>
                                    <p className="text-base text-gray-700 dark:text-gray-300">
                                        {new Date(assetSubCategory.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.showUpdated}</h2>
                                    <p className="text-base text-gray-700 dark:text-gray-300">
                                        {new Date(assetSubCategory.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end space-x-4 mt-8">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("asset-sub-categories.edit", assetSubCategory.id)}>
                                            <Button className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}>
                                                <Pencil className="h-5 w-5 mr-2" />
                                                {t.showEdit}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.showEditTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("asset-sub-categories.index")}>
                                            <Button variant="outline" className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}>
                                                <ArrowLeft className="h-5 w-5 mr-2" />
                                                {t.showBack}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.showBackTooltip}
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
