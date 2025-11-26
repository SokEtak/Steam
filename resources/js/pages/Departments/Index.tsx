'use client';

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/department/department';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Department {
    id: number;
    name: string;
    code: string;
    campus: { id: number; name: string };
    building?: { id: number; name: string } | null;
    head?: { id: number; name: string } | null;
}

interface DepartmentsIndexProps {
    departments: {
        data: Department[];
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

const getColumns = (
    processing: boolean,
    isSuperLibrarian: boolean,
    lang: 'kh' | 'en' = 'kh'
): ColumnDef<Department>[] => {
    const t = translations["kh"];

    return [
        // === ACTIONS ===
        {
            id: 'actions',
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const dept = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`${commonStyles.button} h-8 w-8 p-0`}
                                aria-label="Open actions menu"
                                onClick={(e) => e.stopPropagation()}
                            >
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
                                    {/* VIEW */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('departments.show', dept.id)}>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                            {t.indexViewTooltip}
                                        </TooltipContent>
                                    </Tooltip>

                                    {/* EDIT */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route('departments.edit', dept.id)}>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={processing}>
                                                    <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                            {t.indexEditTooltip}
                                        </TooltipContent>
                                    </Tooltip>

                                    {/* DELETE (Super Librarian only) */}
                                    {isSuperLibrarian && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    disabled={processing}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm(t.indexDeleteTooltip)) {
                                                            router.delete(route('departments.destroy', dept.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                                {t.indexDeleteTooltip}
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

        // === ID ===
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexId}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link href={route('departments.show', row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue('id')}
                </Link>
            ),
        },

        // === NAME ===
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexName}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link href={route('departments.show', row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue('name')}
                </Link>
            ),
        },

        // === CODE ===
        {
            accessorKey: 'code',
            header: t.indexCode,
            cell: ({ row }) => <span className="font-mono">{row.getValue('code')}</span>,
        },

        // === CAMPUS ===
        {
            accessorKey: 'campus.name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexCampus}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            // **Hidden sorting column** – points to the real string value
            sortingFn: 'alphanumeric',
            // The cell still receives the full row, so we can safely read `campus.name`
            cell: ({ row }) => (
                <Link href={route('campuses.show', row.original.campus.id)} className={`${commonStyles.link} px-3.5`}>
                    {row.original.campus.name}
                </Link>
            ),
        },

        // === BUILDING ===
        {
            accessorKey: 'building.name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexBuilding}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            // Custom sorting that treats null/undefined as empty string
            sortingFn: (rowA, rowB, columnId) => {
                const a = rowA.getValue<string | undefined>(columnId) ?? '';
                const b = rowB.getValue<string | undefined>(columnId) ?? '';
                return a.localeCompare(b);
            },
            cell: ({ row }) => {
                const building = row.original.building;
                return building ? (
                    <Link href={route('buildings.show', building.id)} className={commonStyles.link}>
                        {building.name}
                    </Link>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },

        // === HEAD ===
        {
            accessorKey: 'head.name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexHead}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            // Same custom sorting as building
            sortingFn: (rowA, rowB, columnId) => {
                const a = rowA.getValue<string | undefined>(columnId) ?? '';
                const b = rowB.getValue<string | undefined>(columnId) ?? '';
                return a.localeCompare(b);
            },
            cell: ({ row }) => {
                const head = row.original.head;
                return head ? (
                    <Link href={route('users.show', head.id)} className={`${commonStyles.link} px-8`}>
                        {head.name}
                    </Link>
                ) : (
                    <span className="text-gray-400">N/A</span>
                );
            },
        },
    ];
};

export default function DepartmentsIndex({
                                             departments,
                                             flash,
                                             isSuperLibrarian = false,
                                             lang = 'kh',
                                         }: DepartmentsIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();
    const columns = useMemo(
        () => getColumns(processing, isSuperLibrarian, lang),
        [processing, isSuperLibrarian, lang]
    );

    const breadcrumbs = [
        { title: t.indexTitle, href: route('departments.index') }
    ];

    return (
        <DataTable
            data={departments.data}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title={t.indexTitle}
            resourceName="departments"
            routes={{
                index: route('departments.index'),
                create: route('departments.create'),
                show: (id) => route('departments.show', id),
                edit: (id) => route('departments.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
