import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    clients: Client[];
    attorneys: User[];
}

export default function Create({ clients, attorneys }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        title: '',
        description: '',
        status: 'nuevo',
        priority: 'media',
        type: 'reclamacion',
        assigned_attorney_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/cases');
    }

    return (
        <AppLayout userName="Legatus">
            <Head title="Nuevo Caso" />

            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/cases">
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold">Nuevo Caso</h1>
                </div>

                <div className="bg-white rounded-lg border shadow-sm max-w-2xl">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Client Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="client_id">Cliente *</Label>
                            <Select value={data.client_id} onValueChange={(value) => setData('client_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cliente..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={String(client.id)}>
                                            {client.name} ({client.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.client_id && <p className="text-sm text-red-500">{errors.client_id}</p>}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Caso *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Ej: Reclamación contra Seguros XYZ"
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción detallada del caso..."
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Status, Priority, Type */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nuevo">Nuevo</SelectItem>
                                        <SelectItem value="en_proceso">En Proceso</SelectItem>
                                        <SelectItem value="cerrado">Cerrado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Prioridad</Label>
                                <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baja">Baja</SelectItem>
                                        <SelectItem value="media">Media</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reclamacion">Reclamación</SelectItem>
                                        <SelectItem value="litigio">Litigio</SelectItem>
                                        <SelectItem value="consulta">Consulta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Assigned Attorney */}
                        <div className="space-y-2">
                            <Label>Abogado Asignado</Label>
                            <Select value={data.assigned_attorney_id} onValueChange={(value) => setData('assigned_attorney_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar abogado..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {attorneys.map((attorney) => (
                                        <SelectItem key={attorney.id} value={String(attorney.id)}>
                                            {attorney.name} ({attorney.role})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Link href="/cases">
                                <Button type="button" variant="outline">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Crear Caso'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
