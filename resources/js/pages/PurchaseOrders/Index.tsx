"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { translations } from '@/utils/translations/purchase_order/purchase_order';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    ArrowUpDown,
    Eye,
    Pencil,
    Trash2,
    MoreHorizontal,
    ArrowUp,
    ArrowDown,
    Filter as FilterIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier: { id: number; name: string };
    order_date: string;
    total_amount: string;
    status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
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

export default function PurchaseOrdersIndex({
                                                purchaseOrders,
                                                filters = {},
                                                flash,
                                                lang = 'kh',
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
                    <DropdownMenuContent align="end">
                        <Link href={route('purchase-orders.show', row.original.id)}>
                            <Button variant="ghost" size="sm" className=" justify-start">
                                <Eye className=" h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={route('purchase-orders.edit', row.original.id)}>
                            <Button variant="ghost" size="sm" className=" justify-start">
                                <Pencil className=" h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className=" justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                                confirm(t.indexDeleteConfirm || 'Are you sure?') &&
                                router.delete(route('purchase-orders.destroy', row.original.id))
                            }
                        >
                            <Trash2 className=" h-4 w-4" />
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            size: 60,
            meta: { align: 'center' },
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    {t.indexId}
                    {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                        column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={route('purchase-orders.show', row.original.id)}
                    className="font-medium text-blue-600 hover:underline block text-center"
                >
                    {row.getValue('id')}
                </Link>
            ),
            size: 80,
        },
        {
            accessorKey: 'po_number',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    {t.indexPoNumber}
                    {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                        column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={route('purchase-orders.show', row.original.id)}
                    className="font-medium text-blue-600 hover:underline"
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
                    href={route('suppliers.show', row.original.supplier.id)}
                    className="font-medium text-blue-600 hover:underline transition-colors"
                >
                    {row.original.supplier.name}
                </Link>
            ),
            size: 180,
        },
        {
            accessorKey: 'order_date',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    {t.indexOrderDate}
                    {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                        column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm text-gray-600 px-2">
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
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="p-0 font-medium hover:bg-transparent"
                >
                    {t.indexTotalAmount}
                    {column.getIsSorted() === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                        column.getIsSorted() === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    ${row.getValue('total_amount')}
                </span>
            ),
            size: 110,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                const currentFilter = filters.status || 'all';
                const [open, setOpen] = useState(false);

                return (
                    <div className="flex items-center gap-2 relative">
                        {/* Sortable Header */}
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="p-0 font-medium hover:bg-transparent h-auto"
                        >
                            {t.indexStatus}
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 h-4 w-4" />
                            ) : column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="ml-1 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
                            )}
                        </Button>

                        {/* Filter Dropdown */}
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                                                <FilterIcon
                                                    className={`h-4 w-4 ${
                                                        currentFilter !== 'all' ? 'text-indigo-600' : 'text-gray-400'
                                                    }`}
                                                />
                                                {currentFilter !== 'all' && (
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-600 border-2 border-white" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.filterByStatus || 'Filter by Status'}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Floating Dropdown */}
                            <DropdownMenuContent
                                align="center"
                                className="absolute top-full mt-1 left-1/2 -translate-x-1/2 min-w-[160px] p-4 z-50 shadow-lg"
                            >
                                <Select
                                    value={currentFilter}
                                    onValueChange={(value) => {
                                        const status = value === 'all' ? undefined : value;
                                        router.get(route('purchase-orders.index'), { ...filters, status }, { preserveState: true, replace: true });
                                        setOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t.indexAllStatuses || 'All Statuses'} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-auto">
                                        <SelectItem value="all">{t.indexAllStatuses || 'All Statuses'}</SelectItem>
                                        {(['draft', 'sent', 'confirmed', 'received', 'cancelled'] as const).map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {t[`status_${s}`] || s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {currentFilter !== 'all' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-3 w-full"
                                        onClick={() => {
                                            router.get(route('purchase-orders.index'), { ...filters, status: undefined }, { preserveState: true, replace: true });
                                            setOpen(false);
                                        }}
                                    >
                                        {t.clearFilter || 'Clear Filter'}
                                    </Button>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            sortingFn: (a, b) => {
                const order = { draft: 1, sent: 2, confirmed: 3, received: 4, cancelled: 5 };
                return (order[a.original.status] || 99) - (order[b.original.status] || 99);
            },
            cell: ({ row }) => {
                const status = row.original.status;
                const config = statusConfig[status];
                return (
                    <Badge
                        variant="outline"
                        className={`border ${config.border} ${config.bg} ${config.text} px-3 py-0.5 text-xs font-medium`}
                    >
                        {t[`status_${status}`] || status}
                    </Badge>
                );
            },
            size: 130,
            meta: { align: 'center' },
        },
        {
            accessorKey: 'creator.name',
            header: t.indexCreatedBy,
            cell: ({ row }) => (
                <Link
                    href={route('users.show', row.original.creator.id || row.original.creator.name)}
                    className="font-medium text-blue-600 hover:underline transition-colors"
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
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('purchase-orders.index') }]}
            resourceName="purchase-orders"
            routes={{
                index: route('purchase-orders.index'),
                create: route('purchase-orders.create'),
            }}
            flash={flash}
            extraTopContent={
                <div className="flex gap-6 items-end mb-4">
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">{t.indexSearch}</label>
                        <Input
                            placeholder={t.indexSearchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />
                    </div>
                </div>
            }
        />
    );
}
