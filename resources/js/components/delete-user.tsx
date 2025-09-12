import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeadingSmall from '@/components/heading-small';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeactivateUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deactivateUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title="Deactivate account" description="Temporarily deactivate your account and all of its resources." />
            <div className="space-y-4 rounded-2xl border border-red-200/50 dark:border-red-500/30 bg-white/50 dark:bg-red-900/20 p-6 shadow-md backdrop-blur-sm">
                <div className="relative space-y-0.5 text-red-700 dark:text-red-200">
                    <p className="font-semibold text-xl">Warning</p>
                    <p className="text-sm">Please proceed with caution, your account will not be accessible until you reactivate it.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105">
                            Deactivate Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                            Are you sure you want to deactivate your account?
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                            Once your account is deactivated, all of its data will be temporarily hidden. You can reactivate your account at any time by logging back in. Please enter your password to confirm.
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deactivateUser}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    className="rounded-lg p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={closeModal} className="w-full sm:w-auto rounded-full font-semibold transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" disabled={processing} className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full font-semibold shadow-md hover:from-red-600 hover:to-rose-600 transition-all duration-300">
                                    <button type="submit">Deactivate Account</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
