"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash, ArrowLeft } from "lucide-react";

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface CategoriesShowProps {
    category: Category;
    lang?: "kh" | "en";
}

const translations = {
    kh: {
        title: "ព័ត៌មានលម្អិតនៃប្រភេទ",
        id: "លេខសម្គាល់",
        name: "ឈ្មោះ",
        createdAt: "បានបង្កើតនៅ",
        lastModified: "កែប្រែចុងក្រោយ",
        edit: "កែសម្រួល",
        editTooltip: "កែសម្រួលប្រភេទនេះ",
        delete: "លុប",
        deleteTooltip: "លុបប្រភេទនេះ",
        back: "ត្រឡប់",
        backTooltip: "ត្រឡប់ទៅបញ្ជីប្រភេទ",
        confirmDeleteTitle: "តើអ្នកប្រាកដទេ?",
        confirmDeleteDescription: "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ វានឹងលុបប្រភេទ ",
        cancel: "បោះបង់",
    },
    en: {
        title: "Category Details",
        id: "ID",
        name: "Name",
        createdAt: "Created At",
        lastModified: "Last Modified",
        edit: "Edit",
        editTooltip: "Edit this category",
        delete: "Delete",
        deleteTooltip: "Delete this category",
        back: "Back",
        backTooltip: "Return to the categories list",
        confirmDeleteTitle: "Are you sure?",
        confirmDeleteDescription: "This action cannot be undone. This will permanently delete the category ",
        cancel: "Cancel",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "ប្រភេទ",
        href: route("categories.index"),
    },
    {
        title: "ព័ត៌មានលម្អិត",
        href: "",
    },
];

export default function CategoriesShow({ category, lang = "kh" }: CategoriesShowProps) {
    const t = translations[lang];
    const { processing } = useForm();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const confirmDelete = () => {
        router.delete(route("categories.destroy", category.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                router.visit(route("categories.index"));
            },
            onError: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.title}: ${category.name}`} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
                        {t.title}
                    </h1>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.id}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.id}: ${category.id}`}
                            >
                                {category.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.name}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.name}: ${category.name}`}
                            >
                                {category.name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.createdAt}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.createdAt}: ${new Date(category.created_at).toLocaleString()}`}
                            >
                                {new Date(category.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.lastModified}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.lastModified}: ${new Date(category.updated_at).toLocaleString()}`}
                            >
                                {new Date(category.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("categories.edit", { id: category.id })}>
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
                        <TooltipProvider>
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
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("categories.index")}>
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
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300">
                                {t.confirmDeleteTitle}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                {t.confirmDeleteDescription}
                                <strong>{category.name}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition-all duration-300">
                                {t.cancel}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-all duration-300"
                                disabled={processing}
                            >
                                {t.delete}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
