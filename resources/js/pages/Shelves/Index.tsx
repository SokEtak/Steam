import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { X, Bell, Eye, Pencil, Trash, Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
    id: number;
    code: string;
    bookcase_id: number;
    bookcase: Bookcase | null;
    books_count: number;
}

interface ShelvesIndexProps {
    shelves: Shelves[];
    flash: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shelves',
        href: '',
    },
];

export default function ShelvesIndex({ shelves, flash }: ShelvesIndexProps) {
    const [isNotificationVisible, setIsNotificationVisible] = useState(!!flash.message);

    useEffect(() => {
        if (flash.message) {
            setIsNotificationVisible(true);
            const timer = setTimeout(() => {
                setIsNotificationVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setIsNotificationVisible(false);
        }
    }, [flash.message]);

    const handleCloseNotification = () => {
        setIsNotificationVisible(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shelves" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Shelves({shelves.length || 0})</h1>
                    <Link href={route('shelves.create')}>
                        <Button className="flex items-center gap-1">
                            <Plus className="h-5 w-5" />
                            Create New Shelf
                        </Button>
                    </Link>
                </div>
                {isNotificationVisible && flash.message && (
                    <Alert className="mb-4 relative flex items-center p-3 rounded-md">
                        <Bell className="h-5 w-5 mr-2" />
                        <div className="flex-1">
                            <AlertTitle className="text-sm font-medium text-blue-700">Notification</AlertTitle>
                            <AlertDescription className="text-sm">{flash.message}</AlertDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseNotification}
                            className="text-gray-500 hover:text-gray-700 absolute right-2 top-2"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </Alert>
                )}
                <div className="overflow-x-auto md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shelves.length > 0 ? (
                            shelves.map((shelf) => (
                                <div
                                    key={shelf.id}
                                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{shelf.code}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>ID:</strong> {shelf.id}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Bookcase:</strong>{' '}
                                        {shelf.bookcase_id ? (
                                            <Link
                                                href={route('bookcases.show', shelf.bookcase_id)}
                                                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {shelf.bookcase?.code || 'N/A'}
                                            </Link>
                                        ) : (
                                            <span className="text-red-500 dark:text-red-400">N/A</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Number of Books:</strong> {shelf.books_count || 0}</p>
                                    <div className="flex gap-2 mt-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('shelves.show', { id: shelf.id })}>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-1"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            Show
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View shelf details</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('shelves.edit', { id: shelf.id })}>
                                                        <Button
                                                            size="sm"
                                                            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-100 flex items-center gap-1"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit shelf information</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                                No shelves found.
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Bookcase</TableHead>
                                <TableHead>Number of Books</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shelves.length > 0 ? (
                                shelves.map((shelf) => (
                                    <TableRow key={shelf.id}>
                                        <TableCell>{shelf.id}</TableCell>
                                        <TableCell>{shelf.code}</TableCell>
                                        <TableCell>
                                            {shelf.bookcase_id ? (
                                                <Link
                                                    href={route('bookcases.show', shelf.bookcase_id)}
                                                    className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {shelf.bookcase?.code || 'N/A'}
                                                </Link>
                                            ) : (
                                                <span className="text-red-500 dark:text-red-400">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{shelf.books_count || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('shelves.show', { id: shelf.id })}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View shelf details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('shelves.edit', { id: shelf.id })}>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-100 flex items-center"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit shelf information</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No shelves found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
