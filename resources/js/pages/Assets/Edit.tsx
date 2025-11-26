'use client';

import AssetForm from '@/components/AssetForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { translations } from '@/utils/translations/asset/asset';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2Icon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    asset: {
        id: number;
        asset_tag: string;
        name: string;
        serial_number?: string;
        model?: string;
        asset_category_id?: number;
        asset_subcategory_id?: number;
        purchase_order_id?: number;
        purchase_date?: string;
        warranty_until?: string;
        cost?: number;
        condition: string;
        status: string;
        current_department_id?: number;
        current_room_id?: number;
        custodian_user_id?: number;
        notes?: string;
    };
    categories: { id: number; name: string }[];
    subcategories: { id: number; name: string; asset_category_id: number }[];
    departments: { id: number; name: string }[];
    rooms: { id: number; name: string }[];
    users: { id: number; name: string }[];
    purchaseOrders: { id: number; po_number: string; supplier?: { name: string }; total_cost?: number }[];
    flash?: { message?: string };
    lang?: 'en' | 'kh';
}

export default function AssetsEdit({
                                       asset,
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

    const { data, setData, put, processing, errors, reset } = useForm({
        asset_tag: asset.asset_tag || '',
        name: asset.name || '',
        serial_number: asset.serial_number || '',
        model: asset.model || '',
        asset_category_id: asset.asset_category_id?.toString() || '',
        asset_subcategory_id: asset.asset_subcategory_id?.toString() || '',
        purchase_order_id: asset.purchase_order_id?.toString() || '',
        purchase_date: asset.purchase_date?.split('T')[0] || '',
        warranty_until: asset.warranty_until?.split('T')[0] || '',
        cost: asset.cost?.toString() || '',
        condition: asset.condition || 'new',
        status: asset.status || 'available',
        current_department_id: asset.current_department_id?.toString() || '',
        current_room_id: asset.current_room_id?.toString() || '',
        custodian_user_id: asset.custodian_user_id?.toString() || '',
        notes: asset.notes || '',
    });

    const [showSuccess, setShowSuccess] = useState(!!flash?.message);
    const [showError, setShowError] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        const original = { ...asset, purchase_order_id: asset.purchase_order_id?.toString() };
        const hasChanges = JSON.stringify(data) !== JSON.stringify(original);
        setIsDirty(hasChanges);
    }, [data, asset]);

    // Prevent leaving
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) { e.preventDefault(); e.returnValue = ''; }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    // Alerts
    useEffect(() => {
        setShowError(Object.keys(errors).length > 0);
        if (flash?.message) setShowSuccess(true);
    }, [errors, flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            asset_category_id: data.asset_category_id ? Number(data.asset_category_id) : null,
            asset_subcategory_id: data.asset_subcategory_id ? Number(data.asset_subcategory_id) : null,
            purchase_order_id: data.purchase_order_id ? Number(data.purchase_order_id) : null,
            current_department_id: data.current_department_id ? Number(data.current_department_id) : null,
            current_room_id: data.current_room_id ? Number(data.current_room_id) : null,
            custodian_user_id: data.custodian_user_id ? Number(data.custodian_user_id) : null,
            cost: data.cost ? parseFloat(data.cost) : null,
        };

        put(route('assets.update', asset.id), {
            data: payload,
            onSuccess: () => setIsDirty(false),
        });
    };

    const handleCancel = () => {
        if (isDirty) setShowLeaveDialog(true);
        else router.visit(route('assets.index'));
    };

    const filteredSubcategories = useMemo(() => {
        return data.asset_category_id
            ? subcategories.filter(s => Number(s.asset_category_id) === Number(data.asset_category_id))
            : [];
    }, [data.asset_category_id, subcategories]);

    useEffect(() => {
        if (data.asset_category_id && !filteredSubcategories.some(s => s.id === Number(data.asset_subcategory_id))) {
            setData(prev => ({ ...prev, asset_subcategory_id: '' }));
        }
    }, [data.asset_category_id, filteredSubcategories]);

    return (
        <AppLayout breadcrumbs={[
            { title: trans.assetsTitle, href: route('assets.index') },
            { title: trans.editAsset, href: '' },
        ]}>
            <Head title={trans.editAsset} />

            <div className="p-6">
                <div className="max-w-1xl mx-auto">
                <div className="rounded-xl border bg-white p-8 shadow-lg">
                    <h1 className="mb-8 text-3xl font-bold">{trans.editAsset}</h1>

                    {showSuccess && flash?.message && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                            <div>
                                <AlertTitle>{trans.updateSuccess}</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                            <Button onClick={() => setShowSuccess(false)} variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}

                    {showError && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertTitle>{trans.createError}</AlertTitle>
                            <AlertDescription>{Object.values(errors).slice(0, 3).join(', ')}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AssetForm
                            key={data.asset_category_id}
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
                            <Button type="submit" disabled={processing || !isDirty}>
                                {processing ? trans.updating : trans.updateButton}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                                {trans.cancel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            </div>

            <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertTitle>{trans.leaveTitle}</AlertTitle>
                        <AlertDescription>{trans.leaveDesc}</AlertDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{trans.stay}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.visit(route('assets.index'))}>
                            {trans.leave}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
