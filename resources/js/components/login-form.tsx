import { cn } from "@/lib/utils"
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    className?: string;
    status?: string;
    canResetPassword: boolean;
}

export function LoginForm({
                              className,
                              status,
                              canResetPassword,
                              ...props
                          }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            post(route(`login.${provider}`), {
                data: { email: data.email },
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            post(route(`login.${provider}`), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Head title="Log in" />
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={submit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your Acme Inc account
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <a
                                            href={route('password.request')}
                                            className="ml-auto text-sm underline-offset-2 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Login
                            </Button>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a href={route('register')} className="underline underline-offset-4">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/514315859_1136521488501765_8750534483930522729_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=WkwBoL88rQcQ7kNvwGk7VRn&_nc_oc=Adn0WusdN4TUbVA25Dq85-QCTm6B4FnPYpd5V0aVD8uyX0mYcHic1uyGRt_U_h9aTvk&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=ALVeZ9bO71FUvkDs6DgBjQ&oh=00_AfYV8k6ltFxdAvRVEAAxHHM2b4pXIfGjFJBRGOUY7lBtfA&oe=68C4929A"
                            alt="Image"
                            className="absolute inset-0 h-full w-full"
                        />
                    </div>
                </CardContent>
            </Card>
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
