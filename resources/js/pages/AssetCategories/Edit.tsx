"use client";

import { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2Icon, X } from "lucide-react";

interface AssetCategory {
    id: number;
    name: string;
}

interface AssetCategoriesEditProps {
    assetCategory: AssetCategory;
    flash?: { message?: string; type?: "success" | "error" };
}

const commonStyles = {
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    indigoButton:
        "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton:
        "bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm",
    gradientBg:
        "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
    input: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500",
    error: "text-red-500 dark:text-red-400 text-sm mt-1",
};

export default function AssetCategoriesEdit({
                                                assetCategory,
                                                flash,
                                            }: AssetCategoriesEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: assetCategory.name,
    });

    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
    }, [errors]);

    useEffect(() => {
        setShowSuccessAlert(!!flash?.message);
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("asset-categories.update", assetCategory.id), {
            onSuccess: () => setShowErrorAlert(false),
            onError: () => setShowErrorAlert(true),
        });
    };

    const closeAlerts = () => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
    };

    const breadcrumbs = [
        { title: "ប្រភេទទ្រព្យសម្បត្តិ", href: route("asset-categories.index") },
        { title: assetCategory.name, href: route("asset-categories.show", assetCategory.id) },
        { title: "កែប្រែ", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="កែប្រែប្រភេទទ្រព្យសម្បត្តិ" />

            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            កែប្រែប្រភេទទ្រព្យសម្បត្តិ
                        </h1>

                        {/* Success Alert */}
                        {showSuccessAlert && flash?.message && (
                            <Alert className="mb-6 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <AlertTitle className="font-semibold text-green-600 dark:text-green-400">
                                                បានរក្សាទុកជោគជ័យ
                                            </AlertTitle>
                                            <AlertDescription>{flash.message}</AlertDescription>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={closeAlerts}
                                        className="text-green-600 dark:text-green-400 bg-transparent hover:bg-green-100 dark:hover:bg-green-800/50 p-1 rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        {/* Error Alert */}
                        {showErrorAlert && Object.keys(errors).length > 0 && (
                            <Alert className="mb-6 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <CheckCircle2Icon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                        <div>
                                            <AlertTitle className="font-semibold text-red-600 dark:text-red-400">
                                                មានបញ្ហាក្នុងការកែប្រែ
                                            </AlertTitle>
                                            <AlertDescription>
                                                {Object.values(errors).join(", ")}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={closeAlerts}
                                        className="text-red-600 dark:text-red-400 bg-transparent hover:bg-red-100 dark:hover:bg-red-800/50 p-1 rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="text-base text-gray-900 dark:text-gray-50">
                                    <span className="text-red-500">*</span> ឈ្មោះប្រភេទទ្រព្យសម្បត្តិ
                                </Label>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="name"
                                                maxLength={255}
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="បញ្ចូលឈ្មោះប្រភេទទ្រព្យសម្បត្តិ"
                                                className={`${commonStyles.input} mt-2`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            សូមបញ្ចូលឈ្មោះប្រភេទទ្រព្យសម្បត្តិ
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {errors.name && (
                                    <p className={commonStyles.error}>{errors.name}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-8">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}
                                            >
                                                {processing ? "កំពុងកែប្រែ..." : "កែប្រែ"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            រក្សាទុកការកែប្រែ
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("asset-categories.show", assetCategory.id)}>
                                                <Button
                                                    variant="outline"
                                                    disabled={processing}
                                                    className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}
                                                >
                                                    បោះបង់
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            ត្រឡប់ទៅទំព័រមុន
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
