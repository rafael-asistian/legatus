import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Badge } from "@/Components/ui/badge"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Plus, Pencil, Trash2, Gavel, MapPin } from 'lucide-react';
import SettingsLayout from '@/Components/Layout/SettingsLayout';

interface Court {
    id: number;
    name: string;
    level: 'local' | 'federal';
    city: string | null;
    state: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    is_active: boolean;
}

interface Props {
    courts: Court[];
}

const levelLabels: Record<string, string> = {
    local: 'Local',
    federal: 'Federal',
};

const levelColors: Record<string, string> = {
    local: 'bg-blue-100 text-blue-700',
    federal: 'bg-purple-100 text-purple-700',
};

export default function Courts({ courts }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);

    const createForm = useForm({
        name: '',
        level: 'local' as string,
        city: '',
        state: '',
        address: '',
        phone: '',
        email: '',
    });

    const editForm = useForm({
        name: '',
        level: 'local' as string,
        city: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        is_active: true,
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/settings/courts', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingCourt) return;

        editForm.put(`/settings/courts/${editingCourt.id}`, {
            onSuccess: () => {
                setEditingCourt(null);
                editForm.reset();
            },
        });
    }

    function openEditDialog(court: Court) {
        setEditingCourt(court);
        editForm.setData({
            name: court.name,
            level: court.level,
            city: court.city || '',
            state: court.state || '',
            address: court.address || '',
            phone: court.phone || '',
            email: court.email || '',
            is_active: court.is_active,
        });
    }

    function handleDelete(court: Court) {
        if (confirm(`¿Estás seguro de eliminar ${court.name}?`)) {
            router.delete(`/settings/courts/${court.id}`);
        }
    }

    // Group courts by level
    const localCourts = courts.filter(c => c.level === 'local');
    const federalCourts = courts.filter(c => c.level === 'federal');

    return (
        <SettingsLayout title="Tribunales">
            <Head title="Configuración - Tribunales" />

            <div className="p-6">
                <div className="bg-card rounded-lg border border-border shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium flex items-center gap-2 text-foreground">
                                <Gavel className="w-5 h-5" />
                                Gestión de Tribunales
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administra los tribunales locales y federales.
                            </p>
                        </div>

                        {/* Create Court Dialog */}
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Nuevo Tribunal
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <form onSubmit={handleCreate}>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Tribunal</DialogTitle>
                                        <DialogDescription>
                                            Registra un nuevo tribunal al sistema.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="create-name">Nombre *</Label>
                                                <Input
                                                    id="create-name"
                                                    value={createForm.data.name}
                                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                                    placeholder="Nombre del tribunal"
                                                />
                                                {createForm.errors.name && (
                                                    <p className="text-sm text-red-500">{createForm.errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Nivel *</Label>
                                                <Select
                                                    value={createForm.data.level}
                                                    onValueChange={(value) => createForm.setData('level', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="local">Local</SelectItem>
                                                        <SelectItem value="federal">Federal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="create-city">Ciudad</Label>
                                                <Input
                                                    id="create-city"
                                                    value={createForm.data.city}
                                                    onChange={(e) => createForm.setData('city', e.target.value)}
                                                    placeholder="Ej: Ciudad de México"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="create-state">Estado</Label>
                                                <Input
                                                    id="create-state"
                                                    value={createForm.data.state}
                                                    onChange={(e) => createForm.setData('state', e.target.value)}
                                                    placeholder="Ej: CDMX"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="create-address">Dirección</Label>
                                            <Textarea
                                                id="create-address"
                                                value={createForm.data.address}
                                                onChange={(e) => createForm.setData('address', e.target.value)}
                                                placeholder="Dirección completa"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="create-phone">Teléfono</Label>
                                                <Input
                                                    id="create-phone"
                                                    value={createForm.data.phone}
                                                    onChange={(e) => createForm.setData('phone', e.target.value)}
                                                    placeholder="+52 55 1234 5678"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="create-email">Correo</Label>
                                                <Input
                                                    id="create-email"
                                                    type="email"
                                                    value={createForm.data.email}
                                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                                    placeholder="correo@tribunal.gob.mx"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            {createForm.processing ? 'Guardando...' : 'Agregar Tribunal'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Federal Courts Section */}
                    <div className="border-b border-border">
                        <div className="px-6 py-3 bg-neutral-50">
                            <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                                <Badge variant="secondary" className={levelColors.federal}>Federal</Badge>
                                <span className="text-neutral-400">({federalCourts.length})</span>
                            </h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-neutral-50/50">
                                    <TableHead className="text-xs font-medium">Nombre</TableHead>
                                    <TableHead className="text-xs font-medium">Ubicación</TableHead>
                                    <TableHead className="text-xs font-medium">Contacto</TableHead>
                                    <TableHead className="text-xs font-medium text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {federalCourts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-16 text-muted-foreground">
                                            No hay tribunales federales registrados.
                                        </TableCell>
                                    </TableRow>
                                ) : federalCourts.map((court) => (
                                    <TableRow key={court.id}>
                                        <TableCell className="font-medium">{court.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                {[court.city, court.state].filter(Boolean).join(', ') || 'Sin ubicación'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {court.phone || court.email || 'Sin contacto'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(court)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(court)}
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

                    {/* Local Courts Section */}
                    <div>
                        <div className="px-6 py-3 bg-neutral-50">
                            <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                                <Badge variant="secondary" className={levelColors.local}>Local</Badge>
                                <span className="text-neutral-400">({localCourts.length})</span>
                            </h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-neutral-50/50">
                                    <TableHead className="text-xs font-medium">Nombre</TableHead>
                                    <TableHead className="text-xs font-medium">Ubicación</TableHead>
                                    <TableHead className="text-xs font-medium">Contacto</TableHead>
                                    <TableHead className="text-xs font-medium text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {localCourts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-16 text-muted-foreground">
                                            No hay tribunales locales registrados.
                                        </TableCell>
                                    </TableRow>
                                ) : localCourts.map((court) => (
                                    <TableRow key={court.id}>
                                        <TableCell className="font-medium">{court.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                {[court.city, court.state].filter(Boolean).join(', ') || 'Sin ubicación'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {court.phone || court.email || 'Sin contacto'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(court)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(court)}
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
                </div>

                {/* Edit Court Dialog */}
                <Dialog open={!!editingCourt} onOpenChange={(open) => !open && setEditingCourt(null)}>
                    <DialogContent className="max-w-lg">
                        <form onSubmit={handleEdit}>
                            <DialogHeader>
                                <DialogTitle>Editar Tribunal</DialogTitle>
                                <DialogDescription>
                                    Modifica la información del tribunal.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
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
                                        <Label>Nivel *</Label>
                                        <Select
                                            value={editForm.data.level}
                                            onValueChange={(value) => editForm.setData('level', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="local">Local</SelectItem>
                                                <SelectItem value="federal">Federal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-city">Ciudad</Label>
                                        <Input
                                            id="edit-city"
                                            value={editForm.data.city}
                                            onChange={(e) => editForm.setData('city', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-state">Estado</Label>
                                        <Input
                                            id="edit-state"
                                            value={editForm.data.state}
                                            onChange={(e) => editForm.setData('state', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-address">Dirección</Label>
                                    <Textarea
                                        id="edit-address"
                                        value={editForm.data.address}
                                        onChange={(e) => editForm.setData('address', e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phone">Teléfono</Label>
                                        <Input
                                            id="edit-phone"
                                            value={editForm.data.phone}
                                            onChange={(e) => editForm.setData('phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email">Correo</Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingCourt(null)}>
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
