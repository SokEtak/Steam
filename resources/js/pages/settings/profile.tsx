import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ status }: { status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { recentlySuccessful } = useForm({});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />
                    <div className="relative z-10 p-8 md:p-12 rounded-3xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-md transition-all duration-500 ease-in-out">
                        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="relative group focus:outline-none focus:ring-4 focus:ring-purple-400/50 rounded-full transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl"
                            >
                                <Avatar className="h-28 w-28 rounded-full border-4 border-purple-300 dark:border-purple-600 shadow-lg transition-all duration-500 ease-in-out group-hover:border-pink-500 group-hover:shadow-2xl group-hover:animate-pulse">
                                    <AvatarImage src={auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-full text-4xl font-extrabold bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                                        {auth.user.name.split(" ")[0][0]}
                                        {auth.user.name.split(" ")[1]?.[0] ?? ""}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-sm font-semibold tracking-wider">VIEW</span>
                                </span>
                            </button>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 drop-shadow-md">{auth.user.name}</h3>
                                <p className="text-md text-gray-600 dark:text-gray-300 mt-1 drop-shadow-sm">{auth.user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            {auth.user.campus && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Campus</Label>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{auth.user.campus.name}</p>
                                </div>
                            )}

                            {auth.user.role && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Role</Label>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{auth.user.role.name}</p>
                                </div>
                            )}
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mt-8 p-4 bg-green-500/10 dark:bg-green-800/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium transition-opacity duration-500 ease-in-out border border-green-500/20 dark:border-green-500/30">
                                A new verification link has been sent to your email address.
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-4">
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Saved successfully! 🎉</p>
                            </Transition>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-xl transition-all duration-500 ease-in-out"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="absolute -top-12 right-0 text-white bg-transparent rounded-full p-2 transition-transform duration-300 ease-in-out hover:scale-125"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {console.log(auth.user.avatar)}
                            <Avatar className="h-[28rem] w-[28rem] rounded-2xl shadow-3xl transform scale-105">
                                {/*<AvatarImage src={auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined} alt={auth.user.name} className="object-cover w-full h-full rounded-2xl" />*/}
                                <AvatarImage src={"https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud/"+auth.user.avatar} alt={auth.user.name} className="object-cover w-full h-full rounded-2xl" />
                                <AvatarFallback className="rounded-2xl text-8xl font-black bg-gray-200/50 dark:bg-gray-700/50">
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
