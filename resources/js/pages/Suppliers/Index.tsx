"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/supplier/supplier';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

interface SuppliersIndexProps {
    suppliers: { data: Supplier[]; current_page: number; last_page: number };
    filters?: { search?: string; sort?: string; direction?: 'asc' | 'desc' };
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

// === Sortable Header with asc/desc toggle ===
const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === 'asc')}
            className="font-medium hover:bg-transparent p-0 flex items-center gap-1"
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

// === Columns ===
const getColumns = (
    isSuperLibrarian: boolean,
    lang: 'kh' | 'en',
    t: any
): ColumnDef<Supplier>[] => {
    return [
        {
            id: 'actions',
            cell: ({ row }) => {
                const supplier = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className={""}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('suppliers.show', supplier.id)}>
                                            <Button variant="ghost" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexViewTooltip}</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('suppliers.edit', supplier.id)}>
                                            <Button variant="ghost" className="h-8 w-8">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexEditTooltip}</TooltipContent>
                                </Tooltip>

                                {/*{isSuperLibrarian && (*/}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-600"
                                                onClick={() => {
                                                    if (confirm(t.indexDeleteConfirm)) {
                                                        router.delete(route('suppliers.destroy', supplier.id));
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{t.indexDeleteTooltip}</TooltipContent>
                                    </Tooltip>
                                {/*)}*/}
                            </TooltipProvider>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: 'id',
            header: ({ column }) => sortableHeader(column, t.indexId),
            cell: ({ row }) => (
                <Link href={route('suppliers.show', row.original.id)} className="hover:underline">
                    {row.getValue('id')}
                </Link>
            ),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => sortableHeader(column, t.indexName),
            cell: ({ row }) => (
                <Link href={route('suppliers.show', row.original.id)} className="hover:underline font-medium">
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'contact_person',
            header: ({ column }) => sortableHeader(column, t.indexContactPerson),
            cell: ({ row }) => row.getValue('contact_person') || <span className="text-gray-400">—</span>,
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => sortableHeader(column, t.indexPhone),
            cell: ({ row }) => row.getValue('phone') || <span className="text-gray-400">—</span>,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => sortableHeader(column, t.indexEmail),
            cell: ({ row }) => row.getValue('email') || <span className="text-gray-400">—</span>,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => sortableHeader(column, t.indexCreatedAt),
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.getValue('created_at')).toLocaleString()}
                </span>
            ),
        },
    ];
};

// === Main Component ===
export default function SuppliersIndex({
                                           suppliers,
                                           filters = {},
                                           flash,
                                           isSuperLibrarian = false,
                                           lang = 'kh'
                                       }: SuppliersIndexProps) {
    const t = translations[lang] || translations.en;

    const [search, setSearch] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    // Sync search & sorting to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search: search || undefined };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            } else {
                delete params.sort;
                delete params.direction;
            }
            router.get(route('suppliers.index'), params, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sorting]);

    const columns = useMemo(
        () => getColumns(isSuperLibrarian, lang, t),
        [isSuperLibrarian, lang, t]
    );

    return (
        <DataTable
            data={suppliers.data}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('suppliers.index') }]}
            resourceName="suppliers"
            routes={{
                index: route('suppliers.index'),
                create: route('suppliers.create'),
                show: (id) => route('suppliers.show', id),
                edit: (id) => route('suppliers.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
            extraTopContent={
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="text-sm">{t.indexSearch}</label>
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
