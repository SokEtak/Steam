'use client';

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/permission/permission';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Permission {
    id: number;
    code: string;
    name: string;
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    flash?: {
        message?: string;
        type?: 'success' | 'error';
    };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

const commonStyles = {
    button: 'rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    text: 'text-gray-800 dark:text-gray-100 text-sm',
    indigoButton: 'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl',
    outlineButton:
        'bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm',
    gradientBg: 'bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50',
    card: 'bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800',
    input: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500',
    error: 'text-red-500 dark:text-red-400 text-sm mt-1',
};

const getColumns = (processing: boolean, isSuperLibrarian: boolean, lang: 'kh' | 'en' = 'kh'): ColumnDef<Permission>[] => {
    const t = translations[lang] || translations.en;
    return [
        {
            id: 'actions',
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const permission = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={`${commonStyles.button} h-8 w-8 p-0`} aria-label="Open actions menu">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className={`${commonStyles.card} w-auto min-w-0 rounded-xl p-1 dark:border-indigo-600`}>
                            <div className="flex flex-col items-center gap-1 px-1 py-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('permissions.show', permission.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className="rounded-lg bg-indigo-600 p-2 text-white">
                                            {t.indexViewTooltip || 'View Permission'}
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('permissions.edit', permission.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0" disabled={processing} aria-label="Edit permission">
                                                    <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className="rounded-lg bg-indigo-600 p-2 text-white">
                                            {t.indexEditTooltip || 'Edit Permission'}
                                        </TooltipContent>
                                    </Tooltip>
                                    {isSuperLibrarian && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0"
                                                    disabled={processing}
                                                    onClick={() => {
                                                        if (confirm(t.indexDeleteConfirm || 'Are you sure you want to delete this permission?')) {
                                                            router.delete(route('permissions.destroy', permission.id));
                                                        }
                                                    }}
                                                    aria-label="Delete permission"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center" className="rounded-lg bg-indigo-600 p-2 text-white">
                                                {t.indexDeleteTooltip || 'Delete Permission'}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </TooltipProvider>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexId || 'ID'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link href={route('permissions.show', row.original.id)} className={`${commonStyles.text} px-10 hover:underline`}>
                    {row.getValue('id')}
                </Link>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexName || 'Name'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link href={route('permissions.show', row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue('name')}
                </Link>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
    ];
};

export default function PermissionsIndex({
    permissions = { data: [], current_page: 1, last_page: 1, next_page_url: null, prev_page_url: null },
    flash,
    isSuperLibrarian = false,
    lang = 'kh',
}: PermissionsIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();
    const columns = useMemo(() => getColumns(processing, isSuperLibrarian, lang), [processing, isSuperLibrarian, lang]);

    const breadcrumbs = [{ title: t.indexTitle || 'Permissions', href: route('permissions.index') }];

    return (
        <DataTable
            data={permissions.data.map((p) => ({ ...p, code: p.name }))}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title={t.indexTitle || 'Permissions'}
            resourceName="permissions"
            routes={{
                index: route('permissions.index'),
                create: route('permissions.create'),
                show: (id) => route('permissions.show', id),
                edit: (id) => route('permissions.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
