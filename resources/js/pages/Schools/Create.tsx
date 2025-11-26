"use client";

import { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2Icon, X } from "lucide-react";
import { translations } from "@/utils/translations/school/school";

interface SchoolsCreateProps {
    flash?: { message?: string; type?: "success" | "error" };
    isSuperLibrarian?: boolean;
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
export default function SchoolsCreate({
                                          flash,
                                          isSuperLibrarian = false,
                                          lang = "kh",
                                      }: SchoolsCreateProps) {
    const t = translations["kh"];

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        address: "",
        contact: "",
        email: "",
        website: "",
    });

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("schools.store"), {
            onSuccess: () => setShowErrorAlert(false),
            onError: () => setShowErrorAlert(true),
        });
    };

    const closeError = () => setShowErrorAlert(false);
    const closeSuccess = () => setShowSuccessAlert(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle, href: route("schools.index") },
        { title: t.createBreadcrumb, href: "" },
    ];

    // Red Star for Required
    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <span>
            {children} <span className="text-red-500">*</span>
        </span>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.createTitle} />
            <div className={`p-6 lg:p-8 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
                            {t.createTitle}
                        </h1>

                        {/* Success */}
                        {showSuccessAlert && flash?.message && (
                            <Alert className="mb-6 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                        <div>
                                            <AlertTitle className="text-green-600 dark:text-green-400 font-semibold">
                                                {t.createNotification}
                                            </AlertTitle>
                                            <AlertDescription className="text-green-600 dark:text-green-400">
                                                {flash.message}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button onClick={closeSuccess} variant="ghost" size="icon">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        {/* Error */}
                        {showErrorAlert && Object.keys(errors).length > 0 && (
                            <Alert className="mb-6 bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <CheckCircle2Icon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                        <div>
                                            <AlertTitle className="text-red-600 dark:text-red-400 font-semibold">
                                                {t.createError}
                                            </AlertTitle>
                                            <AlertDescription className="text-red-600 dark:text-red-400">
                                                {Object.values(errors).join(", ")}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    <Button onClick={closeError} variant="ghost" size="icon">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Name - REQUIRED */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <RequiredLabel>{t.createName}</RequiredLabel>
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="name"
                                                maxLength={150}
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder={t.createNamePlaceholder}
                                                className={`w-full ${errors.name ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createNameTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Code - REQUIRED */}
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <RequiredLabel>{t.createCode}</RequiredLabel>
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="code"
                                                maxLength={20}
                                                value={data.code}
                                                onChange={(e) => setData("code", e.target.value)}
                                                placeholder={t.createCodePlaceholder}
                                                className={`w-full ${errors.code ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createCodeTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.code && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.code}</p>}
                            </div>

                            {/* Address - OPTIONAL */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.createAddress}
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Textarea
                                                id="address"
                                                maxLength={255}
                                                value={data.address}
                                                onChange={(e) => setData("address", e.target.value)}
                                                rows={3}
                                                placeholder={t.createAddressPlaceholder}
                                                className={`w-full ${errors.address ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createAddressTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.address && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.address}</p>}
                            </div>

                            {/* Contact - OPTIONAL */}
                            <div className="space-y-2">
                                <Label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.createContact}
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="contact"
                                                maxLength={20}
                                                value={data.contact}
                                                onChange={(e) => setData("contact", e.target.value)}
                                                placeholder={t.createContactPlaceholder}
                                                className={`w-full ${errors.contact ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createContactTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.contact && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.contact}</p>}
                            </div>

                            {/* Email - OPTIONAL */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.createEmail}
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="email"
                                                type="email"
                                                maxLength={100}
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                placeholder={t.createEmailPlaceholder}
                                                className={`w-full ${errors.email ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createEmailTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Website - OPTIONAL */}
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.createWebsite}
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="website"
                                                type="url"
                                                maxLength={255}
                                                value={data.website}
                                                onChange={(e) => setData("website", e.target.value)}
                                                placeholder={t.createWebsitePlaceholder}
                                                className={`w-full ${errors.website ? "border-red-500" : ""}`}
                                                disabled={processing}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createWebsiteTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {errors.website && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.website}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105"
                                            >
                                                {processing ? t.createCreating : t.createCreate}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createCreateTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("schools.index")}>
                                                <Button
                                                    variant="outline"
                                                    disabled={processing}
                                                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium"
                                                >
                                                    {t.createCancel}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.createCancelTooltip}
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
