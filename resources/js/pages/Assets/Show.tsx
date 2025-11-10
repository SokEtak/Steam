// resources/js/Pages/Assets/Show.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { translations } from '@/utils/translations/asset/asset';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

type Asset = {
    id: number;
    name: string;
    asset_tag: string;
    serial_number?: string;
    model?: string;
    status: string;
    condition: string;
    cost: number;
    purchase_date: string;
    warranty_until?: string;
    notes?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    category?: { id: number; name: string };
    sub_category?: { id: number; name: string };
    department?: { id: number; name: string };
    room?: { id: number; name: string };
    custodian?: { id: number; name: string };
};

interface AssetShowProps {
    asset: Asset;
    lang?: 'en' | 'kh';
}

// translation lookup will be provided from shared translations file

// --- Function 1: Date Only ---
// Used for Purchase Date, Warranty
const formatDate = (date?: string | null) => {
    if (!date) {
        return '—';
    }
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// --- Function 2: Date and Time ---
// Used for Timestamps (Created At, Updated At)
const formatDateTime = (date?: string | null) => {
    if (!date) {
        return '—';
    }
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
// --- END UPDATE ---

export default function AssetsShow({ asset, lang = 'en' }: AssetShowProps) {
    const trans = translations[lang] ?? translations.en;

    return (
        <AppLayout
            breadcrumbs={[
                { title: trans.assetsTitle, href: route('assets.index') },
                { title: asset.asset_tag, href: '' },
            ]}
        >
            <Head title={asset.asset_tag} />

            <div className="p-6">
                <div className="max-w-1xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{asset.name}</CardTitle>
                                    <CardDescription>{trans.assetDetails}</CardDescription>
                                </div>

                                <div className="space-x-2">
                                    <Button asChild>
                                        <Link href={route('assets.edit', asset.id)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            {trans.edit}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={route('assets.index')}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            {trans.backToAssets}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* Add inside the grid */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.purchaseOrder}</p>
                                    <p className="font-medium">
                                        {asset.purchase_order ? (
                                            <Link
                                                href={route('purchase-orders.show', asset.purchase_order.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {asset.purchase_order.po_number}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </p>
                                </div>

                                {/* Serial & Model */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.serialNumber}</p>
                                    <p className="font-medium">{asset.serial_number || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{trans.model}</p>
                                    <p className="font-medium">{asset.model || '—'}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.category}</p>
                                    <p className="font-medium">
                                        {asset.category ? (
                                            <Link href={route('asset-categories.show', asset.category.id)} className="text-blue-600 hover:underline">
                                                {asset.category.name}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </p>
                                </div>

                                {/* Subcategory */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.subcategory}</p>
                                    <p className="font-medium">
                                        {asset.sub_category ? (
                                            <Link
                                                href={route('asset-sub-categories.show', asset.sub_category.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {asset.sub_category.name}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </p>
                                </div>

                                {/* Status */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.status}</p>
                                    <div className="inline-block min-w-0">
                                        <Badge
                                            variant={asset.status === 'available' ? 'default' : 'secondary'}
                                            className="max-w-full overflow-hidden px-2 py-0.5 text-xs text-ellipsis whitespace-nowrap"
                                        >
                                            {asset.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Condition */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.condition}</p>
                                    <div className="inline-block min-w-0">
                                        <Badge
                                            variant={asset.condition === 'new' ? 'default' : 'secondary'}
                                            className="max-w-full overflow-hidden px-2 py-0.5 text-xs text-ellipsis whitespace-nowrap"
                                        >
                                            {asset.condition}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Purchase Date (uses formatDate - date only) */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.purchaseDate}</p>
                                    <p className="font-medium">{formatDate(asset.purchase_date)}</p>
                                </div>

                                {/* Warranty (uses formatDate - date only) */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.warrantyUntil}</p>
                                    <p className="font-medium">{formatDate(asset.warranty_until)}</p>
                                </div>

                                {/* Cost */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.cost}</p>
                                    <p className="font-medium">${Number(asset.cost).toFixed(2)}</p>
                                </div>

                                {/* Department / Room / Custodian */}
                                <div>
                                    <p className="text-sm text-gray-500">{trans.currentDepartment}</p>
                                    <p className="font-medium">{asset.department?.name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{trans.room}</p>
                                    <p className="font-medium">{asset.room?.name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{trans.custodian}</p>
                                    <p className="font-medium">
                                        {asset.custodian ? (
                                            <Link
                                                // Note: Change "custodians.show" if your route is named differently (e.g., "users.show")
                                                href={route('users.show', asset.custodian.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {asset.custodian.name}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            {asset.notes && (
                                <div className="mt-6 border-t pt-6">
                                    <p className="text-sm text-gray-500">{trans.notes}</p>
                                    <p className="mt-2 whitespace-pre-wrap">{asset.notes}</p>
                                </div>
                            )}

                            {/* Timestamps (uses formatDateTime - with time) */}
                            <div className="border-t pt-6 text-sm text-gray-500">
                                <p>
                                    {trans.created}: {formatDateTime(asset.created_at)}
                                </p>
                                <p>
                                    {trans.updated}: {formatDateTime(asset.updated_at)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
