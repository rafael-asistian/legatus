import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Plus, Search, ChevronDown, Gavel, Building2 } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface Court {
    id: number;
    name: string;
    level: string;
    city: string | null;
}

interface Client {
    id: number;
    name: string;
}

interface LegalCase {
    id: number;
    case_number: string;
    title: string;
    client: Client;
}

interface Juicio {
    id: number;
    legal_case_id: number;
    court_id: number | null;
    actor: string;
    demandado: string;
    expediente: string;
    status: 'activo' | 'suspendido' | 'archivado';
    fecha_inicio: string | null;
    notas: string | null;
    created_at: string;
    updated_at: string;
    legal_case: LegalCase;
    court: Court | null;
}

interface Props {
    juicios: Juicio[];
}

const statusColors: Record<string, string> = {
    activo: 'bg-green-100 text-green-700 hover:bg-green-100',
    suspendido: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    archivado: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
};

const statusLabels: Record<string, string> = {
    activo: 'Activo',
    suspendido: 'Suspendido',
    archivado: 'Archivado',
};

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export default function Index({ juicios }: Props) {
    return (
        <AppLayout userName="Legatus">
            <Head title="Juicios" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Gavel className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-semibold">Juicios</h1>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/juicios/create">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800 gap-1.5 h-8">
                                <Plus className="w-4 h-4" />
                                Nuevo Juicio
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-sm border shadow-sm">
                    <div className="p-3 border-b flex items-center gap-4">
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar juicio..." className="pl-8 h-8 bg-gray-50 border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Estado
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                Juzgado
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                Columnas
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead className="text-xs font-medium">Expediente</TableHead>
                                <TableHead className="text-xs font-medium">Caso</TableHead>
                                <TableHead className="text-xs font-medium">Actor</TableHead>
                                <TableHead className="text-xs font-medium">Demandado</TableHead>
                                <TableHead className="text-xs font-medium">Juzgado</TableHead>
                                <TableHead className="text-xs font-medium">Estado</TableHead>
                                <TableHead className="text-xs font-medium">Inicio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {juicios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Gavel className="w-8 h-8 text-gray-300" />
                                            <span>No hay juicios registrados.</span>
                                            <Link href="/juicios/create">
                                                <Button variant="outline" size="sm">
                                                    Crear primer juicio
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : juicios.map((juicio) => (
                                <TableRow key={juicio.id} className="hover:bg-gray-50/50">
                                    <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                                    <TableCell>
                                        <Link href={`/juicios/${juicio.id}`} className="hover:underline">
                                            <span className="font-mono text-sm font-medium">{juicio.expediente}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/cases/${juicio.legal_case.id}`} className="hover:underline">
                                            <div className="font-medium text-sm">{juicio.legal_case.case_number}</div>
                                            <div className="text-xs text-muted-foreground">{juicio.legal_case.client.name}</div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">{juicio.actor}</TableCell>
                                    <TableCell className="text-sm">{juicio.demandado}</TableCell>
                                    <TableCell>
                                        {juicio.court ? (
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div className="text-sm">{juicio.court.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {juicio.court.level === 'federal' ? 'Federal' : 'Local'}
                                                        {juicio.court.city && ` • ${juicio.court.city}`}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Sin asignar</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={statusColors[juicio.status]}>
                                            {statusLabels[juicio.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(juicio.fecha_inicio)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <div className="p-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                        <span>Mostrando 1 a {juicios.length} de {juicios.length} resultados</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span>Registros por página</span>
                                <select className="border rounded px-2 py-1 text-sm bg-white">
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </div>
                            <span>Página 1 de 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
