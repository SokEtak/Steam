"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { CheckCircle2Icon, X, ChevronDown, Building2 } from "lucide-react";
import { translations } from "@/utils/translations/building/building";

interface Campus {
    id: number;
    name: string;
}

interface Building {
    id: number;
    campus_id: number;
    name: string;
    code: string;
    floors: number;
    campus: Campus;
}

interface BuildingsEditProps {
    building: Building;
    campuses: Campus[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function BuildingsEdit({ building, campuses, flash, lang = "kh" }: BuildingsEditProps) {
    const t = translations["kh"];

    const initialFormData = {
        campus_id: String(building.campus_id),
        name: building.name,
        code: building.code,
        floors: String(building.floors),
    };

    const { data, setData, put, processing, errors } = useForm(initialFormData);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [openCampus, setOpenCampus] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track form changes
    useEffect(() => {
        const hasChanges = Object.keys(data).some(
            (key) => data[key as keyof typeof data] !== initialFormData[key as keyof typeof initialFormData]
        );
        setIsDirty(hasChanges);
    }, [data]);

    // Prevent accidental refresh/navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("buildings.update", building.id), {
            onSuccess: () => {
                setIsDirty(false);
                setShowErrorAlert(false);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isDirty) {
            setShowLeaveDialog(true);
        } else {
            router.visit(route("buildings.index"));
        }
    };

    const confirmLeave = () => {
        setShowLeaveDialog(false);
        router.visit(route("buildings.index"));
    };

    const closeSuccess = () => setShowSuccessAlert(false);
    const closeError = () => setShowErrorAlert(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle, href: route("buildings.index") },
        { title: t.editBreadcrumb, href: "" },
    ];

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

                        {/* Campus - SEARCHABLE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span className="text-red-500">*</span> {t.createCampus}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Popover open={openCampus} onOpenChange={setOpenCampus}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCampus}
                                                    className={`w-full justify-between px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${
                                                        errors.campus_id
                                                            ? "border-red-500 dark:border-red-400"
                                                            : "border-gray-300 dark:border-gray-600"
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300`}
                                                    disabled={processing}
                                                >
                                                    {data.campus_id && campuses.find(c => c.id.toString() === data.campus_id)?.name
                                                        || t.createCampusPlaceholder}
                                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                side="bottom"
                                                align="start"
                                                sideOffset={2}
                                                className="w-full p-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                            >
                                                <Command>
                                                    <CommandInput placeholder={t.createCampusPlaceholder} className="h-10" />
                                                    <CommandList>
                                                        <CommandEmpty>{t.createCampusEmpty || "No campus found."}</CommandEmpty>
                                                        <CommandGroup>
                                                            {campuses.map((campus) => (
                                                                <CommandItem
                                                                    key={campus.id}
                                                                    value={campus.name}
                                                                    onSelect={() => {
                                                                        setData("campus_id", campus.id.toString());
                                                                        setOpenCampus(false);
                                                                    }}
                                                                >
                                                                    <Building2 className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                                    {campus.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createCampusTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.campus_id && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.campus_id}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span className="text-red-500">*</span> {t.createBuildingName}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder={t.createBuildingNamePlaceholder}
                                            className={`w-full ${errors.name ? "border-red-500 dark:border-red-400" : ""}`}
                                            disabled={processing}
                                            maxLength={255}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createBuildingNameTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span className="text-red-500">*</span> {t.createBuildingCode}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder={t.createBuildingCodePlaceholder}
                                            className={`w-full ${errors.code ? "border-red-500 dark:border-red-400" : ""}`}
                                            disabled={processing}
                                            maxLength={50}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createBuildingCodeTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.code && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.code}</p>}
                        </div>

                        {/* Floors */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span className="text-red-500">*</span> {t.createFloors}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            type="number"
                                            value={data.floors}
                                            onChange={(e) => setData("floors", e.target.value)}
                                            placeholder={t.createFloorsPlaceholder}
                                            className={`w-full ${errors.floors ? "border-red-500 dark:border-red-400" : ""}`}
                                            disabled={processing}
                                            min={1}
                                            max={200}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createFloorsTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.floors && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.floors}</p>}
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
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={processing}
                                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium"
                                        >
                                            {t.editCancel}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.editCancelTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>

                    {/* Unsaved Changes Dialog */}
                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300">
                                    {lang === "kh" ? "តើអ្នកប្រាកដទេ?" : "Are you sure?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                    {lang === "kh"
                                        ? "អ្នកមានការផ្លាស់ប្តូរដែលមិនបានរក្សាទុក។ ចាកចេញនឹងបាត់បង់ការផ្លាស់ប្តូរទាំងនេះ។"
                                        : "You have unsaved changes. Leaving will discard these changes."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg">
                                    {t.editCancel}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmLeave}
                                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg"
                                >
                                    {lang === "kh" ? "ចាកចេញ" : "Leave"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
