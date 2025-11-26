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
    name: string | null;
    code: string | null;
    email: string | null;
    address: string | null;
    contact: string | null;
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
}

const commonStyles = {
    button: 'rounded-lg text-sm transition-colors',
    text: 'text-gray-800 dark:text-gray-100 text-sm',
    gradientBg: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900',
    tooltipBg: 'bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl',
    link: 'text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1',
    truncate: 'truncate max-w-xs',
};

const getColumns = (processing: boolean, isSuperLibrarian: boolean): ColumnDef<School>[] => {
    const t = translations.kh;

    const renderValue = (value: string | null) => (value ? value : 'N/A');

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
                            <Button variant="ghost" className={`${commonStyles.button} h-8 w-8 p-0`}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className={`${commonStyles.gradientBg} w-auto min-w-0 rounded-xl p-1`}
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

                                    {/*{isSuperLibrarian && (*/}
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
                                    {/*)}*/}
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
            cell: ({ row }) => <span className={`${commonStyles.text} px-10`}>{row.getValue('id')}</span>,
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
            cell: ({ row }) => <span className={`${commonStyles.text} px-4`}>{renderValue(row.getValue('name'))}</span>,
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
            cell: ({ row }) => <span className="font-mono">{renderValue(row.getValue('code'))}</span>,
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
            cell: ({ row }) => {
                const email = row.getValue('email');

                return email ? (
                    <a href={`mailto:${email}`} className={`${commonStyles.link} px-4`}>
                        {email}
                    </a>
                ) : (
                    <span className={`${commonStyles.text} px-4`}>N/A</span>
                );
            },
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
                const address = row.getValue('address');
                return address ? (
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
                ) : 'N/A';
            },
            defaultHidden: true,
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
            cell: ({ row }) => {
                const contact = row.getValue('contact');

                return contact ? (
                    <a href={`tel:${contact}`} className={`${commonStyles.link} px-2`}>
                        {contact}
                    </a>
                ) : (
                    <span className="px-8">N/A</span>
                );
            },
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
                const website = row.getValue('website');

                return website ? (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${commonStyles.link} px-2`}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span className={commonStyles.truncate}>
                    {website.replace(/^https?:\/\//, '')}
                </span>
                    </a>
                ) : (
                    <span className="px-8">N/A</span>
                );
            },
        },
    ];
};

export default function SchoolsIndex({ schools, flash, isSuperLibrarian = false }: SchoolsIndexProps) {
    const t = translations.kh;
    const { processing } = useForm();
    const columns = useMemo(() => getColumns(processing, isSuperLibrarian), [processing, isSuperLibrarian]);

    const breadcrumbs = [{ title: t.indexTitle || 'សាលា', href: route('schools.index') }];

    return (
        <DataTable
            data={schools.data}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title={t.indexTitle || 'សាលា'}
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
