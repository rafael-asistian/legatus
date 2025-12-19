import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Badge } from "@/Components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import SettingsLayout from '@/Components/Layout/SettingsLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'attorney';
    created_at: string;
}

interface Props {
    users: User[];
}

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    attorney: 'Abogado',
};

const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    attorney: 'bg-green-100 text-green-700',
};

export default function UsersPage({ users }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'attorney' as string,
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'attorney' as string,
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/settings/users', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/settings/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    }

    function openEditDialog(user: User) {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
    }

    function handleDelete(user: User) {
        if (confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
            router.delete(`/settings/users/${user.id}`);
        }
    }

    return (
        <SettingsLayout title="Usuarios">
            <Head title="Configuración - Usuarios" />

            <div className="p-6">
                <div className="bg-card rounded-lg border border-border shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium flex items-center gap-2 text-foreground">
                                <Users className="w-5 h-5" />
                                Gestión de Usuarios
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administra los usuarios y sus roles en el sistema.
                            </p>
                        </div>

                        {/* Create User Dialog */}
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Nuevo Usuario
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleCreate}>
                                    <DialogHeader>
                                        <DialogTitle>Crear Usuario</DialogTitle>
                                        <DialogDescription>
                                            Agrega un nuevo usuario al sistema.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="create-name">Nombre *</Label>
                                            <Input
                                                id="create-name"
                                                value={createForm.data.name}
                                                onChange={(e) => createForm.setData('name', e.target.value)}
                                                placeholder="Nombre completo"
                                            />
                                            {createForm.errors.name && (
                                                <p className="text-sm text-red-500">{createForm.errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="create-email">Correo Electrónico *</Label>
                                            <Input
                                                id="create-email"
                                                type="email"
                                                value={createForm.data.email}
                                                onChange={(e) => createForm.setData('email', e.target.value)}
                                                placeholder="correo@ejemplo.com"
                                            />
                                            {createForm.errors.email && (
                                                <p className="text-sm text-red-500">{createForm.errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="create-password">Contraseña *</Label>
                                            <Input
                                                id="create-password"
                                                type="password"
                                                value={createForm.data.password}
                                                onChange={(e) => createForm.setData('password', e.target.value)}
                                                placeholder="Mínimo 8 caracteres"
                                            />
                                            {createForm.errors.password && (
                                                <p className="text-sm text-red-500">{createForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Rol *</Label>
                                            <Select
                                                value={createForm.data.role}
                                                onValueChange={(value) => createForm.setData('role', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Administrador</SelectItem>
                                                    <SelectItem value="manager">Gerente</SelectItem>
                                                    <SelectItem value="attorney">Abogado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            {createForm.processing ? 'Creando...' : 'Crear Usuario'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Users Table */}
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-neutral-50/50">
                                <TableHead className="text-xs font-medium">Usuario</TableHead>
                                <TableHead className="text-xs font-medium">Correo</TableHead>
                                <TableHead className="text-xs font-medium">Rol</TableHead>
                                <TableHead className="text-xs font-medium text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            ) : users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={roleColors[user.role]}>
                                            {roleLabels[user.role]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(user)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(user)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Edit User Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent>
                        <form onSubmit={handleEdit}>
                            <DialogHeader>
                                <DialogTitle>Editar Usuario</DialogTitle>
                                <DialogDescription>
                                    Modifica la información del usuario.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nombre *</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-sm text-red-500">{editForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Correo Electrónico *</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                    {editForm.errors.email && (
                                        <p className="text-sm text-red-500">{editForm.errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-password">Nueva Contraseña</Label>
                                    <Input
                                        id="edit-password"
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="Dejar vacío para mantener actual"
                                    />
                                    {editForm.errors.password && (
                                        <p className="text-sm text-red-500">{editForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Rol *</Label>
                                    <Select
                                        value={editForm.data.role}
                                        onValueChange={(value) => editForm.setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                            <SelectItem value="manager">Gerente</SelectItem>
                                            <SelectItem value="attorney">Abogado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </SettingsLayout>
    );
}
