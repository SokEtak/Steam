"use client";

import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from '@inertiajs/react';
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
import { CheckCircle2Icon, X, ChevronDown, Package } from "lucide-react";
import { translations } from "@/utils/translations/asset-sub-category/asset-sub-category";
import { useForm } from '@inertiajs/react';

interface AssetCategory {
    id: number;
    name: string;
}

interface AssetSubCategoriesCreateProps {
    assetCategories: AssetCategory[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function AssetSubCategoriesCreate({
                                                     assetCategories,
                                                     flash,
                                                     lang = "en",
                                                 }: AssetSubCategoriesCreateProps) {
    const t = translations[lang] || translations.en;

    const initialFormData = {
        asset_category_id: "",
        name: "",
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [openCategory, setOpenCategory] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track form changes
    useEffect(() => {
        const hasChanges = Object.keys(data).some(k => data[k] !== initialFormData[k]);
        setIsDirty(hasChanges);
    }, [data]);

    // Prevent accidental navigation
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

    // Show alerts
    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    // Selected category name
    const selectedCategoryName = useMemo(() => {
        if (!data.asset_category_id) return null;
        return assetCategories.find(c => c.id.toString() === data.asset_category_id)?.name ?? null;
    }, [data.asset_category_id, assetCategories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("asset-sub-categories.store"), {
            onSuccess: () => {
                reset();
                setIsDirty(false);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route("asset-sub-categories.index"));
    };

    const breadcrumbs = [
        { title: t.indexTitle, href: route("asset-sub-categories.index") },
        { title: t.createBreadcrumb, href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.createTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8">{t.createTitle}</h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200">
                            <CheckCircle2Icon className="h-5 w-5 text-blue-600" />
                            <div>
                                <AlertTitle>{t.createNotification}</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccessAlert(false)} variant="ghost" size="icon">
                                <X />
                            </Button>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border-red-200">
                            <CheckCircle2Icon className="h-5 w-5 text-red-600" />
                            <div>
                                <AlertTitle>{t.createError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon">
                                <X />
                            </Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Category - Searchable */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createCategory}</label>
                            <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedCategoryName ?? t.createCategoryPlaceholder}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full" align="start">
                                    <Command>
                                        <CommandInput placeholder={t.createCategoryPlaceholder} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {assetCategories.length === 0
                                                    ? t.createCategoryEmpty
                                                    : t.createCategoryNoMatch}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {assetCategories.map(c => (
                                                    <CommandItem
                                                        key={c.id}
                                                        value={c.name}
                                                        onSelect={() => {
                                                            setData("asset_category_id", c.id.toString());
                                                            setOpenCategory(false);
                                                        }}
                                                    >
                                                        <Package className="mr-2 h-4 w-4 text-indigo-600" />
                                                        {c.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.asset_category_id && (
                                <p className="text-red-500 text-sm">{errors.asset_category_id}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.createName}</label>
                            <Input
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                placeholder={t.createNamePlaceholder}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? t.createCreating : t.createCreate}
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={processing}>
                                {t.createCancel}
                            </Button>
                        </div>
                    </form>

                    {/* Leave Confirmation */}
                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {lang === "kh" ? "តើអ្នកប្រាកដទេ?" : "Are you sure?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {lang === "kh"
                                        ? "អ្នកមានការផ្លាស់ប្តូរដែលមិនបានរក្សាទុក។"
                                        : "You have unsaved changes."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.createCancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.visit(route("asset-sub-categories.index"))}>
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
