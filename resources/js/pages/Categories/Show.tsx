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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, Trash, ArrowLeft } from "lucide-react";

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface CategoriesShowProps {
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Categories",
        href: route("categories.index"),
    },
    {
        title: "Show",
        href: "",
    },
];

export default function CategoriesShow({ category }: CategoriesShowProps) {
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
            <Head title={`Category: ${category.name}`} />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
                        Category Details
                    </h1>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Category ID: ${category.id}`}
                            >
                                {category.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Category Name: ${category.name}`}
                            >
                                {category.name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Created At: ${new Date(category.created_at).toLocaleString()}`}
                            >
                                {new Date(category.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Modified</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Last Modified: ${new Date(category.updated_at).toLocaleString()}`}
                            >
                                {new Date(category.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("categories.edit", { id: category.id })}>
                                        <Button
                                            className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                            disabled={processing}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Edit this category
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={processing}
                                    >
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Delete this category
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("categories.index")}>
                                        <Button
                                            variant="outline"
                                            className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors duration-200"
                                            disabled={processing}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Return to the categories list
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300">
                                Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                This action cannot be undone. This will permanently delete the category{" "}
                                <strong>{category.name}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg"
                                disabled={processing}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
