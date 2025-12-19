import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Separator } from "@/Components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Save, User as UserIcon } from 'lucide-react';
import SettingsLayout from '@/Components/Layout/SettingsLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'attorney';
}

interface Props {
    user: User | null;
}

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    attorney: 'Abogado',
};

export default function Profile({ user }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/settings/profile');
    }

    return (
        <SettingsLayout title="Mi Perfil">
            <Head title="Configuración - Mi Perfil" />

            <div className="p-6">
                <div className="bg-card rounded-lg border border-border shadow-sm max-w-2xl">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-medium text-foreground">Mi Perfil</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administra tu información personal y credenciales.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={undefined} />
                                <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xl font-medium">
                                    {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-8 h-8" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-foreground">{user?.name || 'Usuario'}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Rol: {user?.role ? roleLabels[user.role] : 'No asignado'}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground">Información Personal</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Tu nombre"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Password Change */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground">Cambiar Contraseña</h3>
                            <p className="text-xs text-muted-foreground">Deja vacío si no deseas cambiar tu contraseña.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repetir contraseña"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button type="submit" disabled={processing} className="gap-2">
                                <Save className="w-4 h-4" />
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </SettingsLayout>
    );
}
