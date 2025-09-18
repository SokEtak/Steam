import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowUpDown,
    CheckCircle2Icon,
    ChevronDown,
    Columns2, Download,
    EyeIcon, EyeOff,
    Filter as FilterIcon, ImageOff,
    MoreHorizontal,
    PencilIcon,
    Plus,
    TrashIcon,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: '/books',
    },
];

interface AuthUser {
    id: number;
    name: string;
    role_id: number;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface SubjectOption {
    id: number;
    name: string;
}

interface BookcaseOption {
    id: number;
    code: string;
}

interface ShelfOption {
    id: number;
    code: string;
}

interface GradeOption {
    id: number;
    name: string;
}

    interface CampusOption {
    id: number;
    name: string;
}

interface SubcategoryOption {
    id: number;
    name: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    books: Book[];
    availableCategories: CategoryOption[];
    availableSubcategories: SubcategoryOption[];
    availableSubjects: SubjectOption[];
    availableBookcases: BookcaseOption[];
    availableShelves: ShelfOption[];
    availableGrades: GradeOption[];
    availableCampuses: CampusOption[];
    isSuperLibrarian: boolean;
    auth: {
        user: AuthUser;
    };
}

interface Book {
    id: number;
    title: string;
    description: string;
    page_count: number;
    publisher: string;
    language: string;
    published_at: string;
    cover: string;
    pdf_url: string;
    flip_link: string;
    view: number;
    is_available: boolean;
    author: string;
    code: string;
    isbn: string;
    type: string;
    downloadable: boolean;
    category_id: number;
    subcategory_id: number;
    bookcase_id: number;
    shelf_id: number;
    subject_id: number;
    grade_id: number;
    campus_id: number;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
    campus?: {
        id: number;
        name: string;
    };
    subcategory?: {
        id: number;
        name: string;
    };
    subject?: {
        id: number;
        name: string;
    };
    bookcase?: {
        id: number;
        code: string;
    };
    shelf?: {
        id: number;
        code: string;
    };
    grade?: {
        id: number;
        name: string;
    };
}

const getColumns = (
    setBookToDelete: React.Dispatch<React.SetStateAction<Book | null>>,
    processing: boolean,
    isSuperLibrarian: boolean,
    availableCategories: CategoryOption[],
    availableSubcategories: SubcategoryOption[],
    availableSubjects: SubjectOption[],
    availableBookcases: BookcaseOption[],
    availableShelves: ShelfOption[],
    availableGrades: GradeOption[],
    availableYears: string[],
    availableUsers: string[],
    availableCampuses: CampusOption[],
    setRowModal: React.Dispatch<React.SetStateAction<Book | null>>,
): ColumnDef<Book>[] => {
    const getArrowColor = (sorted: string | false) => {
        if (sorted === 'asc') return 'text-blue-500';
        if (sorted === 'desc') return 'text-red-500';
        return 'text-gray-400';
    };

    return [
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <TooltipProvider>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4 text-blue-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-auto min-w-0">
                                <DropdownMenuItem asChild className="p-1">
                                    <Link href={route('books.show', book.id)}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="h-4 w-4 cursor-pointer p-0">
                                                    <EyeIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center">
                                                View
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                </DropdownMenuItem>
                                {!isSuperLibrarian &&
                                    <>
                                        <DropdownMenuItem asChild className="p-1">
                                            <Link href={route('books.edit', book.id)}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" className="h-4 w-4 cursor-pointer p-0">
                                                            <PencilIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" align="center">
                                                        Edit
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setBookToDelete(book)} className="p-1 text-red-600" disabled={processing}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="h-4 w-4 cursor-pointer p-0">
                                                        <TrashIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" align="center">
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                        </DropdownMenuItem>
                                    </>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipProvider>
                );
            },
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    ID
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className={`ml-2 h-4 w-4 ${getArrowColor('asc')}`} />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className={`ml-2 h-4 w-4 ${getArrowColor('desc')}`} />
                    ) : (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${getArrowColor(false)}`} />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('id')}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Title
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('title')}</div>,
        },
        {
            accessorKey: 'author',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Author
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('author')}</div>,
        },
        {
            accessorKey: 'cover',
            header: 'Cover',
            cell: ({ row }) =>
                row.getValue('cover') ? (
                    //for local
                    // <img src={'/storage/' + row.getValue('cover')} alt="Book cover" className="h-12 w-8 object-cover" />
                    //for production
                    <img src={row.getValue('cover')} alt="Book cover" className="h-12 w-8 object-cover" />
                ) : (
                    <ImageOff className="h-10 w-8 text-red-500 dark:text-red-300" />
                ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => <div className="max-w-xs truncate px-3">{row.getValue('description') || 'N/A'}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'page_count',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Page Count
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('page_count') || 'N/A'}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'publisher',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Publisher
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('publisher') || 'N/A'}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'language',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Language</span>
                        <DropdownMenu open={isLanguageDropdownOpen} onOpenChange={setIsLanguageDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Language</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsLanguageDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Languages</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="kh">Khmer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => {
                const language = row.getValue('language');
                const displayLanguage = language === 'en' ? 'English' : language === 'kh' ? 'Khmer' : 'N/A';
                return <div className="px-3">{displayLanguage}</div>;
            },
            filterFn: (row, columnId, filterValue) => {
                const language = String(row.getValue(columnId)).toLowerCase();
                return filterValue === '' || language === filterValue.toLowerCase();
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'published_at',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isPublishedAtDropdownOpen, setIsPublishedAtDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Published Year</span>
                        <DropdownMenu open={isPublishedAtDropdownOpen} onOpenChange={setIsPublishedAtDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Published Year</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsPublishedAtDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Years</SelectItem>
                                        {availableYears.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue('published_at'));
                return <div className="px-2">{isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US')}</div>;
            },
            filterFn: (row, columnId, filterValue) => {
                const filterYearString = String(filterValue);
                if (filterYearString === '' || filterYearString === 'All') {
                    return true;
                }
                const publishedAt = row.original.published_at;
                if (!publishedAt) {
                    return false;
                }
                const year = new Date(publishedAt).getFullYear().toString();
                return year === filterYearString;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: 'pdf_url',
            header: 'PDF',
            cell: ({ row }) =>
                row.getValue('pdf_url') ? (
                    <a href={'/storage/' + row.getValue('pdf_url')} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View PDF
                    </a>
                ) : (
                    <div className="px-3">N/A</div>
                ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'flip_link',
            header: 'Flip Link',
            cell: ({ row }) =>
                row.getValue('flip_link') ? (
                    <a href={row.getValue('flip_link')} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Flip
                    </a>
                ) : (
                    <div className="px-3">N/A</div>
                ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'view',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Views
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <div className="px-3">{row.getValue('view') || 0}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'is_available',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isAvailabilityDropdownOpen, setIsAvailabilityDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Availability
                        </Button>
                        <DropdownMenu open={isAvailabilityDropdownOpen} onOpenChange={setIsAvailabilityDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Availability</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsAvailabilityDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="true">Available</SelectItem>
                                        <SelectItem value="false">Not Available</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) =>
                <div className="px-10">{row.getValue('is_available')
                ?   <EyeIcon className={"text-blue-500 dark:text-blue-300"}/> :
                    <EyeOff className={"text-red-500 dark:text-red-300"}/>}
                </div>,
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === '' || filterValue === 'All') {
                    return true;
                }
                // Convert boolean to string for comparison
                const isAvailable = row.getValue(columnId) ? 'true' : 'false';
                return isAvailable === filterValue;
            },
            sortingFn: (rowA, rowB) => {
                // Sort by boolean is_available: true (Available) comes before false (Not Available)
                const valueA = rowA.getValue('is_available') ? 1 : 0;
                const valueB = rowB.getValue('is_available') ? 1 : 0;
                return valueB - valueA; // true comes first in ascending order
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => <div className="px-0">{row.getValue('code') || 'N/A'}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'isbn',
            header: 'ISBN',
            cell: ({ row }) => <div className="px-3">{row.getValue('isbn') || 'N/A'}</div>,
            enableHiding: true,
        },
        {
            accessorKey: 'type',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Type</span>
                        <DropdownMenu open={isTypeDropdownOpen} onOpenChange={setIsTypeDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Type</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsTypeDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Book Types</SelectItem>
                                        <SelectItem value="physical">Physical</SelectItem>
                                        <SelectItem value="ebook">E-Book</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-3 capitalize">{row.getValue('type') || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === '' || filterValue === 'All') {
                    return true;
                }
                return String(row.getValue(columnId)).toLowerCase() === filterValue.toLowerCase();
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'downloadable',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isDownloadableDropdownOpen, setIsDownloadableDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Downloadable</span>
                        <DropdownMenu open={isDownloadableDropdownOpen} onOpenChange={setIsDownloadableDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Downloadable</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsDownloadableDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="1">Downloadable</SelectItem>
                                        <SelectItem value="0">Not Downloadable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) =>
                <div className="px-10">{row.getValue('downloadable') === 1 ?
                <Download className={"text-blue-500 dark:text-blue-300"}/> : <Download className={"text-red-500 dark:text-red-300"}/>}</div>,
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === '' || filterValue === 'All') {
                    return true;
                }
                return String(row.getValue(columnId)) === filterValue;
            },
            enableSorting: false,
            enableHiding: true,
        },
        ...(isSuperLibrarian
            ? [
                {
                    accessorKey: 'Posted By',
                    header: ({ column }) => {
                        const filterValue = (column.getFilterValue() || '') as string;
                        const [isPostedByDropdownOpen, setIsPostedByDropdownOpen] = useState(false);

                        return (
                            <div className="flex items-center space-x-2">
                                Posted By
                                <DropdownMenu open={isPostedByDropdownOpen} onOpenChange={setIsPostedByDropdownOpen}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                        {/*<FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />*/}
                                                        <span className="sr-only">Open filter menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>Filter by Posted By</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <DropdownMenuContent align="start" className="w-[180px] p-2">
                                        <Select
                                            value={filterValue}
                                            onValueChange={(value) => {
                                                column.setFilterValue(value === 'All' ? '' : value);
                                                setIsPostedByDropdownOpen(false);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select User" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Users</SelectItem>
                                                {availableUsers.map((userName) => (
                                                    <SelectItem key={userName} value={userName}>
                                                        {userName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                    cell: ({ row }) => <div className="px-3">{row.original.user?.name || 'N/A'}</div>,
                    filterFn: (row, columnId, filterValue) => {
                        const userName = row.original.user?.name?.toLowerCase() || '';
                        return filterValue === '' || userName.includes(String(filterValue).toLowerCase());
                    },
                    sortingFn: (rowA, rowB) => {
                        const nameA = rowA.original.user?.name?.toLowerCase() || '';
                        const nameB = rowB.original.user?.name?.toLowerCase() || '';
                        return nameA.localeCompare(nameB);
                    },
                    enableSorting: true,
                    enableHiding: true,
                },
            ]
            : []),
        {
            accessorKey: 'category',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Category</span>
                        <DropdownMenu open={isCategoryDropdownOpen} onOpenChange={setIsCategoryDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Category</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsCategoryDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {availableCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.category?.name || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                const categoryName = row.original.category?.name?.toLowerCase() || '';
                return categoryName.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
        },
        {
            accessorKey: 'bookcase',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isBookcaseDropdownOpen, setIsBookcaseDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Bookcase</span>
                        <DropdownMenu open={isBookcaseDropdownOpen} onOpenChange={setIsBookcaseDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Bookcase</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsBookcaseDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Bookcase" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Bookcases</SelectItem>
                                        {availableBookcases
                                            .sort((a, b) => (a.code || '').localeCompare(b.code || ''))
                                            .map((bookcase) => (
                                                <SelectItem key={bookcase.id} value={bookcase.code}>
                                                    {bookcase.code || 'N/A'}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.bookcase?.code || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                const bookcaseCode = row.original.bookcase?.code?.toLowerCase() || '';
                return filterValue === '' || bookcaseCode.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'shelf',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isShelfDropdownOpen, setIsShelfDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Shelf</span>
                        <DropdownMenu open={isShelfDropdownOpen} onOpenChange={setIsShelfDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Shelf</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsShelfDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Shelf" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Shelves</SelectItem>
                                        {availableShelves
                                            .sort((a, b) => (a.code || '').localeCompare(b.code || ''))
                                            .map((shelf) => (
                                                <SelectItem key={shelf.id} value={shelf.code}>
                                                    {shelf.code || 'N/A'}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.shelf?.code || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                const shelfCode = row.original.shelf?.code?.toLowerCase() || '';
                return filterValue === '' || shelfCode.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
            enableHiding: true,
        },
        ...(isSuperLibrarian
            ? [
                {
                    accessorKey: 'campus',
                    header: ({ column }) => {
                        const filterValue = (column.getFilterValue() || '') as string;
                        const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);

                        return (
                            <div className="flex items-center space-x-2">
                                <span>Campus</span>
                                <DropdownMenu open={isCampusDropdownOpen} onOpenChange={setIsCampusDropdownOpen}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                        {/*<FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />*/}
                                                        <span className="sr-only">Open filter menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>Filter by Campus</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <DropdownMenuContent align="start" className="w-[180px] p-2">
                                        <Select
                                            value={filterValue}
                                            onValueChange={(value) => {
                                                column.setFilterValue(value === 'All' ? '' : value);
                                                setIsCampusDropdownOpen(false);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Campus" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Campuses</SelectItem>
                                                {availableCampuses
                                                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                                                    .map((campus) => (
                                                        <SelectItem key={campus.id} value={campus.name}>
                                                            {campus.name || 'N/A'}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                    cell: ({ row }) => <div className="px-2">{row.original.campus?.name || 'N/A'}</div>,
                    filterFn: (row, columnId, filterValue) => {
                        const campusName = row.original.campus?.name?.toLowerCase() || '';
                        return filterValue === '' || campusName.includes(String(filterValue).toLowerCase());
                    },
                    enableSorting: true,
                    enableHiding: true,
                },
            ]
            : []),
        {
            accessorKey: 'subcategory',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
                const subcategories = Array.isArray(availableSubcategories) ? availableSubcategories : [];

                return (
                    <div className="flex items-center space-x-2">
                        <span>Subcategory</span>
                        <DropdownMenu open={isSubcategoryDropdownOpen} onOpenChange={setIsSubcategoryDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Subcategory</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsSubcategoryDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Subcategories</SelectItem>
                                        {subcategories.length > 0 ? (
                                            subcategories.map((subcategory) => (
                                                <SelectItem key={subcategory.id} value={subcategory.name}>
                                                    {subcategory.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>
                                                No subcategories available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.subcategory?.name || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || filterValue === 'All') return true;
                const subcategoryName = row.original.subcategory?.name?.toLowerCase() || '';
                return subcategoryName.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: 'grade',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
                const grades = Array.isArray(availableGrades) ? availableGrades : [];

                return (
                    <div className="flex items-center space-x-2">
                        <span>Grade</span>
                        <DropdownMenu open={isGradeDropdownOpen} onOpenChange={setIsGradeDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Grade</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsGradeDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Grades</SelectItem>
                                        {grades.map((grade) => (
                                            <SelectItem key={grade.id} value={grade.name}>
                                                {grade.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.grade?.name || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                const gradeName = row.original.grade?.name?.toLowerCase() || '';
                return gradeName.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
        },
        {
            accessorKey: 'subject',
            header: ({ column }) => {
                const filterValue = (column.getFilterValue() || '') as string;
                const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

                return (
                    <div className="flex items-center space-x-2">
                        <span>Subject</span>
                        <DropdownMenu open={isSubjectDropdownOpen} onOpenChange={setIsSubjectDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? 'text-blue-500' : 'text-gray-400'}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Filter by Subject</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="w-[180px] p-2">
                                <Select
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === 'All' ? '' : value);
                                        setIsSubjectDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Subjects</SelectItem>
                                        {availableSubjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.name}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => <div className="px-2">{row.original.subject?.name || 'N/A'}</div>,
            filterFn: (row, columnId, filterValue) => {
                const subjectName = row.original.subject?.name?.toLowerCase() || '';
                return subjectName.includes(String(filterValue).toLowerCase());
            },
            enableSorting: false,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Created At
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at'));
                return (
                    <div className="px-2">
                        {isNaN(date.getTime())
                            ? 'N/A'
                            : date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                hour12: false,
                            })}
                    </div>
                );
            },
            enableHiding: true,
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Updated At
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('updated_at'));
                return (
                    <div className="px-2">
                        {isNaN(date.getTime())
                            ? 'N/A'
                            : date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                hour12: false,
                            })}
                    </div>
                );
            },
            enableHiding: true,
        },
    ];
};

function BookIndex() {
    const {
        flash,
        books,
        isSuperLibrarian,
        availableCategories,
        availableSubcategories,
        availableSubjects,
        availableBookcases,
        availableShelves,
        availableGrades,
        availableCampuses,
    } = usePage<PageProps>().props;
    const [showAlert, setShowAlert] = useState<'success' | 'error' | null>(null);
    const { processing, delete: destroy } = useForm();
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [rowModal, setRowModal] = useState<Book | null>(null);
    const [hoveredRow, setHoveredRow] = useState<Book | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (flash.message) {
            setShowAlert('success');
        } else if (flash.error) {
            setShowAlert('error');
        } else {
            setShowAlert(null);
        }

        const timer = setTimeout(() => {
            setIsTableLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [flash.message, flash.error, books]);


    const availableYears = useMemo(() => {
        const years = new Set<string>();
        books.forEach((book) => {
            if (book.published_at) {
                const date = new Date(book.published_at);
                if (isNaN(date.getTime())) {
                    console.warn('Invalid published_at for book:', book, 'Published At:', book.published_at);
                } else {
                    const year = date.getFullYear().toString();
                    years.add(year);
                }
            }
        });
        return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
    }, [books]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        description: false,
        page_count: false,
        publisher: false,
        language: true,
        pdf_url: false,
        flip_link: false,
        view: false,
        code: true,
        isbn: false,
        cover: true,
        type: true,
        downloadable: false,
        'Posted By': isSuperLibrarian,
        is_available: true,
        category: false,
        subcategory: false,
        subject: false,
        bookcase: true,
        shelf: false,
        grade: false,
        published_at: false,
        campus: isSuperLibrarian,
        created_at: false,
        updated_at: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState('');

    const availableUsers = useMemo(() => {
        const users = new Set<string>();
        books.forEach((book) => {
            if (book.user?.name) {
                users.add(book.user.name);
            }
        });
        return Array.from(users).sort();
    }, [books]);

    const columns = useMemo(
        () =>
            getColumns(
                setBookToDelete,
                processing,
                isSuperLibrarian,
                availableCategories,
                availableSubcategories,
                availableSubjects,
                availableBookcases,
                availableShelves,
                availableGrades,
                availableYears,
                availableCampuses,
                availableUsers,
                setRowModal,
            ),
        [
            setBookToDelete,
            processing,
            isSuperLibrarian,
            availableCategories,
            availableSubcategories,
            availableSubjects,
            availableBookcases,
            availableShelves,
            availableGrades,
            availableYears,
            availableCampuses,
            availableUsers,
            setRowModal,
        ],
    );

    const table = useReactTable({
        data: books,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            //specify which column sortable
            const search = String(filterValue).toLowerCase();
            const title = String(row.original.title).toLowerCase();
            const code = String(row.original.code).toLowerCase();
            const isbn = String(row.original.isbn).toLowerCase();
            const author = String(row.original.author).toLowerCase();
            const description = String(row.original.description || '').toLowerCase();
            const campus = String(row.original.campus).toLowerCase();
            const postedBy = String(row.original.user?.name).toLowerCase();
            const flip_link = String(row.original.flip_link).toLowerCase();
            const created_at = String(row.original.created_at).toLowerCase();
            const updated_at = String(row.original.updated_at).toLowerCase();
            console.log(postedBy)
            const publisher = String(row.original.publisher || '').toLowerCase();
            return title.includes(search) ||
                   publisher.includes(search)||
                   author.includes(search) ||
                   code.includes(search) ||
                   isbn.includes(search) ||
                   description.includes(search) ||
                   flip_link.includes(search) ||
                   campus.includes(search) ||
                   postedBy.includes(search)||
                   created_at.includes(search)||
                   updated_at.includes(search);
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        if (flash.message) setShowAlert(true);
        const timer = setTimeout(() => {
            setIsTableLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [flash.message, books]);

    const handleCloseAlert = () => setShowAlert(false);

    const confirmDelete = () => {
        if (bookToDelete) {
            destroy(route('books.destroy', bookToDelete.id), {
                onSuccess: () => {
                    setBookToDelete(null);
                },
                onError: () => {
                    setBookToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Books" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                {showAlert && (flash.message || flash.error) && (
                    <Alert
                        className={`mb-0 flex items-start justify-between ${
                            showAlert === 'error' ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200' : 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                    >
                        <div className="flex gap-2">
                            <CheckCircle2Icon className="h-4 w-4" />
                            <div>
                                <AlertTitle>{showAlert === 'error' ? 'Error' : 'Success'}</AlertTitle>
                                <AlertDescription>{flash.message || flash.error}</AlertDescription>
                            </div>
                        </div>
                        <Button onClick={handleCloseAlert} className="cursor-pointer text-sm font-medium" disabled={processing}>
                            ×
                        </Button>
                    </Alert>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            placeholder="Search"
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="sm:max-w-4xl max-w-2xl  flex-grow sm:flex-grow-0"
                            disabled={isTableLoading || processing}
                        />
                    </div>

                    <div className="ml-auto flex flex-wrap items-center gap-2">
                        {/*add a button*/}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/*hide button*/}
                                            {!isSuperLibrarian&&
                                                <Link href={route('books.create')} className="flex items-center gap-2">
                                                    <Button
                                                        className="h-8 cursor-pointer rounded-lg border-blue-300 bg-blue-400 text-black hover:bg-blue-600 dark:border-blue-500 dark:bg-gray-800 dark:text-blue-200 dark:hover:bg-blue-700"
                                                        size="sm"
                                                        disabled={isTableLoading || processing}
                                                    >
                                                        <Plus className="h-4 w-4 " />
                                                    </Button>
                                                </Link>
                                            }
                                        </TooltipTrigger>
                                        <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                                            <p>Add a new book</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                                    <p>Add a new book</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {/*column visibility customization */}
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="h-8 rounded-lg border-blue-200 bg-white text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-blue-800"
                                                        disabled={isTableLoading || processing}
                                                    >
                                                        <Columns2 className="h-4 w-4" /> Customize Columns <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {table
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={column.id}
                                                                className="text-sm capitalize"
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                disabled={isTableLoading || processing}
                                                            >
                                                                {column.id.replace(/_/g, ' ')}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                                        Click to Show or Hide Specific Columns
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            disabled={isTableLoading || processing}
                                        >
                                            {column.id.replace(/_/g, ' ')}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-2">
                            {isTableLoading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                <span className="text-sm font-medium">
                                    {`${table.getFilteredRowModel().rows.length} filtered out of ${books.length} books`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-blue-500 dark:border-blue-400">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-blue-50 dark:bg-blue-900">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {isTableLoading ? (
                            <TableBody>
                                {Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TooltipProvider key={row.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableRow
                                                        key={row.id}
                                                        className="cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900"
                                                        onMouseEnter={() => setHoveredRow(row.original)}
                                                        onMouseLeave={() => setHoveredRow(null)}
                                                        onClick={() => setRowModal(row.original)}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="py-2 text-sm text-gray-800 dark:text-gray-100">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="left"
                                                    className="max-w-md rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 p-4 text-white shadow-xl dark:from-gray-800 dark:to-gray-600"
                                                >
                                                    <div className="space-y-2">
                                                        <p>
                                                            <strong className="text-blue-200">Title:</strong> {row.original.title}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Author:</strong> {row.original.author}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Description:</strong>{' '}
                                                            {row.original.description?.slice(0, 60) || 'No description'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Publisher:</strong> {row.original.publisher || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Language:</strong>{' '}
                                                            {row.original.language === 'en'
                                                                ? 'English'
                                                                : row.original.language === 'kh'
                                                                  ? 'Khmer'
                                                                  : 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Page Count:</strong> {row.original.page_count || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Published At:</strong>{' '}
                                                            {row.original.published_at
                                                                ? new Date(row.original.published_at).toLocaleDateString('en-US')
                                                                : 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">ISBN:</strong> {row.original.isbn || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Code:</strong> {row.original.code || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Type:</strong> {row.original.type || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Availability:</strong>{' '}
                                                            {row.original.is_available ? 'Available' : 'Not Available'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Downloadable:</strong>{' '}
                                                            {row.original.downloadable ? 'Yes' : 'No'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Views:</strong> {row.original.view || 0}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Category:</strong>{' '}
                                                            {row.original.category ? (
                                                                <Link
                                                                    href={route('categories.show', row.original.category.id)}
                                                                    className="text-blue-300 underline hover:text-blue-100"
                                                                >
                                                                    {row.original.category.name}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Bookcase:</strong>{' '}
                                                            {row.original.bookcase ? (
                                                                <Link
                                                                    href={route('bookcases.show', row.original.bookcase.id)}
                                                                    className="text-blue-300 underline hover:text-blue-100"
                                                                >
                                                                    {row.original.bookcase.code}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Subcategory:</strong>{' '}
                                                            {row.original.subcategory ? (
                                                                <Link
                                                                    href={route('subcategories.show', row.original.subcategory.id)}
                                                                    className="text-blue-300 underline hover:text-blue-100"
                                                                >
                                                                    {row.original.subcategory.name}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Subject:</strong> {row.original.subject?.name || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Bookcase:</strong>{' '}
                                                            {row.original.bookcase ? (
                                                                <Link
                                                                    href={route('bookcases.show', row.original.bookcase.id)}
                                                                    className="text-blue-300 underline hover:text-blue-100"
                                                                >
                                                                    {row.original.bookcase.code}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Shelf:</strong>{' '}
                                                            {row.original.shelf ? (
                                                                <Link
                                                                    href={route('shelves.show', row.original.shelf.id)}
                                                                    className="text-blue-300 underline hover:text-blue-100"
                                                                >
                                                                    {row.original.shelf.code}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>

                                                        {isSuperLibrarian && <>
                                                            <p>
                                                                <strong className="text-blue-200">Posted By:</strong>{' '}
                                                                {row.original.user? (
                                                                    <Link
                                                                        href={""}
                                                                        className="text-blue-300 underline hover:text-blue-100"
                                                                    >
                                                                        {row.original.user.name}
                                                                    </Link>
                                                                ) : (
                                                                    'N/A'
                                                                )}
                                                            </p>

                                                            <p>
                                                                <strong className="text-blue-200">Campus:</strong> {row.original.campus?.name || 'N/A'}
                                                            </p>
                                                        </>
                                                        }

                                                        <p>
                                                            <strong className="text-blue-200">PDF URL:</strong>{' '}
                                                            {row.original.pdf_url ? (
                                                                <a
                                                                    href={`/storage/${row.original.pdf_url}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-300 underline hover:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    Preview PDF
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-500">N/A</span>
                                                            )}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Grade:</strong> {row.original.grade?.name || 'N/A'}
                                                        </p>
                                                        {row.original.flip_link && (
                                                            <p>
                                                                <strong className="text-blue-200">Flip Link:</strong>{' '}
                                                                <a
                                                                    href={row.original.flip_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="underline"
                                                                >
                                                                    View Flip
                                                                </a>
                                                            </p>
                                                        )}
                                                        <p>
                                                            <strong className="text-blue-200">Created At:</strong>{' '}
                                                            {row.original.created_at
                                                                ? new Date(row.original.created_at).toLocaleDateString('en-US', {
                                                                      year: 'numeric',
                                                                      month: 'long',
                                                                      day: 'numeric',
                                                                      hour: 'numeric',
                                                                      minute: 'numeric',
                                                                      second: 'numeric',
                                                                      hour12: false,
                                                                  })
                                                                : 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Updated At:</strong>{' '}
                                                            {row.original.updated_at
                                                                ? new Date(row.original.updated_at).toLocaleDateString('en-US', {
                                                                      year: 'numeric',
                                                                      month: 'long',
                                                                      day: 'numeric',
                                                                      hour: 'numeric',
                                                                      minute: 'numeric',
                                                                      second: 'numeric',
                                                                      hour12: false,
                                                                  })
                                                                : 'N/A'}
                                                        </p>
                                                        <p>
                                                            <strong className="text-blue-200">Cover:</strong>{' '}
                                                            {row.original.cover ? (
                                                                <img
                                                                    src={'/storage/' + row.original.cover}
                                                                    alt="Book cover"
                                                                    className="h-36 w-26 rounded border border-blue-300 object-cover shadow"
                                                                />
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-gray-600 dark:text-gray-300">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>

                    {/* Big Modal on Row Click */}
                    {rowModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                            <div className="pointer-events-auto h-auto w-full max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-2xl border border-blue-300 bg-white p-3 sm:p-4 md:p-6 shadow-2xl dark:border-blue-500 dark:bg-gray-800 overflow-y-auto max-h-[100vh]">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 dark:text-blue-200">{rowModal.title}</h2>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="h-8 w-8 cursor-pointer rounded-full text-blue-700 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-700"
                                        onClick={() => setRowModal(null)}
                                        aria-label="Close modal"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                                    {/* Book Info Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">Book Information</h3>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Author:</strong> {rowModal.author || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Description:</strong> {rowModal.description || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Publisher:</strong> {rowModal.publisher || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Language:</strong>{' '}
                                            {rowModal.language === 'en' ? 'English' : rowModal.language === 'kh' ? 'Khmer' : 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Page Count:</strong> {rowModal.page_count || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Published At:</strong>{' '}
                                            {rowModal.published_at ? new Date(rowModal.published_at).toLocaleDateString('en-US') : 'N/A'}
                                        </p>
                                    </div>

                                    {/* Categorization Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">Categorization</h3>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Category:</strong>{' '}
                                            {rowModal.category ? (
                                                <Link
                                                    href={route('categories.show', rowModal.category.id)}
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                >
                                                    {rowModal.category.name}
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Bookcase:</strong>{' '}
                                            {rowModal.bookcase ? (
                                                <Link
                                                    href={route('bookcases.show', rowModal.bookcase.id)}
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                >
                                                    {rowModal.bookcase.code}
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Subcategory:</strong>{' '}
                                            {rowModal.subcategory ? (
                                                <Link
                                                    href={route('subcategories.show', rowModal.subcategory.id)}
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                >
                                                    {rowModal.subcategory.name}
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Subject:</strong> {rowModal.subject?.name || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Shelf:</strong>{' '}
                                            {rowModal.shelf ? (
                                                <Link
                                                    href={route('shelves.show', rowModal.shelf.id)}
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                >
                                                    {rowModal.shelf.code}
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Grade:</strong> {rowModal.grade?.name || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Links Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">Links & Media</h3>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">PDF URL:</strong>{' '}
                                            {rowModal.pdf_url ? (
                                                <a
                                                    href={`/storage/${rowModal.pdf_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Preview PDF
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        {rowModal.flip_link && (
                                            <p>
                                                <strong className="text-blue-600 dark:text-blue-300">Flip Link:</strong>{' '}
                                                <a
                                                    href={rowModal.flip_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                >
                                                    View Flip
                                                </a>
                                            </p>
                                        )}
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Cover:</strong>{' '}
                                            {rowModal.cover ? (
                                                <img
                                                    src={`/storage/${rowModal.cover}`}
                                                    alt="Book cover"
                                                    className="h-full w-60 rounded border border-blue-300 object-cover shadow"
                                                    onError={(e) => (e.currentTarget.src = '/images/fallback-cover.jpg')}
                                                />
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                    </div>

                                    {/* Metadata Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">Metadata</h3>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">ISBN:</strong> {rowModal.isbn || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Code:</strong> {rowModal.code || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Type:</strong> {rowModal.type || 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Availability:</strong>{' '}
                                            {rowModal.is_available ? 'Available' : 'Not Available'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Downloadable:</strong>{' '}
                                            {rowModal.downloadable ? 'Yes' : 'No'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Views:</strong> {rowModal.view || 0}
                                        </p>

                                        {isSuperLibrarian &&
                                            <>
                                                <p>
                                                    <strong className="text-blue-600 dark:text-blue-300">Posted By:</strong>{' '}
                                                    {rowModal.user? (
                                                        <Link
                                                            href={""}
                                                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-200 dark:hover:text-blue-100"
                                                        >
                                                            {rowModal.user.name}
                                                        </Link>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </p>

                                                    <p>
                                                        <strong className="text-blue-600 dark:text-blue-300">Campus:</strong> {rowModal.campus?.name || 'N/A'}
                                                    </p>
                                            </>
                                        }



                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Created At:</strong>{' '}
                                            {rowModal.created_at
                                                ? new Date(rowModal.created_at).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                      hour: 'numeric',
                                                      minute: 'numeric',
                                                      second: 'numeric',
                                                      hour12: false,
                                                  })
                                                : 'N/A'}
                                        </p>
                                        <p>
                                            <strong className="text-blue-600 dark:text-blue-300">Updated At:</strong>{' '}
                                            {rowModal.updated_at
                                                ? new Date(rowModal.updated_at).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                      hour: 'numeric',
                                                      minute: 'numeric',
                                                      second: 'numeric',
                                                      hour12: false,
                                                  })
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <Link href={route('books.show', rowModal.id)}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border-blue-300 bg-white text-blue-700 hover:bg-blue-100 dark:border-blue-500 dark:bg-gray-800 dark:text-blue-200 dark:hover:bg-blue-700"
                                        >
                                            <EyeIcon className="h-4 w-4" /> View
                                        </Button>
                                    </Link>

                                    {!isSuperLibrarian && (
                                        <>
                                            <Link href={route('books.edit', rowModal.id)}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border-blue-300 bg-white text-blue-700 hover:bg-blue-100 dark:border-blue-500 dark:bg-gray-800 dark:text-blue-200 dark:hover:bg-blue-700"
                                                >
                                                    <PencilIcon className="h-4 w-4" /> Edit
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border-red-300 bg-white text-red-600 hover:bg-red-100 dark:border-red-500 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-700"
                                                onClick={() => {
                                                    setBookToDelete(rowModal);
                                                    setRowModal(null);
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4" /> Delete
                                            </Button>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Pagination Controls at Bottom */}
                <div
                    className={`flex w-full items-center justify-center gap-4 border-t py-4 ${table.getState().pagination.pageSize >= 10 ? 'sticky bottom-0 z-40' : ''}`}
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium whitespace-nowrap text-gray-800 dark:text-gray-100">Rows per page:</span>
                            <Select
                                value={String(table.getState().pagination.pageSize)}
                                onValueChange={(value) => {
                                    if (value === 'All') {
                                        table.setPageSize(table.getFilteredRowModel().rows.length);
                                    } else {
                                        table.setPageSize(Number(value));
                                    }
                                }}
                                disabled={isTableLoading || processing}
                            >
                                <SelectTrigger className="h-8 w-[120px] rounded-lg border-blue-200 bg-white text-sm text-gray-800 dark:border-blue-600 dark:bg-gray-700 dark:text-gray-100">
                                    <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                    {table.getFilteredRowModel().rows.length > 0 && (
                                        <SelectItem key="all" value="All" className="text-sm">
                                            All
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage() || isTableLoading || processing}
                                            className="rounded-lg border-blue-200 bg-white text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-blue-800"
                                        >
                                            <ArrowLeft className={`h-4 w-4 ${table.getCanPreviousPage() ? 'text-blue-500' : 'text-gray-400'}`} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                                        Previous Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage() || isTableLoading || processing}
                                            className="rounded-lg border-blue-200 bg-white text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-blue-800"
                                        >
                                            <ArrowRight className={`h-4 w-4 ${table.getCanNextPage() ? 'text-blue-500' : 'text-gray-400'}`} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-white">
                                        Next Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="text-sm text-gray-800 dark:text-gray-100">
                            {isTableLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
                            )}
                        </div>
                    </div>
                </div>

                <AlertDialog open={!!bookToDelete} onOpenChange={(openState) => !openState && setBookToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete <strong>{bookToDelete?.title}</strong> by{' '}
                                <strong>{bookToDelete?.author}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setBookToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} disabled={processing}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}

export default BookIndex;
