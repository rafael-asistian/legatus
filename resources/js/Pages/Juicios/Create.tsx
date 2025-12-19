import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Gavel, ArrowLeft } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface Client {
    id: number;
    name: string;
}

interface LegalCase {
    id: number;
    case_number: string;
    title: string;
    client_id: number;
    client?: Client;
}

interface Court {
    id: number;
    name: string;
    level: string;
    city: string | null;
}

interface Props {
    cases: LegalCase[];
    courts: Court[];
}

export default function Create({ cases, courts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        legal_case_id: '',
        court_id: '',
        actor: '',
        demandado: '',
        expediente: '',
        status: 'activo',
        fecha_inicio: '',
        notas: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/juicios');
    };

    return (
        <AppLayout userName="Legatus">
            <Head title="Nuevo Juicio" />

            <div className="p-6">
                <div className="mb-6">
                    <Link href="/juicios" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Juicios
                    </Link>
                    <div className="flex items-center gap-2">
                        <Gavel className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-semibold">Nuevo Juicio</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm max-w-2xl">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Case Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="legal_case_id">Caso *</Label>
                            <Select
                                value={data.legal_case_id}
                                onValueChange={(value) => setData('legal_case_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar caso..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cases.map((legalCase) => (
                                        <SelectItem key={legalCase.id} value={String(legalCase.id)}>
                                            {legalCase.case_number} - {legalCase.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.legal_case_id && <p className="text-sm text-red-500">{errors.legal_case_id}</p>}
                        </div>

                        {/* Actor & Demandado */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="actor">Actor (Demandante) *</Label>
                                <Input
                                    id="actor"
                                    value={data.actor}
                                    onChange={(e) => setData('actor', e.target.value)}
                                    placeholder="Nombre del actor"
                                />
                                {errors.actor && <p className="text-sm text-red-500">{errors.actor}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="demandado">Demandado *</Label>
                                <Input
                                    id="demandado"
                                    value={data.demandado}
                                    onChange={(e) => setData('demandado', e.target.value)}
                                    placeholder="Nombre del demandado"
                                />
                                {errors.demandado && <p className="text-sm text-red-500">{errors.demandado}</p>}
                            </div>
                        </div>

                        {/* Court & Expediente */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="court_id">Juzgado (Tribunal)</Label>
                                <Select
                                    value={data.court_id}
                                    onValueChange={(value) => setData('court_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar juzgado..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courts.map((court) => (
                                            <SelectItem key={court.id} value={String(court.id)}>
                                                {court.name} ({court.level === 'federal' ? 'Federal' : 'Local'})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.court_id && <p className="text-sm text-red-500">{errors.court_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expediente">Expediente (No./Año) *</Label>
                                <Input
                                    id="expediente"
                                    value={data.expediente}
                                    onChange={(e) => setData('expediente', e.target.value)}
                                    placeholder="Ej: 1234/2025"
                                />
                                {errors.expediente && <p className="text-sm text-red-500">{errors.expediente}</p>}
                            </div>
                        </div>

                        {/* Status & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activo">Activo</SelectItem>
                                        <SelectItem value="suspendido">Suspendido</SelectItem>
                                        <SelectItem value="archivado">Archivado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                />
                                {errors.fecha_inicio && <p className="text-sm text-red-500">{errors.fecha_inicio}</p>}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas</Label>
                            <Textarea
                                id="notas"
                                value={data.notas}
                                onChange={(e) => setData('notas', e.target.value)}
                                placeholder="Notas adicionales sobre el juicio..."
                                rows={4}
                            />
                            {errors.notas && <p className="text-sm text-red-500">{errors.notas}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Crear Juicio'}
                            </Button>
                            <Link href="/juicios">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
