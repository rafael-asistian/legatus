import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login() {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // @ts-ignore
        post(route('login'));
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <Head title="Log in" />
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                            <span className="text-pink-600">A</span>
                            <span>sistian</span>
                        </h1>
                        <h2 className="text-2xl font-bold">Bienvenido de nuevo</h2>
                        <p className="text-balance text-muted-foreground">
                            Inicia sesión en tu cuenta de Asistian
                        </p>
                    </div>
                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@ejemplo.com"
                                required
                                value={data.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={processing}>
                            Iniciar sesión
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    O continúa con
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.16-.93 2.52.06 4.17 1.26 5.03 2.52-4.34 2.39-3.61 8.86 1.04 10.76-.67 1.67-1.59 3.35-3.31 4.88zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                            </Button>
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                                </svg>
                            </Button>
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                                </svg>
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            ¿No tienes una cuenta?{" "}
                            <Link href="#" className="underline">
                                Regístrate
                            </Link>
                        </div>

                        <div className="mt-4 text-center text-xs text-muted-foreground">
                            Al continuar, aceptas nuestros <Link href="#" className="underline">Términos del servicio</Link> y la <Link href="#" className="underline">Política de privacidad</Link>.
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-lime-400" />
            </div>
        </div>
    )
}
