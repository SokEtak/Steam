'use client';

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/asset/asset';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// ──────────────────────────────
// Fixed Asset interface
// ──────────────────────────────
interface Asset {
    id: number;
    asset_tag: string;
    name: string;
    serial_number: string | null;
    model: string | null;
    status: string;
    condition: string;
    cost: number;
    purchase_date: string;
    warranty_until: string | null;
    category: { id: number; name: string } | null;
    sub_category: { id: number; name: string } | null;
    department: { id: number; name: string } | null;
    room: { id: number; name: string } | null;
    custodian: { id: number; name: string } | null;
    created_at: string;
    purchase_order?: {
        id: number;
        po_number: string;
        supplier?: { name: string };
    } | null;
}

// ──────────────────────────────
// Props
// ──────────────────────────────
interface AssetsIndexProps {
    assets: { data: Asset[]; current_page: number; last_page: number };
    filters?: {
        search?: string;
        status?: string;
        category_id?: string;
        subcategory_id?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    categories?: { id: number; name: string }[];
    subcategories?: { id: number; name: string; category_id: number }[];
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
    lang?: 'en' | 'kh';
}

// ──────────────────────────────
// Sortable header helper
// ──────────────────────────────
const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === 'asc')}
            className="flex items-center gap-1 p-0 font-medium hover:bg-transparent"
        >
            {label}
            {isSorted === 'asc' ? (
                <ArrowUp className="h-4 w-4 text-blue-600" />
            ) : isSorted === 'desc' ? (
                <ArrowDown className="h-4 w-4 text-blue-600" />
            ) : (
                <ArrowUpDown className="h-4 w-4 opacity-40" />
            )}
        </Button>
    );
};

// ──────────────────────────────
// Main component
// ──────────────────────────────
export default function AssetsIndex({
    assets,
    filters = {},
    categories = [],
    subcategories = [],
    flash,
    isSuperLibrarian = false,
    lang = 'kh',
}: AssetsIndexProps) {
    const trans = translations[lang] ?? translations.en;

    // ── Filter states ─────────────────────────────────────
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');
    const [subcategoryFilter, setSubcategoryFilter] = useState(filters.subcategory_id || '');
    const [sorting, setSorting] = useState<SortingState>(filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []);

    // ── Debounced navigation ───────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('assets.index'),
                {
                    search: search || undefined,
                    category_id: categoryFilter || undefined,
                    subcategory_id: subcategoryFilter || undefined,
                    sort: sorting[0]?.id,
                    direction: sorting[0]?.desc ? 'desc' : 'asc',
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter, subcategoryFilter, sorting]);

    // ── Available subcategories for the selected category ───
    const availableSubcategories = useMemo(() => {
        if (!categoryFilter) return subcategories;
        return subcategories.filter((s) => s.category_id === Number(categoryFilter));
    }, [categoryFilter, subcategories]);

    // ── Columns ─────────────────────────────────────────────
    const columns: ColumnDef<Asset>[] = useMemo(
        () => [
            // ── Actions ───────────────────────────────────────
            {
                id: 'actions',
                cell: ({ row }) => {
                    const asset = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('assets.show', asset.id)}>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>{trans.view}</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('assets.edit', asset.id)}>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>{trans.edit}</TooltipContent>
                                    </Tooltip>

                                    {isSuperLibrarian && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-600"
                                                    onClick={() => confirm(trans.deleteConfirm) && router.delete(route('assets.destroy', asset.id))}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{trans.delete}</TooltipContent>
                                        </Tooltip>
                                    )}
                                </TooltipProvider>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },

            // ── ID ───────────────────────────────────────────
            {
                accessorKey: 'id',
                header: ({ column }) => (
                    <div className="px-4 text-center">
                        {sortableHeader(column, trans.id)}
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="px-15">
                        {row.getValue('id')}
                    </div>
                ),
            },

            // ── PO ───────────────────────────────────────────
            {
                header: trans.purchaseOrder,
                cell: ({ row }) => {
                    const po = row.original.purchase_order;
                    return po ? (
                        <Link
                            href={route('purchase-orders.show', po.id)}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            {po.po_number}
                        </Link>
                    ) : (
                        <span className="text-gray-400 px-8">N/A</span>
                    );
                },
            },

            // ── Asset Tag ─────────────────────────────────────
            {
                accessorKey: 'asset_tag',
                header: ({ column }) => sortableHeader(column, trans.assetTag),
                cell: ({ row }) => (
                    <Link href={route('assets.show', row.original.id)} className="font-medium hover:underline">
                        {row.original.asset_tag}
                    </Link>
                ),
            },

            // ── Name ──────────────────────────────────────────
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <div className="px-4">
                        {sortableHeader(column, trans.name)}
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        {row.getValue('name')}
                    </div>
                ),
            },

            // ── Category (linked) ─────────────────────────────
            {
                accessorKey: 'category.name',
                header: trans.category,
                cell: ({ row }) => {
                    const cat = row.original.category;
                    return cat ? (
                        <Link href={route('asset-categories.show', cat.id)} className="text-blue-600 hover:underline">
                            {cat.name}
                        </Link>
                    ) : (
                        <span className="text-gray-400">—</span>
                    );
                },
            },

            // ── Subcategory (linked) ──────────────────────────
            {
                header: trans.subcategory,
                cell: ({ row }) => {
                    const sub = row.original.sub_category;
                    return sub ? (
                        <Link
                            href={route('asset-sub-categories.show', sub.id)}
                            className="inline-flex items-center rounded-full bg-purple-100 px-1 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200"
                        >
                            {sub.name}
                        </Link>
                    ) : (
                        <span className="text-gray-400 px-4">N/A</span>
                    );
                },
            },

            // ── Cost (sortable) ───────────────────────────────
            {
                accessorKey: 'cost',
                header: ({ column }) => sortableHeader(column, trans.cost),
                cell: ({ row }) => <span className="px-3 text-green-600">${Number(row.original.cost).toFixed(2)}</span>,
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => sortableHeader(column, trans.createdAt),
                cell: ({ row }) => {
                    const date = new Date(row.original.created_at);
                    const formatted =
                        date.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }) +
                        ', ' +
                        date.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        });

                    return <span className="px-0 font-mono text-sm">{formatted}</span>;
                },
            },
        ],
        [isSuperLibrarian, lang, trans],
    );

    // ── Render ───────────────────────────────────────────────
    return (
        <DataTable
            data={assets.data}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            title={trans.assetsTitle}
            breadcrumbs={[{ title: trans.assetsTitle, href: route('assets.index') }]}
            resourceName="assets"
            routes={{
                index: route('assets.index'),
                create: route('assets.create'),
                show: (id) => route('assets.show', id),
                edit: (id) => route('assets.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
