"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { translations } from '@/utils/translations/asset-category/asset-category';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface AssetCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface AssetCategoriesIndexProps {
    assetCategories: { data: AssetCategory[]; current_page: number; last_page: number };
    filters?: { search?: string; sort?: string; direction?: 'asc' | 'desc' };
    flash?: { message?: string };
    lang?: 'kh' | 'en';
}

export default function AssetCategoriesIndex({
                                                 assetCategories,
                                                 filters = {},
                                                 flash,
                                                 lang = 'en'
                                             }: AssetCategoriesIndexProps) {
    const t = translations[lang] || translations.en;
    const [search, setSearch] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );
    const { processing } = useForm();

    // Update URL when search or sorting changes
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('asset-categories.index'), params, { preserveState: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sorting]);

    const columns: ColumnDef<AssetCategory>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => {
                const isSorted = sorting.find(s => s.id === 'id');
                return (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('id')}
                        className="font-medium hover:bg-transparent"
                    >
                        {t.indexId}
                        {isSorted ? (
                            isSorted.desc ? <ArrowDown className="ml-1 h-4 w-4" /> : <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Link href={route('asset-categories.show', row.original.id)} className="hover:underline">
                    {row.getValue('id')}
                </Link>
            ),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                const isSorted = sorting.find(s => s.id === 'name');
                return (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="font-medium hover:bg-transparent"
                    >
                        {t.indexName}
                        {isSorted ? (
                            isSorted.desc ? <ArrowDown className="ml-1 h-4 w-4" /> : <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Link href={route('asset-categories.show', row.original.id)} className="hover:underline">
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => {
                const isSorted = sorting.find(s => s.id === 'created_at');
                return (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="font-medium hover:bg-transparent"
                    >
                        {t.showCreated}
                        {isSorted ? (
                            isSorted.desc ? <ArrowDown className="ml-1 h-4 w-4" /> : <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = row.getValue('created_at') as string;
                return <span className="text-sm text-gray-600">{new Date(date).toLocaleString()}</span>;
            },
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => {
                const isSorted = sorting.find(s => s.id === 'updated_at');
                return (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort('updated_at')}
                        className="font-medium hover:bg-transparent"
                    >
                        {t.showUpdated}
                        {isSorted ? (
                            isSorted.desc ? <ArrowDown className="ml-1 h-4 w-4" /> : <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = row.getValue('updated_at') as string;
                return <span className="text-sm text-gray-600">{new Date(date).toLocaleString()}</span>;
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const cat = row.original;
                return (
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('asset-categories.show', cat.id)}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('asset-categories.edit', cat.id)}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            disabled={processing}
                            onClick={() => {
                                if (confirm(t.indexDeleteConfirm)) {
                                    router.delete(route('asset-categories.destroy', cat.id));
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const handleSort = (columnId: string) => {
        const current = sorting.find(s => s.id === columnId);
        let newSorting: SortingState = [];

        if (!current) {
            newSorting = [{ id: columnId, desc: false }];
        } else if (!current.desc) {
            newSorting = [{ id: columnId, desc: true }];
        } else {
            newSorting = [];
        }

        setSorting(newSorting);
    };

    return (
        <DataTable
            data={assetCategories.data}
            columns={columns}
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('asset-categories.index') }]}
            resourceName="asset-categories"
            routes={{
                index: route('asset-categories.index'),
                create: route('asset-categories.create'),
                show: (id) => route('asset-categories.show', id),
                edit: (id) => route('asset-categories.edit', id),
            }}
            flash={flash}
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
