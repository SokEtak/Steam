"use client";

import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, router, useForm } from '@inertiajs/react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    Trash2,
    ArrowRight,
    Building,
    DoorOpen,
    Pencil,
    FilterIcon,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from '@/components/ui/command';

interface Asset { id: number; name: string; }
interface User { id: number; name: string; avatar?: string; }
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

// ប៊ូតុងតម្រៀប
const sortableHeader = (column: any, label: string) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === 'asc')}
            className="p-0 font-medium hover:bg-transparent flex items-center gap-1.5 h-8"
        >
            <span>{label}</span>
            {isSorted === 'asc' ? (
                <ArrowUp className="h-4 w-4 text-primary" />
            ) : isSorted === 'desc' ? (
                <ArrowDown className="h-4 w-4 text-primary" />
            ) : (
                <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />
            )}
        </Button>
    );
};

// ប្រភេទ (Badge)
const TypeBadge = ({ type }: { type: string }) => {
    const labels: Record<string, string> = {
        received: "ទទួល",
        allocated: "ចែកចាយ",
        returned: "ប្រគល់វិញ",
        transfer: "ផ្ទេរ",
        maintenance_start: "ចាប់ផ្ដើមជួសជុល",
        maintenance_end: "បញ្ចប់ជួសជុល",
        disposed: "បោះចោល",
    };

    const colors: Record<string, string> = {
        received: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        allocated: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
        returned: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
        transfer: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
        maintenance_start: "bg-yellow-100 text-blue-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        maintenance_end: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
        disposed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };

    const text = labels[type] || type;

    return (
        <Badge variant="secondary" className={`${colors[type] || 'bg-gray-100 dark:bg-gray-800'} font-medium text-xs px-3 py-1 rounded-full`}>
            <span className="truncate max-w-32 block">{text}</span>
        </Badge>
    );
};

// ទីតាំង
const LocationDisplay = ({ dept, room }: { dept?: Department | null; room?: Room | null }) => {
    if (!dept && !room) return <span className="text-muted-foreground text-xs">—</span>;

    return (
        <div className="space-y-1 text-sm">
            {dept && (
                <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate max-w-32">{dept.name}</span>
                </div>
            )}
            {room && (
                <div className="flex items-center gap-2">
                    <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate max-w-32">{room.name}</span>
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
                                               }: Props) {
    const { processing } = useForm();

    const [search, setSearch] = useState(filters.search || '');
    const [assetId, setAssetId] = useState(filters.asset_id || '');
    const [type, setType] = useState(filters.type || '');
    const [sorting, setSorting] = useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('asset-transactions.index'), {
                search: search || undefined,
                asset_id: assetId || undefined,
                type: type || undefined,
                sort: sorting[0]?.id,
                direction: sorting[0]?.desc ? 'desc' : 'asc',
            }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, assetId, type, sorting]);

    const columns: ColumnDef<AssetTransaction>[] = useMemo(() => [
        // សកម្មភាព
        {
            id: 'actions',
            header: () => <div className="text-center w-20">សកម្មភាព</div>,
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="flex gap-1 p-2 rounded-xl shadow-lg border bg-background">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('asset-transactions.show', tx.id)}>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-blue-50">
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>មើល</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route('asset-transactions.edit', tx.id)}>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-amber-50">
                                                <Pencil className="h-4 w-4 text-amber-600" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>កែប្រែ</TooltipContent>
                                </Tooltip>

                                {isSuperLibrarian && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-red-50"
                                                disabled={processing}
                                                onClick={() => confirm("តើអ្នកពិតជាចង់លុបមែនទេ?") && router.delete(route('asset-transactions.destroy', tx.id))}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>លុប</TooltipContent>
                                    </Tooltip>
                                )}
                            </TooltipProvider>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },

        // លេខសម្គាល់
        { accessorKey: 'id', header: ({ column }) => sortableHeader(column, "លេខសម្គាល់") },

        // ទ្រព្យសកម្ម
        { accessorKey: 'asset.name', header: ({ column }) => sortableHeader(column, "ទ្រព្យសកម្ម") },

        // ប្រភេទ
        {
            accessorKey: 'type',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() as string) || '';
                const [open, setOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        {sortableHeader(column, "ប្រភេទ")}

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    {filterValue && (
                                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-600 border-2 border-white" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="ស្វែងរកប្រភេទ..." />
                                    <CommandList>
                                        <CommandEmpty>រកមិនឃើញទេ</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem onSelect={() => { column.setFilterValue(undefined); setType(''); setOpen(false); }}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full border-2 ${!filterValue ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`} />
                                                    <span className="font-medium">ប្រភេទទាំងអស់</span>
                                                </div>
                                            </CommandItem>
                                            {['received', 'allocated', 'returned', 'transfer', 'maintenance_start', 'maintenance_end', 'disposed'].map((typeKey) => (
                                                <CommandItem
                                                    key={typeKey}
                                                    onSelect={() => { column.setFilterValue(typeKey); setType(typeKey); setOpen(false); }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full border-2 ${filterValue === typeKey ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`} />
                                                        <TypeBadge type={typeKey} />
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            },
            cell: ({ row }) => <TypeBadge type={row.original.type} />,
            filterFn: (row, _, filterValue) => !filterValue || row.original.type === filterValue,
            enableSorting: true,
        },

        // ចលនា
        {
            id: 'movement',
            header: "ចលនា",
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex items-center gap-4 text-sm">
                        <LocationDisplay dept={tx.from_department} room={tx.from_room} />
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <LocationDisplay dept={tx.to_department} room={tx.to_room} />
                    </div>
                );
            },
        },

        // អ្នកធ្វើការ
        {
            accessorKey: 'performer.name',
            header: "អ្នកធ្វើការ",
            cell: ({ row }) => {
                const user = row.original.performer;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs bg-primary/10">
                                {user.name.split(' ').map(n => n[0]?.toUpperCase()).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-32">{user.name}</span>
                    </div>
                );
            },
        },

        // កាលបរិច្ឆេទធ្វើការ
        {
            accessorKey: 'performed_at',
            header: ({ column }) => sortableHeader(column, "កាលបរិច្ឆេទ"),
            cell: ({ row }) => {
                const date = new Date(row.original.performed_at);
                return (
                    <div className="text-sm px-6">
                        <div className="font-medium">{date.toLocaleDateString('km-KH')}</div>
                        <div className="text-muted-foreground text-xs">
                            {date.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                );
            },
        },

        // បង្កើតនៅ
        {
            accessorKey: 'created_at',
            header: "បង្កើតនៅ",
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return (
                    <div className="text-sm px-1">
                        <div className="font-medium">{date.toLocaleDateString('km-KH')}</div>
                        <div className="text-muted-foreground text-xs">
                            {date.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                );
            },
        },
    ], [processing, isSuperLibrarian]);

    return (
        <DataTable
            data={assetTransactions.data}
            columns={columns}
            title="ការផ្លាស់ប្តូរទ្រព្យសកម្ម"
            breadcrumbs={[
                { title: "ទ្រព្យសកម្ម", href: route('assets.index') },
                { title: "ការផ្លាស់ប្តូរទ្រព្យសកម្ម", href: route('asset-transactions.index') }
            ]}
            resourceName="asset-transactions"
            routes={{
                index: route('asset-transactions.index'),
                create: route('asset-transactions.create'),
                show: (id) => route('asset-transactions.show', id),
            }}
            flash={flash}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
