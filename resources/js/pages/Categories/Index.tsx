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

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface CategoriesIndexProps {
    categories: Category[];
    flash: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function CategoriesIndex({ categories, flash }: CategoriesIndexProps) {
    const [isNotificationVisible, setIsNotificationVisible] = useState(!!flash.message);
    const [deleteId, setDeleteId] = useState<number | null>(null);

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

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(route('categories.destroy', { id: deleteId }), {
                onSuccess: () => {
                    setDeleteId(null);
                },
                onError: () => {
                    alert('Failed to delete the category. Please try again.');
                },
            });
        }
    };

    const handleCloseNotification = () => {
        setIsNotificationVisible(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Of Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Categories({categories.length || 0})</h1>
                    <Link href={route('categories.create')}>
                        <Button className="flex items-center gap-1">
                            <Plus className="h-5 w-5" />
                            Create Category
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
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>ID:</strong> {category.id}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Created At:</strong> {new Date(category.created_at).toLocaleString()}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Updated At:</strong> {new Date(category.updated_at).toLocaleString()}</p>
                                    <div className="flex gap-2 mt-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('categories.show', { id: category.id })}>
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
                                                    <p>View category details</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('categories.edit', { id: category.id })}>
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
                                                    <p>Edit category information</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-1"
                                                                onClick={() => handleDelete(category.id)}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the category
                                                                    and remove its data from our servers.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={confirmDelete}
                                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                                >
                                                                    Continue
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete this category</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                                No categories found.
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Updated At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{new Date(category.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(category.updated_at).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('categories.show', { id: category.id })}>
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
                                                            <p>View category details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('categories.edit', { id: category.id })}>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-100 flex items-center"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit category information</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleDelete(category.id)}
                                                                        className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 flex items-center"
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete the category
                                                                            and remove its data from our servers.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={confirmDelete}
                                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                                        >
                                                                            Continue
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete this category</p>
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
                                        No categories found.
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
