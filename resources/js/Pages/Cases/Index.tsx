import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Plus, Search, ChevronDown, Briefcase } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface User {
    id: number;
    name: string;
}

interface LegalCase {
    id: number;
    case_number: string;
    title: string;
    description: string | null;
    status: 'nuevo' | 'en_proceso' | 'cerrado';
    priority: 'baja' | 'media' | 'alta';
    type: 'reclamacion' | 'litigio' | 'consulta';
    client: Client;
    assigned_attorney: User | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    cases: LegalCase[];
}

const statusColors: Record<string, string> = {
    nuevo: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    en_proceso: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    cerrado: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
};

const statusLabels: Record<string, string> = {
    nuevo: 'Nuevo',
    en_proceso: 'En Proceso',
    cerrado: 'Cerrado',
};

const priorityColors: Record<string, string> = {
    baja: 'bg-green-100 text-green-700 hover:bg-green-100',
    media: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    alta: 'bg-red-100 text-red-700 hover:bg-red-100',
};

const priorityLabels: Record<string, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
};

const typeColors: Record<string, string> = {
    reclamacion: 'bg-pink-100 text-pink-700 hover:bg-pink-100',
    litigio: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    consulta: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100',
};

const typeLabels: Record<string, string> = {
    reclamacion: 'Reclamación',
    litigio: 'Litigio',
    consulta: 'Consulta',
};

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return `hace ${Math.floor(diffDays / 30)} meses`;
}

export default function Index({ cases }: Props) {
    return (
        <AppLayout userName="Legatus">
            <Head title="Casos" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-semibold">Casos</h1>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white border rounded-md overflow-hidden">
                            <Button variant="ghost" size="sm" className="rounded-none border-r px-3 h-8">Lista</Button>
                            <Button variant="ghost" size="sm" className="rounded-none border-r px-3 h-8 text-muted-foreground">Kanban</Button>
                            <Button variant="ghost" size="sm" className="rounded-none px-3 h-8 text-muted-foreground">Calendario</Button>
                        </div>
                        <Link href="/cases/create">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800 gap-1.5 h-8">
                                <Plus className="w-4 h-4" />
                                Nuevo Caso
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-sm border shadow-sm">
                    <div className="p-3 border-b flex items-center gap-4">
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar caso..." className="pl-8 h-8 bg-gray-50 border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Estado
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Prioridad
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                Tipo
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                Vista Actual
                                <ChevronDown className="w-3 h-3" />
                            </Button>
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
                                <TableHead className="text-xs font-medium">No. Caso</TableHead>
                                <TableHead className="text-xs font-medium">Título</TableHead>
                                <TableHead className="text-xs font-medium">Cliente</TableHead>
                                <TableHead className="text-xs font-medium">Estado</TableHead>
                                <TableHead className="text-xs font-medium">Prioridad</TableHead>
                                <TableHead className="text-xs font-medium">Tipo</TableHead>
                                <TableHead className="text-xs font-medium">Abogado</TableHead>
                                <TableHead className="text-xs font-medium">Actualizado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Briefcase className="w-8 h-8 text-gray-300" />
                                            <span>No hay casos registrados.</span>
                                            <Link href="/cases/create">
                                                <Button variant="outline" size="sm">
                                                    Crear primer caso
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : cases.map((legalCase) => (
                                <TableRow key={legalCase.id} className="hover:bg-gray-50/50">
                                    <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                                    <TableCell className="font-mono text-sm">{legalCase.case_number}</TableCell>
                                    <TableCell>
                                        <Link href={`/cases/${legalCase.id}`} className="hover:underline">
                                            <div className="font-medium text-sm">{legalCase.title}</div>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                {legalCase.client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{legalCase.client.name}</div>
                                                <div className="text-xs text-muted-foreground">{legalCase.client.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={statusColors[legalCase.status]}>
                                            {statusLabels[legalCase.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={priorityColors[legalCase.priority]}>
                                            {priorityLabels[legalCase.priority]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={typeColors[legalCase.type]}>
                                            {typeLabels[legalCase.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {legalCase.assigned_attorney ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                    {legalCase.assigned_attorney.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <span className="text-sm">{legalCase.assigned_attorney.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Sin asignar</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatRelativeTime(legalCase.updated_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <div className="p-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                        <span>Mostrando 1 a {cases.length} de {cases.length} resultados</span>
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
