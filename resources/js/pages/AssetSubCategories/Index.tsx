"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/asset-sub-category/asset-sub-category';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface AssetCategory {
    id: number;
    name: string;
}

interface AssetSubCategory {
    id: number;
    name: string;
    asset_category: AssetCategory;
    created_at: string;
    updated_at: string;
}

interface AssetSubCategoriesIndexProps {
    assetSubCategories: { data: AssetSubCategory[]; current_page: number; last_page: number };
    assetCategories: AssetCategory[];
    filters?: { search?: string; asset_category_id?: string; sort?: string; direction?: 'asc' | 'desc' };
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

const CategoricalFilter = ({ label, placeholder, value, onChange, options, allOptionLabel }: any) => (
    <div>
        <label className="text-sm">{label}</label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="mt-1 w-64">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">{allOptionLabel}</SelectItem>
                {options.map((opt: any) => (
                    <SelectItem key={opt.id} value={opt.id.toString()}>
                        {opt.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 font-medium">
            {label}
            {isSorted === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                isSorted === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
        </Button>
    );
};

export default function AssetSubCategoriesIndex({
                                                    assetSubCategories,
                                                    assetCategories,
                                                    filters = {},
                                                    flash,
                                                    isSuperLibrarian = false,
                                                    lang = 'en'
                                                }: AssetSubCategoriesIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.asset_category_id || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search, asset_category_id: categoryId || undefined };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('asset-sub-categories.index'), params, { preserveState: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryId, sorting]);

    const columns: ColumnDef<AssetSubCategory>[] = useMemo(() => [
        {
            id: 'actions',
            cell: ({ row }) => {
                const sub = row.original;
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
                                        <Link href={route('asset-sub-categories.show', sub.id)}>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexViewTooltip}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('asset-sub-categories.edit', sub.id)}>
                                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={processing}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexEditTooltip}</TooltipContent>
                                </Tooltip>
                                {isSuperLibrarian && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-600"
                                                disabled={processing}
                                                onClick={() => confirm(t.indexDeleteConfirm) && router.delete(route('asset-sub-categories.destroy', sub.id))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{t.indexDeleteTooltip}</TooltipContent>
                                    </Tooltip>
                                )}
                            </TooltipProvider>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        { accessorKey: 'id', header: ({ column }) => sortableHeader(column, t.indexId), cell: ({ row }) => <Link href={route('asset-sub-categories.show', row.original.id)} className="hover:underline">{row.getValue('id')}</Link> },
        { accessorKey: 'name', header: ({ column }) => sortableHeader(column, t.indexName), cell: ({ row }) => <Link href={route('asset-sub-categories.show', row.original.id)} className="hover:underline">{row.getValue('name')}</Link> },
        { accessorKey: 'asset_category.name', header: t.indexCategory, cell: ({ row }) => <span className="text-indigo-600">{row.original.asset_category.name}</span> },
        { accessorKey: 'created_at', header: ({ column }) => sortableHeader(column, t.showCreated), cell: ({ row }) => <span className="text-sm text-gray-600">{new Date(row.getValue('created_at')).toLocaleString()}</span> },
        { accessorKey: 'updated_at', header: ({ column }) => sortableHeader(column, t.showUpdated), cell: ({ row }) => <span className="text-sm text-gray-600">{new Date(row.getValue('updated_at')).toLocaleString()}</span> },
    ], [t, processing, isSuperLibrarian]);

    return (
        <DataTable
            data={assetSubCategories.data}
            columns={columns}
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('asset-sub-categories.index') }]}
            resourceName="asset-sub-categories"
            routes={{
                index: route('asset-sub-categories.index'),
                create: route('asset-sub-categories.create'),
                show: (id) => route('asset-sub-categories.show', id),
                edit: (id) => route('asset-sub-categories.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
            extraTopContent={
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="text-sm">{t.indexSearch}</label>
                        <Input placeholder={t.indexSearchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="mt-1 w-64" />
                    </div>
                    <CategoricalFilter
                        label={t.indexCategory}
                        placeholder={t.indexCategoryPlaceholder}
                        value={categoryId}
                        onChange={setCategoryId}
                        options={assetCategories}
                        allOptionLabel={t.indexAllCategories}
                    />
                </div>
            }
        />
    );
}
