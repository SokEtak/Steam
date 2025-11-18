"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { translations } from '@/utils/translations/asset-transaction/asset-transaction';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreHorizontal, Trash2, ArrowRight, Building, DoorOpen, User, Pencil } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Asset { id: number; name: string; }
interface User { id: number; name: string; }
interface Department { id: number; name: string; }
interface Room { id: number; name: string; }

interface AssetTransaction {
    id: number;
    asset: Asset;
    type: string;
    from_department?: Department | null;
    to_department?: Department | null;
    from_room?: Room | null;
    to_room?: Room | null;
    performer: User;
    performed_at: string;
    note?: string;
    created_at: string;
}

interface Props {
    assetTransactions: { data: AssetTransaction[]; current_page: number; last_page: number };
    assets: Asset[];
    filters?: any;
    flash?: { message?: string };
    isSuperLibrarian?: boolean;
    lang?: 'kh' | 'en';
}

const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="p-0 font-medium hover:bg-transparent">
            {label}
            {isSorted === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> :
                isSorted === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> :
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-40" />}
        </Button>
    );
};

const TypeBadge = ({ type }: { type: string }) => {
    const t = translations.en;

    const variants: Record<string, string> = {
        received: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        allocated: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        returned: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
        transfer: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
        maintenance_start: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        maintenance_end: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
        disposed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };

    return (
        <Badge
            variant="secondary"
            className={`
                ${variants[type] || 'bg-gray-100 dark:bg-gray-800'}
                font-medium text-xs px-2.5 py-0.5
                whitespace-nowrap overflow-hidden
                max-w-full inline-block
            `}
            title={t.types[type] || type.replace('_', ' ')}  // Tooltip on hover
        >
            <span className="truncate block max-w-32">
                {t.types[type] || type.replace('_', ' ')}
            </span>
        </Badge>
    );
};

const LocationDisplay = ({ dept, room }: { dept?: Department | null; room?: Room | null }) => {
    if (!dept && !room) return <span className="text-muted-foreground">-</span>;

    return (
        <div className="space-y-1">
            {dept && (
                <div className="flex items-center gap-2 text-sm">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dept.name}</span>
                </div>
            )}
            {room && (
                <div className="flex items-center gap-2 text-sm">
                    <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{room.name}</span>
                </div>
            )}
        </div>
    );
};

export default function AssetTransactionsIndex({
                                                   assetTransactions,
                                                   assets,
                                                   filters = {},
                                                   flash,
                                                   isSuperLibrarian = false,
                                                   lang = 'en'
                                               }: Props) {
    const t = translations[lang] || translations.en;
    const { processing } = useForm();

    const [search, setSearch] = useState(filters.search || '');
    const [assetId, setAssetId] = useState(filters.asset_id || '');
    const [type, setType] = useState(filters.type || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = { search, asset_id: assetId || undefined, type: type || undefined };
            if (sorting[0]) {
                params.sort = sorting[0].id;
                params.direction = sorting[0].desc ? 'desc' : 'asc';
            }
            router.get(route('asset-transactions.index'), params, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, assetId, type, sorting]);

    const columns: ColumnDef<AssetTransaction>[] = useMemo(() => [
        {
            id: 'actions',
            size: 100,
            cell: ({ row }) => {
                const tx = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        {/* Horizontal Action Bar */}
                        <DropdownMenuContent align="end" className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border shadow-lg rounded-xl">
                            {/* View */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('asset-transactions.show', tx.id)}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                            >
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">{t.indexViewTooltip}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Edit */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('asset-transactions.edit', tx.id)}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                            >
                                                <Pencil className="h-4 w-4 text-amber-600" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">{t.indexEditTooltip || "Edit"}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Delete */}
                            {isSuperLibrarian && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                                                disabled={processing}
                                                onClick={() => confirm(t.indexDeleteConfirm) && router.delete(route('asset-transactions.destroy', tx.id))}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">{t.indexDeleteTooltip}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },

        { id: 'id', accessorKey: 'id', header: ({ column }) => sortableHeader(column, t.indexId) },
        { id: 'asset', accessorKey: 'asset.name', header: t.indexAsset },

        {
            id: 'type',
            accessorKey: 'type',
            header: ({ column }) => sortableHeader(column, t.indexType),
            cell: ({ row }) => <TypeBadge type={row.original.type} />,
        },

        {
            id: 'movement',
            header: t.indexMovement,
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex items-center gap-3 text-sm">
                        <LocationDisplay dept={tx.from_department} room={tx.from_room} />
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <LocationDisplay dept={tx.to_department} room={tx.to_room} />
                    </div>
                );
            },
        },

        {
            id: 'performer',
            accessorKey: 'performer.name',
            header: t.indexPerformedBy,
            cell: ({ row }) => {
                const user = row.original.performer;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                    </div>
                );
            },
        },

        {
            id: 'performed_at',
            accessorKey: 'performed_at',
            header: ({ column }) => sortableHeader(column, t.indexPerformedAt),
            cell: ({ row }) => {
                const date = new Date(row.original.performed_at);
                return (
                    <div className="text-sm px-6">
                        <div>{date.toLocaleDateString()}</div>
                        <div className="text-muted-foreground mx-2">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                );
            },
        },

        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: t.showCreated,
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
    ], [t, processing, isSuperLibrarian]);

    return (
        <DataTable
            data={assetTransactions.data}
            columns={columns}
            title={t.indexTitle}
            breadcrumbs={[{ title: t.indexTitle, href: route('asset-transactions.index') }]}
            resourceName="asset-transactions"
            routes={{
                index: route('asset-transactions.index'),
                create: route('asset-transactions.create'),
                show: (id) => route('asset-transactions.show', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
            extraTopContent={
                <div className="flex flex-wrap gap-6 items-end">
                    <div className="min-w-64">
                        <label className="text-sm font-medium">{t.indexSearch}</label>
                        <Input
                            placeholder={t.indexSearchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">{t.indexAsset}</label>
                        <Select value={assetId} onValueChange={setAssetId}>
                            <SelectTrigger className="mt-1 w-64">
                                <SelectValue placeholder={t.indexAssetPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">{t.indexAllAssets}</SelectItem>
                                {assets.map(asset => (
                                    <SelectItem key={asset.id} value={asset.id.toString()}>
                                        {asset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">{t.indexType}</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="mt-1 w-64">
                                <SelectValue placeholder={t.indexTypePlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">{t.indexAllTypes}</SelectItem>
                                {Object.keys(t.types).map(key => (
                                    <SelectItem key={key} value={key}>
                                        {t.types[key]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            }
        />
    );
}
