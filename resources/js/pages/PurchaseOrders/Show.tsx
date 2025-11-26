"use client";

import AppLayout from "@/layouts/app-layout";
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Hash, Building2, Calendar, DollarSign, Tag, User, Clock } from "lucide-react";
import { translations } from "@/utils/translations/purchase_order/purchase_order";

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier: { name: string };
    order_date: string;
    total_amount: string;
    status: string;
    creator: { name: string };
    created_at: string;
    updated_at: string;
}

interface Props {
    purchaseOrder: PurchaseOrder;
    lang?: "kh" | "en";
}

const statusConfig = {
    draft: { color: 'text-gray-600', bg: 'bg-gray-100 text-gray-800' },
    sent: { color: 'text-blue-600', bg: 'bg-blue-100 text-blue-800' },
    confirmed: { color: 'text-green-600', bg: 'bg-green-100 text-green-800' },
    received: { color: 'text-purple-600', bg: 'bg-purple-100 text-purple-800' },
    cancelled: { color: 'text-red-600', bg: 'bg-red-100 text-red-800' },
};

export default function PurchaseOrdersShow({ purchaseOrder, lang = "kh" }: Props) {
    const t = translations[lang] || translations.en;
    const status = purchaseOrder.status as keyof typeof statusConfig;
    const statusStyle = statusConfig[status];

    // === Reusable Info Row ===
    const InfoRow = ({ icon: Icon, color, label, value }: { icon: any; color: string; label: string; value: string | React.ReactNode }) => (
        <div className="flex items-start gap-3">
            <Icon className={`h-5 w-5 ${color} mt-0.5`} />
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-base">{value}</p>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("purchase-orders.index") },
            { title: t.showTitle, href: "" },
        ]}>
            <Head title={t.showTitle} />
            <div className="p-6">
                <div className="max-w-1xl mx-auto">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <Hash className="h-8 w-8 text-purple-600" />
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{purchaseOrder.po_number}</CardTitle>
                                        <CardDescription className="text-base">{t.showTitle}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild size="sm" className="flex items-center gap-2">
                                        <Link href={route("purchase-orders.edit", purchaseOrder.id)}>
                                            <Edit className="h-4 w-4" />
                                            {t.showEdit}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild size="sm" className="flex items-center gap-2">
                                        <Link href={route("purchase-orders.index")}>
                                            <ArrowLeft className="h-4 w-4" />
                                            {t.showBack}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* PO Number */}
                                <InfoRow
                                    icon={Hash}
                                    color="text-purple-600"
                                    label={t.showPoNumber}
                                    value={purchaseOrder.po_number}
                                />

                                {/* Supplier */}
                                <InfoRow
                                    icon={Building2}
                                    color="text-indigo-600"
                                    label={t.showSupplier}
                                    value={purchaseOrder.supplier.name}
                                />

                                {/* Order Date */}
                                <InfoRow
                                    icon={Calendar}
                                    color="text-green-600"
                                    label={t.showOrderDate}
                                    value={new Date(purchaseOrder.order_date).toLocaleDateString()}
                                />

                                {/* Total Amount */}
                                <InfoRow
                                    icon={DollarSign}
                                    color="text-emerald-600"
                                    label={t.showTotalAmount}
                                    value={<span className="font-semibold">${purchaseOrder.total_amount}</span>}
                                />

                                {/* Status */}
                                <InfoRow
                                    icon={Tag}
                                    color={statusStyle.color}
                                    label={t.showStatus}
                                    value={
                                        <Badge
                                            className={`inline-flex items-center justify-center ${statusStyle.bg} font-medium px-2 py-0.5 text-sm whitespace-nowrap overflow-hidden`}
                                        >
                                            {t[`status_${status}`] || purchaseOrder.status}
                                        </Badge>
                                    }
                                />

                                {/* Created By */}
                                <InfoRow
                                    icon={User}
                                    color="text-orange-600"
                                    label={t.showCreatedBy}
                                    value={purchaseOrder.creator.name}
                                />
                            </div>

                            {/* Timestamps */}
                            <div className="border-t pt-4 flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{t.showCreatedAt}:</span>
                                    <span className="font-medium">{new Date(purchaseOrder.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{t.showUpdatedAt}:</span>
                                    <span className="font-medium">{new Date(purchaseOrder.updated_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
