"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link, router, useForm } from "@inertiajs/react";
import {
    Eye,
    Pencil,
    Trash2,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/DataTable";
import { translations } from "@/utils/translations/building/building";
import { Building, Flash, Paginated } from '@/types';

interface BuildingsIndexProps {
    buildings: Paginated<Building>;
    flash?: Flash;
    isSuperLibrarian?: boolean;
    lang?: "kh" | "en";
}

const commonStyles = {
    button: "rounded-lg text-sm transition-colors",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600",
    link: "text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1",
};

const getColumns = (
    processing: boolean,
    isSuperLibrarian: boolean,
    lang: "kh" | "en" = "en"
): ColumnDef<Building>[] => {
    const t = translations[lang] || translations.en;

    return [
        {
            id: "actions",
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const b = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={`${commonStyles.button} h-8 w-8 p-0`}>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-xl p-1">
                            <div className="flex flex-col items-center gap-1 px-1 py-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("buildings.show", b.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                            {t.indexViewTooltip}
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("buildings.edit", b.id)}>
                                                <Button variant="ghost" className="h-4 w-4 p-0" disabled={processing}>
                                                    <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                            {t.indexEditTooltip}
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
                                                        if (confirm(t.indexDeleteTooltip)) {
                                                            router.delete(route("buildings.destroy", b.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
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
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                <Link href={route("buildings.show", row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue("id")}
                </Link>
            ),
        },
        {
            accessorKey: "campus.name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexCampus}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <Link href={route("campuses.show", row.original.campus_id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.original.campus.name}
                </Link>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                <Link href={route("buildings.show", row.original.id)} className={`${commonStyles.text} px-4 hover:underline`}>
                    {row.getValue("name")}
                </Link>
            ),
        },
        {
            accessorKey: "code",
            header: t.indexCode,
            cell: ({ row }) => <span className="font-mono">{row.getValue("code")}</span>,
        },
        {
            accessorKey: "floors",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
                >
                    {t.indexFloors}
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-semibold">{row.getValue("floors")}</span>
            ),
            sortingFn: "basic", // Ensures numeric sorting
        },
    ];
};

export default function BuildingsIndex({
                                           buildings,
                                           flash,
                                           isSuperLibrarian = false,
                                           lang = "en",
                                       }: BuildingsIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();
    const columns = useMemo(
        () => getColumns(processing, isSuperLibrarian, lang),
        [processing, isSuperLibrarian, lang]
    );

    const breadcrumbs = [
        { title: t.indexTitle, href: route("buildings.index") },
    ];

    return (
        <DataTable
            data={buildings.data}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title={t.indexTitle}
            resourceName="buildings"
            routes={{
                index: route("buildings.index"),
                create: route("buildings.create"),
                show: (id) => route("buildings.show", id),
                edit: (id) => route("buildings.edit", id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
