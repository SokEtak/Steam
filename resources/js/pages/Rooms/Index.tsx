"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/utils/translations/room/room';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// === Types ===
interface Campus {
    id: number;
    name: string;
}

interface Building {
    id: number;
    name: string;
    campus: Campus;
}

interface Department {
    id: number;
    name: string;
}

interface Room {
    id: number;
    name: string;
    room_number: string;
    floor: number;
    building: Building;
    department?: Department | null;
    created_at: string;
    updated_at: string;
}

interface RoomsIndexProps {
    rooms: { data: Room[]; current_page: number; last_page: number };
    buildings: Building[];
    departments: Department[];
    filters?: {
        search?: string;
        building_id?: string;
        department_id?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

// === Reusable Dropdown Filter Component ===
interface CategoricalFilterProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ id: number; name: string; extra?: string }>;
    allOptionLabel: string;
}

const CategoricalFilter = ({
                               label,
                               placeholder,
                               value,
                               onChange,
                               options,
                               allOptionLabel,
                           }: CategoricalFilterProps) => {
    return (
        <div>
            <label className="text-sm">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="mt-1 w-64">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">{allOptionLabel}</SelectItem>
                    {options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id.toString()}>
                            {opt.name} {opt.extra && `(${opt.extra})`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

// === Columns ===
const getColumns = (
    processing: boolean,
    isSuperLibrarian: boolean,
    lang: 'kh' | 'en',
    t: any
): ColumnDef<Room>[] => {
    return [
        {
            id: 'actions',
            cell: ({ row }) => {
                const room = row.original;
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
                                        <Link href={route('rooms.show', room.id)}>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.indexViewTooltip}</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('rooms.edit', room.id)}>
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
                                                onClick={() => {
                                                    if (confirm(t.indexDeleteConfirm)) {
                                                        router.delete(route('rooms.destroy', room.id));
                                                    }
                                                }}
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
        {
            accessorKey: 'id',
            header: ({ column }) => sortableHeader(column, t.indexId),
            cell: ({ row }) => (
                <Link href={route('rooms.show', row.original.id)} className="hover:underline">
                    {row.getValue('id')}
                </Link>
            ),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => sortableHeader(column, t.indexName),
            cell: ({ row }) => (
                <Link href={route('rooms.show', row.original.id)} className="hover:underline">
                    {row.getValue('name')}
                </Link>
            ),
        },
        {
            accessorKey: 'room_number',
            header: ({ column }) => sortableHeader(column, t.indexRoomNumber),
        },
        {
            accessorKey: 'floor',
            header: ({ column }) => sortableHeader(column, t.indexFloor),
        },
        {
            accessorKey: 'building.name',
            header: t.indexBuilding,
            cell: ({ row }) => (
                <Link
                    href={route('buildings.show', row.original.building.id)}
                    className="text-indigo-600 hover:underline"
                >
                    {row.original.building.name} ({row.original.building.campus.name})
                </Link>
            ),
        },
        {
            accessorKey: 'department.name',
            header: t.indexDepartment,
            cell: ({ row }) => row.original.department ? (
                <Link
                    href={route('departments.show', row.original.department.id)}
                    className="text-indigo-600 hover:underline"
                >
                    {row.original.department.name}
                </Link>
            ) : (
                <span className="text-gray-400">—</span>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => sortableHeader(column, t.indexCreatedAt), // ← Add this
            cell: ({ row }) => {
                const date = row.getValue('created_at') as string;
                return <span className="text-sm text-gray-600">{new Date(date).toLocaleString()}</span>;
            },
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => sortableHeader(column, t.indexUpdatedAt), // ← Add this
            cell: ({ row }) => {
                const date = row.getValue('updated_at') as string;
                return <span className="text-sm text-gray-600">{new Date(date).toLocaleString()}</span>;
            },
        },
    ];
};

const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="font-medium hover:bg-transparent p-0"
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

// === Main Component ===
export default function RoomsIndex({
                                       rooms,
                                       buildings,
                                       departments,
                                       filters = {},
                                       flash,
                                       isSuperLibrarian = false,
                                       lang = 'en'
                                   }: RoomsIndexProps) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();

    const [search, setSearch] = useState(filters.search || '');
    const [buildingId, setBuildingId] = useState(filters.building_id || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    // Sync filters & sorting to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = {
                search,
                building_id: buildingId || undefined,
                department_id: departmentId || undefined,
            };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('rooms.index'), params, { preserveState: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, buildingId, departmentId, sorting]);

    const columns = useMemo(
        () => getColumns(processing, isSuperLibrarian, lang, t),
        [processing, isSuperLibrarian, lang, t]
    );

    return (
        <DataTable
            data={rooms.data}
            columns={columns}
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('rooms.index') }]}
            resourceName="rooms"
            routes={{
                index: route('rooms.index'),
                create: route('rooms.create'),
                show: (id) => route('rooms.show', id),
                edit: (id) => route('rooms.edit', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
            extraTopContent={
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Search */}
                    <div>
                        <label className="text-sm">{t.indexSearch}</label>
                        <Input
                            placeholder={t.indexSearchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1 w-64"
                        />
                    </div>

                    {/* Building Filter */}
                    <CategoricalFilter
                        label={t.indexBuilding}
                        placeholder={t.indexBuildingPlaceholder}
                        value={buildingId}
                        onChange={setBuildingId}
                        options={buildings.map(b => ({
                            id: b.id,
                            name: b.name,
                            extra: b.campus.name,
                        }))}
                        allOptionLabel={t.indexAllBuildings}
                    />

                    {/* Department Filter */}
                    <CategoricalFilter
                        label={t.indexDepartment}
                        placeholder={t.indexDepartmentPlaceholder}
                        value={departmentId}
                        onChange={setDepartmentId}
                        options={departments.map(d => ({
                            id: d.id,
                            name: d.name,
                        }))}
                        allOptionLabel={t.indexAllDepartments}
                    />
                </div>
            }
        />
    );
}
