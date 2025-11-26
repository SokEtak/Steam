// resources/js/Pages/AssetCategories/Index.tsx
"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface AssetCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface AssetCategoriesIndexProps {
    assetCategories: {
        data: AssetCategory[];
        current_page: number;
        last_page: number;
    };
    filters?: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
}

const sortableHeader = (columnId: string, label: string, sorting: SortingState, onSort: (id: string) => void) => {
    const sort = sorting.find((s) => s.id === columnId);
    return (
        <Button
            variant="ghost"
            onClick={() => onSort(columnId)}
            className="p-0 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-left h-9 -ml-3"
        >
            {label}
            {sort ? (
                sort.desc ? (
                    <ArrowDown className="ml-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                ) : (
                    <ArrowUp className="ml-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                )
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            )}
        </Button>
    );
};

export default function AssetCategoriesIndex({
                                                 assetCategories,
                                                 filters = {},
                                                 flash,
                                                 isSuperLibrarian = false,
                                             }: AssetCategoriesIndexProps) {

    const [search, setSearch] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort
            ? [{ id: filters.sort, desc: filters.direction === 'desc' }]
            : []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            const params: Record<string, any> = {
                search: search || undefined,
            };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('asset-categories.index'), params, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sorting]);

    const handleSort = (columnId: string) => {
        const current = sorting.find((s) => s.id === columnId);
        let newSorting: SortingState = [];
        if (!current) newSorting = [{ id: columnId, desc: false }];
        else if (!current.desc) newSorting = [{ id: columnId, desc: true }];
        setSorting(newSorting);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('km-KH', {
            timeZone: 'Asia/Phnom_Penh',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const columns: ColumnDef<AssetCategory>[] = useMemo(
        () => [
            {
                id: 'actions',
                cell: ({ row }) => {
                    const cat = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 border dark:border-gray-800">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('asset-categories.show', cat.id)}>
                                                <Button variant="ghost" size="sm" className=" justify-start text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>មើលព័ត៌មានលម្អិត</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('asset-categories.edit', cat.id)}>
                                                <Button variant="ghost" size="sm" className=" justify-start text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>កែប្រែប្រភេទទ្រព្យសកម្ម</TooltipContent>
                                    </Tooltip>

                                    {/*{isSuperLibrarian && (*/}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className=" justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    onClick={() => {
                                                        if (confirm('តើអ្នកប្រាកដជាចង់លុបប្រភេទនេះមែនទេ?')) {
                                                            router.delete(route('asset-categories.destroy', cat.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className=" h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>លុបប្រភេទទ្រព្យសកម្ម</TooltipContent>
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
                header: () => sortableHeader('id', 'លេខសម្គាល់', sorting, handleSort),
                cell: ({ row }) => (
                    <Link
                        href={route('asset-categories.show', row.original.id)}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                    >
                        #{row.getValue('id')}
                    </Link>
                ),
            },
            {
                accessorKey: 'name',
                header: () => sortableHeader('name', 'ឈ្មោះប្រភេទ', sorting, handleSort),
                cell: ({ row }) => (
                    <Link
                        href={route('asset-categories.show', row.original.id)}
                        className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors"
                    >
                        {row.getValue('name')}
                    </Link>
                ),
            },
            {
                accessorKey: 'created_at',
                header: () => sortableHeader('created_at', 'បង្កើតនៅ', sorting, handleSort),
                cell: ({ row }) => (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatDateTime(row.getValue('created_at'))}
                    </div>
                ),
            },
            {
                accessorKey: 'updated_at',
                header: () => sortableHeader('updated_at', 'កែចុងក្រោយ', sorting, handleSort),
                cell: ({ row }) => (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatDateTime(row.getValue('updated_at'))}
                    </div>
                ),
            },
        ],
        [sorting, isSuperLibrarian]
    );

    return (
        <DataTable
            data={assetCategories.data}
            columns={columns}
            title="ប្រភេទទ្រព្យសកម្ម"
            breadcrumbs={[{ title: "ប្រភេទទ្រព្យសកម្ម", href: route('asset-categories.index') }]}
            resourceName="asset-categories"
            routes={{
                index: route('asset-categories.index'),
                create: route('asset-categories.create'),
                show: (id) => route('asset-categories.show', id),
                edit: (id) => route('asset-categories.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
            searchPlaceholder="ស្វែងរកប្រភេទ..."
            createButtonText="បង្កើតប្រភេទថ្មី"
        />
    );
}
