import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Plus, Search, ChevronDown } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface Client {
    id: number;
    name: string;
    phone: string;
    email: string;
    client_since: string;
    status: string;
}

interface Props {
    clients: Client[];
}

export default function Index({ clients }: Props) {
    return (
        <AppLayout userName="Legatus">
            <Head title="Soporte" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">Soporte</h1>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white border rounded-md overflow-hidden">
                            <Button variant="ghost" size="sm" className="rounded-none border-r px-3 h-8">Lista</Button>
                            <Button variant="ghost" size="sm" className="rounded-none border-r px-3 h-8 text-muted-foreground">Kanban</Button>
                            <Button variant="ghost" size="sm" className="rounded-none px-3 h-8 text-muted-foreground">Chat</Button>
                        </div>
                        <Button size="sm" className="bg-black text-white hover:bg-gray-800 gap-1.5 h-8">
                            <Plus className="w-4 h-4" />
                            Crear Ticket
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-sm border shadow-sm">
                    <div className="p-3 border-b flex items-center gap-4">
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar Ticket" className="pl-8 h-8 bg-gray-50 border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Etapa
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
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                Agente
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
                                <TableHead className="text-xs font-medium">ID</TableHead>
                                <TableHead className="text-xs font-medium">Asunto</TableHead>
                                <TableHead className="text-xs font-medium">Cliente</TableHead>
                                <TableHead className="text-xs font-medium">Estado</TableHead>
                                <TableHead className="text-xs font-medium">Prioridad</TableHead>
                                <TableHead className="text-xs font-medium">TIPO</TableHead>
                                <TableHead className="text-xs font-medium">Agente</TableHead>
                                <TableHead className="text-xs font-medium">Actualizado el</TableHead>
                                <TableHead className="text-xs font-medium">Creado el</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
                                        No hay clientes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : clients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-gray-50/50">
                                    <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                                    <TableCell className="font-medium text-sm">#{25120000 + client.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">Prueba de Ticket</div>
                                        <div className="text-xs text-muted-foreground">Contacto Seleccionado: {client.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{client.name}</div>
                                                <div className="text-xs text-muted-foreground">{client.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                            En revisión
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                                            Media
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
                                            Queja
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">RC</div>
                                            <span className="text-sm">Rafael Castellanos</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">hace 9 días</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">hace 9 días</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <div className="p-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                        <span>Mostrando 1 a {clients.length} de {clients.length} resultados</span>
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
    )
}
