"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2Icon, X } from "lucide-react";
import { translations } from "@/utils/translations/supplier/supplier";
import { useForm } from '@inertiajs/react';

interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
}

interface SuppliersEditProps {
    supplier: Supplier;
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function SuppliersEdit({ supplier, flash, lang = "en" }: SuppliersEditProps) {
    const t = translations[lang] || translations.en;

    const initialFormData = {
        name: supplier.name,
        contact_person: supplier.contact_person || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
    };

    const { data, setData, put, processing, errors, reset } = useForm(initialFormData);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // === Track form changes ===
    useEffect(() => {
        const hasChanges = Object.keys(data).some(k => data[k] !== initialFormData[k]);
        setIsDirty(hasChanges);
    }, [data, initialFormData]);

    // === Prevent tab close with unsaved changes ===
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

    // === Show alerts ===
    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash]);

    // === Submit ===
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("suppliers.update", supplier.id), {
            onSuccess: () => {
                reset();
                setIsDirty(false);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    // === Cancel ===
    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route("suppliers.show", supplier.id));
    };

    // === Button disabled when no changes OR processing OR name empty ===
    const isUpdateDisabled = processing || !isDirty || !data.name.trim();

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("suppliers.index") },
            { title: t.showTitle, href: route("suppliers.show", supplier.id) },
            { title: t.editBreadcrumb, href: "" },
        ]}>
            <Head title={t.editTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8">{t.editTitle}</h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border-blue-200">
                            <CheckCircle2Icon className="h-5 w-5 text-blue-600" />
                            <div>
                                <AlertTitle>{t.editNotification}</AlertTitle>
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
                                <AlertTitle>{t.editError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon">
                                <X />
                            </Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label><span className="text-red-500">*</span> {t.name}</label>
                            <Input
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                placeholder={t.editNamePlaceholder}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Contact + Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>{t.contact_person}</label>
                                <Input
                                    value={data.contact_person}
                                    onChange={e => setData("contact_person", e.target.value)}
                                    placeholder={t.contactPlaceholder}
                                />
                            </div>
                            <div className="space-y-2">
                                <label>{t.phone}</label>
                                <Input
                                    value={data.phone}
                                    onChange={e => setData("phone", e.target.value)}
                                    placeholder={t.phonePlaceholder}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label>{t.email}</label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData("email", e.target.value)}
                                placeholder={t.emailPlaceholder}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label>{t.address}</label>
                            <Textarea
                                value={data.address}
                                onChange={e => setData("address", e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isUpdateDisabled}
                                className={isUpdateDisabled ? "opacity-50" : ""}
                            >
                                {processing ? t.editUpdating : t.editUpdate}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={processing}
                            >
                                {t.editCancel}
                            </Button>
                        </div>
                    </form>

                    {/* Leave Dialog */}
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
                                <AlertDialogCancel>{t.editCancel}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => router.visit(route("suppliers.show", supplier.id))}
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
