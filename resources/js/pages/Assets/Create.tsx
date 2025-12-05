'use client';

import AssetForm from '@/components/AssetForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { translations } from '@/utils/translations/asset/asset';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2Icon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    categories: { id: number; name: string }[];
    subcategories: { id: number; name: string; asset_category_id: number }[];
    departments: { id: number; name: string }[];
    rooms: { id: number; name: string }[];
    users: { id: number; name: string }[];
    purchaseOrders: {
        id: number;
        po_number: string;
        supplier?: { name: string };
    }[];
    flash?: { message?: string };
    lang?: 'en' | 'kh';
}

export default function AssetsCreate({
                                         categories,
                                         subcategories,
                                         departments,
                                         rooms,
                                         users,
                                         purchaseOrders = [],
                                         flash,
                                         lang = 'kh'
                                     }: Props) {
    const trans = translations[lang] ?? translations.en;

    const { data, setData, post, processing, errors, reset } = useForm({
        asset_tag: '',
        name: '',
        serial_number: '',
        model: '',
        asset_category_id: '',
        asset_subcategory_id: '',
        purchase_date: '',
        warranty_until: '',
        cost: '',
        condition: 'new',
        status: 'available',
        current_department_id: '',
        current_room_id: '',
        custodian_user_id: '',
        notes: '',
        purchase_order_id: '',
        image: null as File | null,// <-- NEW
    });

    const [showSuccess, setShowSuccess] = useState(!!flash?.message);
    const [showError, setShowError] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track dirtiness
    useEffect(() => {
        const hasChanges = Object.values(data).some((v) => v !== '' && v !== 'new' && v !== 'available');
        setIsDirty(hasChanges);
    }, [data]);

    // Prevent page leave
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Alerts
    useEffect(() => {
        setShowError(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccess(true);
    }, [errors, flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all text fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (key === 'image' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'image') {
                    formData.append(key, String(value));
                }
            }
        });

        // Convert IDs to numbers (only for non-null)
        const idFields = [
            'asset_category_id',
            'asset_subcategory_id',
            'current_department_id',
            'current_room_id',
            'custodian_user_id',
            'purchase_order_id',
        ];
        idFields.forEach(field => {
            if (data[field]) {
                formData.set(field, String(Number(data[field])));
            }
        });

        if (data.cost) {
            formData.set('cost', String(parseFloat(data.cost)));
        }

        post(route('assets.store'), {
            data: formData,
            forceFormData: true, // ← Critical for file uploads
            onSuccess: () => {
                reset();
                setIsDirty(false);
            },
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route('assets.index'));
    };


    // THIS IS THE ONLY LINE YOU NEED TO CHANGE
    const filteredSubcategories = useMemo(() => {
        // 1. Check if a category is even selected
        return data.asset_category_id
            ? // 2. If yes, filter the *full* subcategories list
              subcategories.filter(
                  (s) =>
                      // 3. Robustly compare the category IDs
                      Number(s.asset_category_id) === Number(data.asset_category_id),
              )
            : // 4. If no category is selected, return an empty array
              [];
    }, [data.asset_category_id, subcategories]); // Dependencies

    // ADD THIS useEffect RIGHT AFTER filteredSubcategories
    useEffect(() => {
        // This effect runs *whenever* data.asset_category_id changes
        if (data.asset_category_id) {
            // It resets the subcategory ID, clearing the selection
            setData((prev) => ({
                ...prev,
                asset_subcategory_id: '',
            }));
        }
    }, [data.asset_category_id]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: trans.assetsTitle, href: route('assets.index') },
                { title: trans.createAsset, href: '' },
            ]}
        >
            <Head title={trans.createAsset} />

            <div className="p-6">
                <div className="max-w-1xl mx-auto">
                    <div className="rounded-xl border bg-white p-8 shadow-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
                        <h1 className="mb-8 text-3xl font-bold">{trans.createAsset}</h1>

                        {/* Success */}
                        {showSuccess && flash?.message && (
                            <Alert className="mb-6 border-green-200 bg-green-50">
                                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                                <div>
                                    <AlertTitle>{trans.createSuccess}</AlertTitle>
                                    <AlertDescription>{flash.message}</AlertDescription>
                                </div>
                                <Button onClick={() => setShowSuccess(false)} variant="ghost" size="icon">
                                    <X className="h-4 w-4" />
                                </Button>
                            </Alert>
                        )}

                        {/* Error */}
                        {showError && (
                            <Alert className="mb-6 border-red-200 bg-red-50">
                                <AlertTitle>{trans.createError}</AlertTitle>
                                <AlertDescription>{Object.values(errors).slice(0, 3).join(', ')}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AssetForm
                                key={`form-${data.asset_category_id || 'init'}`}
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                subcategories={filteredSubcategories}
                                departments={departments}
                                rooms={rooms}
                                users={users}
                                purchaseOrders={purchaseOrders}
                            />

                            <div className="flex gap-4 border-t pt-6">
                                <Button type="submit" disabled={processing || !data.asset_tag || !data.name}>
                                    {processing ? trans.creating : trans.createButton}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                                    {trans.cancel}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Leave Dialog */}
            <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{trans.leaveTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{trans.leaveDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{trans.stay}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.visit(route('assets.index'))}>{trans.leave}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
