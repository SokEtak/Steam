"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2Icon, Pencil, ArrowLeft, X } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category: Category | null;
}

interface SubcategoriesShowProps {
    subcategory: Subcategory;
    flash: {
        message: string | null;
    };
    lang?: "kh" | "en";
}

const translations = {
    kh: {
        title: "ព័ត៌មានលម្អិតនៃប្រភេទរង",
        notification: "ការជូនដំណឹង",
        id: "លេខសម្គាល់",
        name: "ឈ្មោះ",
        category: "ប្រភេទ",
        categoryTooltip: "មើលព័ត៌មានលម្អិតនៃប្រភេទ",
        none: "គ្មាន",
        edit: "កែសម្រួល",
        editTooltip: "កែសម្រួលប្រភេទរងនេះ",
        back: "ត្រឡប់",
        backTooltip: "ត្រឡប់ទៅបញ្ជីប្រភេទរង",
    },
    en: {
        title: "Subcategory Details",
        notification: "Notification",
        id: "ID",
        name: "Name",
        category: "Category",
        categoryTooltip: "View category details",
        none: "None",
        edit: "Edit",
        editTooltip: "Edit this subcategory",
        back: "Back",
        backTooltip: "Return to the subcategories list",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "ប្រភេទរង",
        href: route("subcategories.index"),
    },
    {
        title: "ព័ត៌មានលម្អិត",
        href: "",
    },
];

export default function SubcategoriesShow({ subcategory, flash, lang = "kh" }: SubcategoriesShowProps) {
    const t = translations[lang];
    const { processing } = useForm();
    const [showAlert, setShowAlert] = useState(!!flash.message);

    useEffect(() => {
        if (flash.message) setShowAlert(true);
    }, [flash.message]);

    const handleCloseAlert = () => setShowAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.title}: ${subcategory.name}`} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
                        {t.title}
                    </h1>
                    {showAlert && flash.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <CheckCircle2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <AlertTitle className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {t.notification}
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            {flash.message}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCloseAlert}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-transparent hover:bg-blue-100 dark:hover:bg-blue-800/50 p-1 rounded-full"
                                    disabled={processing}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </Alert>
                    )}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.id}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.id}: ${subcategory.id}`}
                            >
                                {subcategory.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.name}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.name}: ${subcategory.name}`}
                            >
                                {subcategory.name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.category}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={
                                    subcategory.category
                                        ? `${t.category}: ${subcategory.category.name}`
                                        : `${t.category}: ${t.none}`
                                }
                            >
                                {subcategory.category ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route("categories.show", { id: subcategory.category.id })}
                                                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline transition-colors duration-200"
                                                >
                                                    {subcategory.category.name}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                                {t.categoryTooltip}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">{t.none}</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("subcategories.edit", subcategory.id)}>
                                        <Button
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                                            disabled={processing}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            {t.edit}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                    {t.editTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {/* <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={processing}
                                    >
                                        <Trash className="h-4 w-4 mr-2" />
                                        {t.delete}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                    {t.deleteTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider> */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("subcategories.index")}>
                                        <Button
                                            variant="outline"
                                            className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out"
                                            disabled={processing}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t.back}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                    {t.backTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
