"use client";

import { useState, useEffect } from "react";
import { useForm, Link, router } from "@inertiajs/react";
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
import { translations } from "@/utils/translations/asset-category/asset-category";

interface AssetCategory {
    id: number;
    name: string;
}

interface AssetCategoriesEditProps {
    assetCategory: AssetCategory;
    flash?: { message?: string; type?: "success" | "error" };
    lang?: "kh" | "en";
}

const commonStyles = {
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton: "bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm",
    gradientBg: "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
    input: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500",
    error: "text-red-500 dark:text-red-400 text-sm mt-1",
};

export default function AssetCategoriesEdit({
                                                assetCategory,
                                                flash,
                                                lang = "kh",
                                            }: AssetCategoriesEditProps) {
    const t = translations[lang] || translations.en;
    const { data, setData, put, processing, errors } = useForm({
        name: assetCategory.name,
    });

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);

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

    const handleCloseAlert = () => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
    };

    const breadcrumbs = [
        { title: t.indexTitle, href: route("asset-categories.index") },
        { title: assetCategory.name, href: route("asset-categories.show", assetCategory.id) },
        { title: t.editBreadcrumb, href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.editTitle} />
            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            {t.editTitle}
                        </h1>

                        {/* Success Alert */}
                        {showSuccessAlert && flash?.message && (
                            <Alert className="mb-6 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <AlertTitle className="text-green-600 dark:text-green-400 font-semibold">
                                                {t.editNotification}
                                            </AlertTitle>
                                            <AlertDescription className="text-green-600 dark:text-green-400">
                                                {flash.message}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCloseAlert}
                                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 bg-transparent hover:bg-green-100 dark:hover:bg-green-800/50 p-1 rounded-full"
                                        disabled={processing}
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
                                            <AlertTitle className="text-red-600 dark:text-red-400 font-semibold">
                                                {t.editError}
                                            </AlertTitle>
                                            <AlertDescription className="text-red-600 dark:text-red-400">
                                                {Object.values(errors).join(", ")}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCloseAlert}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-800/50 p-1 rounded-full"
                                        disabled={processing}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-base text-gray-900 dark:text-gray-50"
                                >
                                    <span className="text-red-500">*</span> {t.editName}
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="name"
                                                maxLength={255}
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder={t.editNamePlaceholder}
                                                className={`${commonStyles.input} mt-2`}
                                                disabled={processing}
                                                aria-invalid={!!errors.name}
                                                aria-describedby={errors.name ? "name-error" : undefined}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.editNameTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.name && (
                                    <p id="name-error" className={commonStyles.error}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}
                                            >
                                                {processing ? t.editUpdating : t.editUpdate}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.editUpdateTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("asset-categories.show", assetCategory.id)}>
                                                <Button
                                                    variant="outline"
                                                    className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}
                                                    disabled={processing}
                                                >
                                                    {t.editCancel}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.editCancelTooltip}
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
