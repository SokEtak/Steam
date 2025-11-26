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
    lang: "kh" | "en" = "kh"
): ColumnDef<Building>[] => {
    const t = translations["kh"];

    return [
        {
            id: 'actions',
            cell: ({ row }) => {
                const building = row.original;
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
                                        <Link href={route('buildings.show', building.id)}>
                                            <Button variant="ghost" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexViewTooltip}</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('buildings.edit', building.id)}>
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
                                                    router.delete(route('buildings.destroy', building.id));
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
                    }[column.getIsSorted() as string] ?? (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={route("buildings.show", row.original.id)}
                    className={`${commonStyles.text} px-4 hover:underline`}
                >
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
                <span className="font-semibold px-8">{row.getValue("floors")}</span>
            ),
            sortingFn: "basic",
        },
    ];
};

export default function BuildingsIndex({
                                           buildings,
                                           flash,
                                           isSuperLibrarian = false,
                                           lang = "kh",
                                       }: BuildingsIndexProps) {
    const t = translations["kh"];
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
