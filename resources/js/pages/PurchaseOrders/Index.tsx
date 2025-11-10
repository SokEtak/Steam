"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { translations } from '@/utils/translations/purchase_order/purchase_order';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowUpDown, Eye, Pencil, Trash2, MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier: { id: number; name: string };
    order_date: string;
    total_amount: string;
    status: string;
    creator: { name: string };
}

interface PurchaseOrdersIndexProps {
    purchaseOrders: { data: PurchaseOrder[]; current_page: number; last_page: number };
    filters?: { search?: string; status?: string; sort?: string; direction?: 'asc' | 'desc' };
    flash?: { message?: string };
    lang?: 'kh' | 'en';
}

const statusConfig = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' },
    sent: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
    received: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' },
};

const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === 'asc')}
            className="p-0 font-medium hover:bg-transparent"
        >
            {label}
            {isSorted === 'asc' ? (
                <ArrowUp className="ml-1 h-4 w-4" />
            ) : isSorted === 'desc' ? (
                <ArrowDown className="ml-1 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
            )}
        </Button>
    );
};

export default function PurchaseOrdersIndex({
                                                purchaseOrders,
                                                filters = {},
                                                flash,
                                                lang = 'en',
                                            }: PurchaseOrdersIndexProps) {
    const t = translations[lang] || translations.en;
    const [search, setSearch] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search: search || undefined };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('purchase-orders.index'), params, {
                preserveState: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sorting]);

    const breadcrumbs = [
        { title: t.indexTitle, href: route('purchase-orders.index') },
    ];

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                        <Link href={route('purchase-orders.show', row.original.id)}>
                            <Button variant="ghost" className="w-full">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={route('purchase-orders.edit', row.original.id)}>
                            <Button variant="ghost" size="sm" className="w-full">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                                confirm(t.indexDeleteConfirm) &&
                                router.delete(route('purchase-orders.destroy', row.original.id))
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            size: 60,
            meta: { align: 'center' },
        },
        {
            accessorKey: 'id',
            header: ({ column }) => sortableHeader(column, t.indexId),
            size: 80,
        },
        {
            accessorKey: 'po_number',
            header: ({ column }) => sortableHeader(column, t.indexPoNumber),
            cell: ({ row }) => (
                <Link
                    href={route('purchase-orders.show', row.original.po_number)}
                    className="font-medium text-blue-600 hover:underline px-4"
                >
                    {row.getValue('po_number')}
                </Link>
            ),
            size: 140,
        },
        {
            accessorKey: 'supplier.name',
            header: t.indexSupplier,
            cell: ({ row }) => (
                <Link
                    href={route('suppliers.show', row.original.supplier.name)}
                    className="text-blue-600 hover:underline font-medium"
                >
                    {row.original.supplier.name}
                </Link>
            ),
            size: 160,
        },

        {
            accessorKey: 'order_date',
            header: ({ column }) => sortableHeader(column, t.indexOrderDate),
            cell: ({ row }) => (
                <span className="px-4">
            {new Date(row.getValue('order_date')).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })}
        </span>
            ),
            size: 120,
        },
        {
            accessorKey: 'total_amount',
            header: ({ column }) => sortableHeader(column, t.indexTotalAmount),
            cell: ({ row }) => (
                <span className="font-medium px-2">${row.getValue('total_amount')}</span>
            ),
            size: 110,
        },
        {
            accessorKey: 'status',
            header: t.indexStatus,
            cell: ({ row }) => {
                const status = row.getValue('status') as keyof typeof statusConfig;
                const config = statusConfig[status];
                return (
                    <Badge
                        variant="outline"
                        className={`inline-flex items-center justify-center border ${config.border} ${config.bg} ${config.text} px-4 py-0.5 text-xs font-medium whitespace-nowrap overflow-hidden`}
                    >
                        {t[`status_${status}`] || status}
                    </Badge>
                );
            },
            size: 100,
            meta: { align: 'center' },
        },
        {
            accessorKey: 'creator.name',
            header: t.indexCreatedBy,
            cell: ({ row }) => (
                <Link
                    href={route('users.show', row.original.creator.name)}
                    className="text-blue-600 hover:underline font-medium px-2"
                >
                    {row.original.creator.name}
                </Link>
            ),
            size: 140,
        },

    ];

    return (
        <DataTable
            data={purchaseOrders.data}
            columns={columns}
            breadcrumbs={breadcrumbs}
            sorting={sorting}
            onSortingChange={setSorting}
            title={t.indexTitle}
            resourceName="purchase-orders"
            routes={{
                index: route('purchase-orders.index'),
                create: route('purchase-orders.create'),
            }}
            flash={flash}
            extraTopContent={
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="text-sm font-medium text-gray-700">{t.indexSearch}</label>
                        <Input
                            placeholder={t.indexSearchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1 w-64"
                        />
                    </div>
                </div>
            }
        />
    );
}
