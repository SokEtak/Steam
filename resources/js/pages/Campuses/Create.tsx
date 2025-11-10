"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2Icon, X } from "lucide-react";
import { translations } from "@/utils/translations/campus/campus";

interface School {
    id: number;
    name: string;
}

interface CampusesCreateProps {
    schools: School[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function CampusesCreate({ schools, flash, lang = "kh" }: CampusesCreateProps) {
    const t = translations[lang] || translations.en;

    const { data, setData, post, processing, errors, reset } = useForm({
        school_id: "",
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
        post(route("campuses.store"), {
            onSuccess: () => {
                reset();
                setShowErrorAlert(false);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const closeSuccess = () => setShowSuccessAlert(false);
    const closeError = () => setShowErrorAlert(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle, href: route("campuses.index") },
        { title: t.createBreadcrumb, href: "" },
    ];

    // Helper: Label with red asterisk for required fields
    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <span>
            {children} <span className="text-red-500">*</span>
        </span>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.createTitle} />

            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">

                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">{t.createTitle}</h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <CheckCircle2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <AlertTitle className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {t.createNotification}
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
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

                    {/* Error Alert */}
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700">
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

                        {/* School - REQUIRED */}
                        <div className="space-y-2">
                            <label htmlFor="school_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <RequiredLabel>{t.createSchool}</RequiredLabel>
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Select
                                            value={data.school_id}
                                            onValueChange={(v) => setData("school_id", v)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger
                                                id="school_id"
                                                className={`w-full ${errors.school_id ? "border-red-500 dark:border-red-400" : ""}`}
                                            >
                                                <SelectValue placeholder={t.createSchoolPlaceholder} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schools.map((s) => (
                                                    <SelectItem key={s.id} value={String(s.id)}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createSchoolTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.school_id && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.school_id}</p>
                            )}
                        </div>

                        {/* Name - REQUIRED */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <RequiredLabel>{t.createCampusName}</RequiredLabel>
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="name"
                                            maxLength={150}
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder={t.createCampusNamePlaceholder}
                                            className={`w-full ${errors.name ? "border-red-500 dark:border-red-400" : ""}`}
                                            disabled={processing}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createCampusNameTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Code - REQUIRED */}
                        <div className="space-y-2">
                            <label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <RequiredLabel>{t.createCampusCode}</RequiredLabel>
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="code"
                                            maxLength={20}
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder={t.createCampusCodePlaceholder}
                                            className={`w-full ${errors.code ? "border-red-500 dark:border-red-400" : ""}`}
                                            disabled={processing}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createCampusCodeTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.code && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.code}</p>}
                        </div>

                        {/* Address - OPTIONAL */}
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.createAddress}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="address"
                                            maxLength={255}
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            placeholder={t.createAddressPlaceholder}
                                            className={`w-full ${errors.address ? "border-red-500 dark:border-red-400" : ""}`}
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
                            <label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.createContact}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="contact"
                                            maxLength={20}
                                            value={data.contact}
                                            onChange={(e) => setData("contact", e.target.value)}
                                            placeholder={t.createContactPlaceholder}
                                            className={`w-full ${errors.contact ? "border-red-500 dark:border-red-400" : ""}`}
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
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.createEmail}
                            </label>
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
                                            className={`w-full ${errors.email ? "border-red-500 dark:border-red-400" : ""}`}
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
                            <label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.createWebsite}
                            </label>
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
                                            className={`w-full ${errors.website ? "border-red-500 dark:border-red-400" : ""}`}
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
                                        <Link href={route("campuses.index")}>
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
        </AppLayout>
    );
}
