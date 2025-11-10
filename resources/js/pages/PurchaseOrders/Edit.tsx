"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2Icon, X, Hash, Building2, Calendar, DollarSign, Tag, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { translations } from "@/utils/translations/purchase_order/purchase_order";

interface Supplier {
    id: number;
    name: string;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier_id: number;
    order_date: string;
    total_amount: number;
    status: string;
}

interface Props {
    purchase_order: PurchaseOrder;
    suppliers: Supplier[];
    flash?: { message?: string };
    lang?: "kh" | "en";
}

export default function PurchaseOrdersEdit({ purchase_order, suppliers, flash, lang = "en" }: Props) {
    const t = translations[lang] || translations.en;

    const { data, setData, put, processing, errors, reset, isDirty } = useForm({
        po_number: purchase_order.po_number,
        supplier_id: String(purchase_order.supplier_id), // Convert to string for Select component
        order_date: purchase_order.order_date ? purchase_order.order_date.substring(0, 10) : "",
        total_amount: String(purchase_order.total_amount), // Convert to string for Input
        status: purchase_order.status,
    });

    // Separate form for delete operation to have its own processing state
    const { delete: destroy, processing: deleteProcessing } = useForm({});

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Use Inertia's isDirty, no need for manual useEffect
    const isFormDirty = isDirty;

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty) { e.preventDefault(); e.returnValue = ""; }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isFormDirty]);

    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("purchase-orders.update", purchase_order.id), {
            onSuccess: () => {
                reset(); // Resets form to new initial values
                setShowSuccessAlert(true);
            },
            onError: () => setShowErrorAlert(true),
        });
    };

    const handleCancel = () => {
        if (isFormDirty) setShowLeaveDialog(true);
        else router.visit(route("purchase-orders.index"));
    };

    const handleDelete = () => {
        destroy(route("purchase-orders.destroy", purchase_order.id), {
            onFinish: () => setShowDeleteDialog(false),
            // onSuccess will likely be a redirect from the controller
        });
    };

    // === Dynamic Icon + Color ===
    const FieldWrapper = ({ icon: Icon, color, children }: { icon: any; color: string; children: React.ReactNode }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="font-medium">
                    <span className="text-red-500">*</span> {children}
                </label>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("purchase-orders.index") },
            { title: `${t.editBreadcrumb} #${purchase_order.po_number}`, href: "" },
        ]}>
            <Head title={t.editTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
                        {t.editTitle}
                    </h1>

                    {/* Success Alert */}
                    {showSuccessAlert && flash?.message && (
                        <Alert className="mb-6 bg-green-50 dark:bg-green-900/50 border-green-200">
                            <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                            <div>
                                <AlertTitle>{t.editNotification}</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccessAlert(false)} variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-5 w-5" />
                            <div>
                                <AlertTitle>{t.editError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).join(", ")}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowErrorAlert(false)} variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PO Number */}
                        <FieldWrapper icon={Hash} color="text-purple-600">
                            {t.po_number}
                        </FieldWrapper>
                        <Input
                            value={data.po_number}
                            onChange={e => setData("po_number", e.target.value)}
                            placeholder={t.poNumberPlaceholder}
                            className=""
                        />
                        {errors.po_number && <p className="text-red-500 text-sm">{errors.po_number}</p>}

                        {/* Supplier */}
                        <FieldWrapper icon={Building2} color="text-indigo-600">
                            {t.supplier_id}
                        </FieldWrapper>
                        <Select value={data.supplier_id} onValueChange={v => setData("supplier_id", v)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder={t.supplier_id} />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-indigo-600" />
                                            {s.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.supplier_id && <p className="text-red-500 text-sm">{errors.supplier_id}</p>}

                        {/* Order Date + Total Amount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FieldWrapper icon={Calendar} color="text-green-600">
                                    {t.order_date}
                                </FieldWrapper>
                                <Input
                                    type="date"
                                    value={data.order_date}
                                    onChange={e => setData("order_date", e.target.value)}
                                    className="mt-2"
                                />
                                {errors.order_date && <p className="text-red-500 text-sm">{errors.order_date}</p>}
                            </div>

                            <div>
                                <FieldWrapper icon={DollarSign} color="text-emerald-600">
                                    {t.total_amount}
                                </FieldWrapper>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.total_amount}
                                    onChange={e => setData("total_amount", e.target.value)}
                                    placeholder="0.00"
                                    className="mt-2"
                                />
                                {errors.total_amount && <p className="text-red-500 text-sm">{errors.total_amount}</p>}
                            </div>
                        </div>

                        {/* Status */}
                        <FieldWrapper icon={Tag} color="text-orange-600">
                            {t.status}
                        </FieldWrapper>
                        <Select value={data.status} onValueChange={v => setData("status", v)}>
                            <SelectTrigger className="">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {['draft', 'sent', 'confirmed', 'received', 'cancelled'].map(s => (
                                    <SelectItem key={s} value={s}>
                                        <div className="flex items-center gap-2">
                                            <Tag className={`h-4 w-4 ${s === 'draft' ? 'text-gray-600' : s === 'sent' ? 'text-blue-600' : s === 'confirmed' ? 'text-green-600' : s === 'received' ? 'text-purple-600' : 'text-red-600'}`} />
                                            {t[`status_${s}`]}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-8">
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing || deleteProcessing || !isFormDirty}
                                    className="flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            {t.editSaving}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2Icon className="h-4 w-4" />
                                            {t.editSave}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={processing || deleteProcessing}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {t.createReturnToIndex}
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={processing || deleteProcessing}
                                className="flex items-center gap-2"
                            >
                                {deleteProcessing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        {t.deleteProcessing}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        {t.delete}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Leave Dialog */}
                    <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.unsavedChangesTitle}</AlertDialogTitle>
                                <AlertDialogDescription>{t.unsavedChangesMessage}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.createCancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.visit(route("purchase-orders.index"))}>
                                    {t.leavePage}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete Dialog */}
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>{t.deleteConfirmMessage}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.createCancel}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {t.delete}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
