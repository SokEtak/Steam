import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Bookcase {
    id: number;
    code: string;
}

interface BookcasesEditProps {
    bookcase: Bookcase;
    flash?: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookcases',
        href: route('bookcases.index'),
    },
    {
        title: 'Edit',
        href: '',
    },
];

export default function BookcasesEdit({ bookcase, flash }: BookcasesEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        code: bookcase.code,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bookcases.update', bookcase.id), {
            data,
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Bookcase" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Edit Bookcase</h1>
                {flash?.message && (
                    <Alert>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                        <Link href={route('bookcases.show', bookcase.id)}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
