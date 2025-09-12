"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2Icon, X } from "lucide-react";

interface CategoriesCreateProps {}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Categories",
        href: route("categories.index"),
    },
    {
        title: "Create",
        href: "",
    },
];

export default function CategoriesCreate({}: CategoriesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });
    const [showErrorAlert, setShowErrorAlert] = useState(!!Object.keys(errors).length);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("categories.store"), {
            data,
            onSuccess: () => {
                setData("name", "");
                setShowErrorAlert(false);
            },
            onError: () => {
                setShowErrorAlert(true);
            },
        });
    };

    const handleCloseAlert = () => setShowErrorAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
                        Create Category
                    </h1>
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-4 flex items-start justify-between bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 text-gray-800 dark:text-gray-100 border border-red-200 dark:border-red-700 rounded-xl">
                            <div className="flex gap-2">
                                <CheckCircle2Icon className="h-4 w-4 text-red-600 dark:text-red-300" />
                                <div>
                                    <AlertTitle className="text-red-600 dark:text-red-300">Error</AlertTitle>
                                    <AlertDescription className="text-gray-600 dark:text-gray-300">
                                        {Object.values(errors).join(", ")}
                                    </AlertDescription>
                                </div>
                            </div>
                            <Button
                                onClick={handleCloseAlert}
                                className="text-sm font-medium cursor-pointer text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                                disabled={processing}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Category Name
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="name"
                                            maxLength={100}
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder="Enter category name"
                                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${errors.name ? "border-red-500 dark:border-red-400" : "border-indigo-200 dark:border-indigo-600"} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200`}
                                            disabled={processing}
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? "name-error" : undefined}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Enter the name of the new category
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.name && (
                                <p id="name-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            {processing ? "Creating..." : "Create"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Save the new category
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
                                                Cancel
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Return to the categories list
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
