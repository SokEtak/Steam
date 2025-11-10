'use client';

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/school/school';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface School {
    id: number;
    name: string;
    code: string;
    email: string;
    address: string;
    contact: string;
    website: string | null;
}

interface SchoolsIndexProps {
    schools: {
        data: School[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    flash?: { message?: string; type?: 'success' | 'error' };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

const commonStyles = {
    button: 'rounded-lg text-sm transition-colors',
    text: 'text-gray-800 dark:text-gray-100 text-sm',
    indigoButton: 'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700',
    outlineButton:
        'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800',
    gradientBg: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900',
    tooltipBg: 'bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl',
    link: 'text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1',
    truncate: 'truncate max-w-xs',
};

const getColumns = (processing: boolean, isSuperLibrarian: boolean, lang: 'kh' | 'en' = 'kh'): ColumnDef<School>[] => {
    const t = translations[lang] || translations.en;

    return [
        // Actions
        {
            id: 'actions',
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const school = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={`${commonStyles.button} h-8 w-8 p-0`} aria-label="Open actions menu">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className={`${commonStyles.gradientBg} w-auto min-w-0 rounded-xl p-1 dark:border-indigo-600`}
                        >
                            <div className="flex flex-col items-center gap-1 px-1 py-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('schools.show', school.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                            {t.indexViewTooltip || 'View School'}
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('schools.edit', school.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0" disabled={processing}>
                                                    <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                            {t.indexEditTooltip || 'Edit School'}
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
                                                        if (confirm(t.indexDeleteTooltip || 'Delete this school?')) {
                                                            router.delete(route('schools.destroy', school.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                                {t.indexDeleteTooltip || 'Delete School'}
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

        // ID
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
                <Link href={route('schools.show', row.original.id)} className={`${commonStyles.text} px-10 hover:underline`}>
                    {row.getValue('id')}
                </Link>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },

        // Name
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
                <Link href={route('schools.show', row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue('name')}
                </Link>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },

        // Code
        {
            accessorKey: 'code',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexCode || 'Code'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => <span className="font-mono">{row.getValue('code')}</span>,
        },

        // Email
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexEmail || 'Email'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <a href={`mailto:${row.getValue('email')}`} className={commonStyles.link}>
                    {row.getValue('email')}
                </a>
            ),
        },

        // Address
        {
            accessorKey: 'address',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexAddress || 'Address'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const address = row.getValue('address') as string;
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={`${commonStyles.text} ${commonStyles.truncate} block`}>{address}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md p-3 text-sm">
                                <p className="whitespace-pre-wrap">{address}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },

        // Contact
        {
            accessorKey: 'contact',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexContact || 'Contact'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <a href={`tel:${row.getValue('contact')}`} className={commonStyles.link}>
                    {row.getValue('contact')}
                </a>
            ),
        },

        // Website
        {
            accessorKey: 'website',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexWebsite || 'Website'}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const website = row.getValue('website') as string | null;
                if (!website) return <span className="text-gray-400">—</span>;
                return (
                    <a href={website} target="_blank" rel="noopener noreferrer" className={commonStyles.link}>
                        <ExternalLink className="h-3 w-3" />
                        <span className={commonStyles.truncate}>{website.replace(/^https?:\/\//, '')}</span>
                    </a>
                );
            },
        },
    ];
};

export default function SchoolsIndex({ schools, flash, isSuperLibrarian = false, lang = 'kh' }: SchoolsIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();
    const columns = useMemo(() => getColumns(processing, isSuperLibrarian, lang), [processing, isSuperLibrarian, lang]);

    const breadcrumbs = [{ title: t.indexTitle || 'Schools', href: route('schools.index') }];

    return (
        <DataTable
            data={schools.data}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title={t.indexTitle || 'Schools'}
            resourceName="schools"
            routes={{
                index: route('schools.index'),
                create: route('schools.create'),
                show: (id) => route('schools.show', id),
                edit: (id) => route('schools.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
