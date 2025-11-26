"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Eye, FilterIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
    assetSubCategories: {
        data: AssetSubCategory[];
        current_page: number;
        last_page: number;
    };
    assetCategories: AssetCategory[];
    filters?: {
        search?: string;
        asset_category_id?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
}

// Hardcoded Khmer labels
const KH = {
    indexTitle: "ប្រភេទរងនៃទ្រព្យសម្បត្តិ",
    indexSearch: "ស្វែងរក",
    indexSearchPlaceholder: "ស្វែងរកតាមឈ្មោះ...",
    indexCategory: "ប្រភេទទ្រព្យសម្បត្តិ",
    indexCategoryPlaceholder: "ជ្រើសរើសប្រភេទ",
    indexAllCategories: "ប្រភេទទាំងអស់",
    indexId: "លេខរៀង",
    indexName: "ឈ្មោះ",
    showCreated: "ថ្ងៃបង្កើត",
    showUpdated: "ថ្ងៃកែប្រែ",
    indexViewTooltip: "មើល",
    indexEditTooltip: "កែប្រែ",
    indexDeleteTooltip: "លុប",
    indexDeleteConfirm: "តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?",
    filterByCategory: "តម្រៀបតាមប្រភេទ",
};

const CategoryFilter = ({
                            value,
                            onValueChange,
                            categories,
                        }: {
    value: string;
    onValueChange: (value: string) => void;
    categories: AssetCategory[];
}) => (
    <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
            {KH.indexCategory}
        </label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-64">
                <SelectValue placeholder={KH.indexCategoryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">{KH.indexAllCategories}</SelectItem>
                {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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

export default function AssetSubCategoriesIndex({
                                                    assetSubCategories,
                                                    assetCategories,
                                                    filters = {},
                                                    flash,
                                                    isSuperLibrarian = false,
                                                }: AssetSubCategoriesIndexProps) {
    const { processing } = useForm();

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.asset_category_id || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort
            ? [{ id: filters.sort, desc: filters.direction === 'desc' }]
            : []
    );

    // Sync filters + sorting with Inertia
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: Record<string, any> = {
                search: search || undefined,
                asset_category_id: categoryId || undefined,
            };

            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }

            router.get(
                route('asset-sub-categories.index'),
                params,
                { preserveState: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, categoryId, sorting]);

    const columns: ColumnDef<AssetSubCategory>[] = useMemo(
        () => [
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
                            <DropdownMenuContent align="end">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('asset-sub-categories.show', sub.id)}>
                                                <Button variant="ghost" size="sm" className="justify-start">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>{KH.indexViewTooltip}</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('asset-sub-categories.edit', sub.id)}>
                                                <Button variant="ghost" size="sm" disabled={processing}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>{KH.indexEditTooltip}</TooltipContent>
                                    </Tooltip>

                                    {isSuperLibrarian && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    disabled={processing}
                                                    onClick={() =>
                                                        confirm(KH.indexDeleteConfirm) &&
                                                        router.delete(route('asset-sub-categories.destroy', sub.id))
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> {KH.indexDeleteTooltip}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{KH.indexDeleteTooltip}</TooltipContent>
                                        </Tooltip>
                                    )}
                                </TooltipProvider>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
            {
                accessorKey: 'id',
                header: ({ column }) => sortableHeader(column, KH.indexId),
                cell: ({ row }) => (
                    <Link
                        href={route('asset-sub-categories.show', row.original.id)}
                        className="font-medium text-blue-600 hover:underline px-4"
                    >
                        {row.getValue('id')}
                    </Link>
                ),
            },
            {
                accessorKey: 'name',
                header: ({ column }) => sortableHeader(column, KH.indexName),
                cell: ({ row }) => (
                    <Link
                        href={route('asset-sub-categories.show', row.original.id)}
                        className="hover:underline font-medium px-2"
                    >
                        {row.getValue('name')}
                    </Link>
                ),
            },
            {
                accessorKey: 'asset_category.name',
                id: 'asset_category',
                header: ({ column }) => {
                    const filterValue = (column.getFilterValue() as string) || '';
                    const [isOpen, setIsOpen] = useState(false);

                    return (
                        <div className="flex items-center space-x-2">
                            <span>{KH.indexCategory}</span>

                            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <FilterIcon
                                                        className={`h-4 w-4 ${filterValue ? 'text-indigo-600' : 'text-gray-400'}`}
                                                    />
                                                    {filterValue && (
                                                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-600 border-2 border-white" />
                                                    )}
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>{KH.filterByCategory}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <DropdownMenuContent align="center" className="w-auto p-3">
                                    <Select
                                        value={filterValue || 'all'}
                                        onValueChange={(value) => {
                                            const newValue = value === 'all' ? '' : value;
                                            column.setFilterValue(newValue);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={KH.indexCategoryPlaceholder} />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="all">{KH.indexAllCategories}</SelectItem>
                                            {assetCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {filterValue && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 w-full text-xs"
                                            onClick={() => {
                                                column.setFilterValue('');
                                                setIsOpen(false);
                                            }}
                                        >
                                            សម្អាតតម្រង
                                        </Button>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },

                cell: ({ row }) => {
                    const categoryName = row.original.asset_category?.name || '-';
                    return <div className="font-medium text-indigo-700">{categoryName}</div>;
                },

                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue) return true;
                    const categoryId = row.original.asset_category?.id;
                    return String(categoryId) === filterValue;
                },

                enableSorting: true,
                enableHiding: true,
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => sortableHeader(column, KH.showCreated),
                cell: ({ row }) => (
                    <span className="text-sm text-gray-500 px-4">
            {new Date(row.getValue('created_at')).toLocaleString()}
        </span>
                ),
            },
            {
                accessorKey: 'updated_at',
                header: ({ column }) => sortableHeader(column, KH.showUpdated),
                cell: ({ row }) => (
                    <span className="text-sm text-gray-500 px-4">
            {new Date(row.getValue('updated_at')).toLocaleString()}
        </span>
                ),
            },
        ],
        [processing, isSuperLibrarian]
    );

    return (
        <DataTable
            data={assetSubCategories.data}
            columns={columns}
            title={KH.indexTitle}
            breadcrumbs={[{ title: KH.indexTitle, href: route('asset-sub-categories.index') }]}
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
                <div className="flex flex-wrap gap-6 items-end mb-4">
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">{KH.indexSearch}</label>
                        <Input
                            placeholder={KH.indexSearchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />
                    </div>

                    <CategoryFilter
                        value={categoryId}
                        onValueChange={setCategoryId}
                        categories={assetCategories}
                    />
                </div>
            }
        />
    );
}
