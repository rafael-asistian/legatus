import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Plus, Search } from 'lucide-react';

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
        <div className="min-h-screen bg-background p-8">
            <Head title="Soporte" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Soporte</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border rounded-md overflow-hidden">
                        <Button variant="ghost" className="rounded-none border-r px-4">Lista</Button>
                        <Button variant="ghost" className="rounded-none border-r px-4 text-muted-foreground">Kanban</Button>
                        <Button variant="ghost" className="rounded-none px-4 text-muted-foreground">Chat</Button>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800 gap-2">
                        <Plus className="w-4 h-4" />
                        Crear Ticket
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-sm border shadow-sm">
                <div className="p-4 border-b flex items-center justify-between gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar Ticket" className="pl-8 bg-gray-50 border-none" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-dashed">Etapa</Button>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">Prioridad</Button>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">Tipo</Button>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">Agente</Button>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="sm">Vista Actual</Button>
                        <Button variant="outline" size="sm">Columnas</Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Asunto</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>TIPO</TableHead>
                            <TableHead>Agente</TableHead>
                            <TableHead>Actualizado el</TableHead>
                            <TableHead>Creado el</TableHead>
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
                            <TableRow key={client.id}>
                                <TableCell><input type="checkbox" className="rounded border-gray-300" /></TableCell>
                                <TableCell className="font-medium">#{client.id}</TableCell>
                                <TableCell>
                                    <div className="font-medium">Ticket de prueba</div>
                                    <div className="text-xs text-muted-foreground">Contacto: {client.name}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{client.name}</div>
                                            <div className="text-xs text-muted-foreground">{client.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        En revisión
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                        Media
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                        Queja
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">RC</div>
                                        <span className="text-sm">Rafael Castellanos</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">hace 9 días</TableCell>
                                <TableCell className="text-muted-foreground">hace 9 días</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
