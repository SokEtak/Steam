import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    password: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
    });

    // State for big picture modal and email validation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    // Validate email domain
    const validateEmail = (email: string) => {
        if (!email.endsWith('@diu.edu.kh')) {
            setEmailError('Email must end with @diu.edu.kh');
            return false;
        }
        setEmailError(null);
        return true;
    };

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setData('email', newEmail);
        validateEmail(newEmail);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prevent submission if email is invalid
        if (!validateEmail(data.email)) {
            return;
        }

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // Clear password field after successful save
    useEffect(() => {
        if (recentlySuccessful) {
            reset('password');
        }
    }, [recentlySuccessful, reset]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label>Profile Picture</Label>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                            >
                                <Avatar className="h-16 w-16 rounded-full">
                                    <AvatarImage src={auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-full">
                                        {auth.user.name.split(" ")[0][0]}
                                        {auth.user.name.split(" ")[1]?.[0] ?? ""}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={handleEmailChange}
                                required
                                autoComplete="username"
                                placeholder="yourname@diu.edu.kh"
                            />
                            <InputError className="mt-2" message={emailError || errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password to confirm changes"
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing || !!emailError}>Save</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* Big Picture Modal */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <div
                            className="relative bg-transparent p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <Avatar className="h-64 w-64 rounded-full">
                                <AvatarImage src={auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined} alt={auth.user.name} />
                                <AvatarFallback className="rounded-full text-4xl">
                                    {auth.user.name.split(" ")[0][0]}
                                    {auth.user.name.split(" ")[1]?.[0] ?? ""}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                )}

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

