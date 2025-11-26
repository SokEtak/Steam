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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { ChevronDown, Package } from "lucide-react";
interface School {
    id: number;
    name: string;
}

interface Campus {
    id: number;
    school_id: number;
    name: string;
    code: string;
    address: string | null;
    contact: string | null;
    email: string | null;
    website: string | null;
}

interface CampusesEditProps {
    campus: Campus;
    schools: School[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function CampusesEdit({ campus, schools, flash, lang = "kh" }: CampusesEditProps) {
    const t = translations["kh"];

    const { data, setData, put, processing, errors } = useForm({
        school_id: String(campus.school_id),
        name: campus.name ?? "",
        code: campus.code ?? "",
        address: campus.address ?? "",
        contact: campus.contact ?? "",
        email: campus.email ?? "",
        website: campus.website ?? "",
    });

    const [openSchool, setOpenSchool] = useState(false);
    const [selectedSchoolName, setSelectedSchoolName] = useState(
        schools.find(s => s.id === campus.school_id)?.name ?? null
    );
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("campuses.update", campus.id), {
            onError: () => setShowErrorAlert(true),
        });
    };

    const closeSuccess = () => setShowSuccessAlert(false);
    const closeError = () => setShowErrorAlert(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle, href: route("campuses.index") },
        { title: t.editBreadcrumb, href: "" },
    ];

    // Helper: Label with red asterisk
    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <span>
            {children} <span className="text-red-500">*</span>
        </span>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.editTitle} />

            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">

                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">{t.editTitle}</h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <CheckCircle2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <AlertTitle className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {t.editNotification}
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
                                            {t.editError}
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

                        {/* School - REQUIRED (Popover/Command version) */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.editSchool}</label>

                            <Popover open={openSchool} onOpenChange={setOpenSchool}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedSchoolName ?? t.editSchoolPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align="start">
                                    <Command>
                                        <CommandInput placeholder={t.editSchoolPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {schools.length === 0
                                                    ? "មិនមានទិន្នន័យ។"
                                                    : "រកមិនឃើញសាលាដែលផ្គូផ្គង"}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {schools.map((s) => (
                                                    <CommandItem
                                                        key={s.id}
                                                        value={s.name}
                                                        onSelect={() => {
                                                            setData("school_id", s.id.toString());
                                                            setSelectedSchoolName(s.name);
                                                            setOpenSchool(false);
                                                        }}
                                                    >
                                                        <Package className="mr-2 h-4 w-4 text-indigo-600" />
                                                        {s.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {errors.school_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.school_id}</p>
                            )}
                        </div>

                        {/* Name - REQUIRED */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <RequiredLabel>{t.editCampusName}</RequiredLabel>
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="name"
                                            maxLength={150}
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder={t.editCampusNamePlaceholder}
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
                                <RequiredLabel>{t.editCampusCode}</RequiredLabel>
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="code"
                                            maxLength={20}
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder={t.editCampusCodePlaceholder}
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
                                {t.editAddress}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="address"
                                            maxLength={255}
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            placeholder={t.editAddressPlaceholder}
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
                                {t.editContact}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="contact"
                                            maxLength={20}
                                            value={data.contact}
                                            onChange={(e) => setData("contact", e.target.value)}
                                            placeholder={t.editContactPlaceholder}
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
                                {t.editEmail}
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
                                            placeholder={t.editEmailPlaceholder}
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
                                {t.editWebsite}
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
                                            placeholder={t.editWebsitePlaceholder}
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
                                        <Link href={route("campuses.index")}>
                                            <Button
                                                variant="outline"
                                                disabled={processing}
                                                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium"
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
        </AppLayout>
    );
}
