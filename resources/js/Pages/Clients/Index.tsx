import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/Components/ui/sheet"
import { Plus, Search, ChevronDown, Users, Phone, Mail, Calendar, Briefcase } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface LegalCase {
    id: number;
    case_number: string;
    title: string;
    status: string;
    assigned_attorney: { name: string } | null;
}

interface Client {
    id: number;
    name: string;
    phone: string;
    email: string;
    client_since: string;
    status: string;
    address?: string;
    notes?: string;
    cases_count?: number;
    cases?: LegalCase[];
}

interface Props {
    clients: Client[];
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export default function Index({ clients }: Props) {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleRowClick(client: Client) {
        setIsLoading(true);
        setIsDrawerOpen(true);

        try {
            const response = await fetch(`/clients/${client.id}`);
            const data = await response.json();
            setSelectedClient(data.client);
        } catch (error) {
            console.error('Error fetching client details:', error);
            setSelectedClient(client);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AppLayout userName="Legatus">
            <Head title="Clientes" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-semibold">Clientes</h1>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/clients/create">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800 gap-1.5 h-8">
                                <Plus className="w-4 h-4" />
                                Nuevo Cliente
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-sm border shadow-sm">
                    <div className="p-3 border-b flex items-center gap-4">
                        <div className="relative w-48">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar cliente..." className="pl-8 h-8 bg-gray-50 border-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Estado
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
                                <TableHead className="text-xs font-medium">Nombre</TableHead>
                                <TableHead className="text-xs font-medium">Teléfono</TableHead>
                                <TableHead className="text-xs font-medium">Email</TableHead>
                                <TableHead className="text-xs font-medium">Cliente desde</TableHead>
                                <TableHead className="text-xs font-medium">Casos</TableHead>
                                <TableHead className="text-xs font-medium">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-8 h-8 text-gray-300" />
                                            <span>No hay clientes registrados.</span>
                                            <Link href="/clients/create">
                                                <Button variant="outline" size="sm">
                                                    Crear primer cliente
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : clients.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="hover:bg-gray-50/50 cursor-pointer"
                                    onClick={() => handleRowClick(client)}
                                >
                                    <TableCell><input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-sm">{client.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{client.phone || '—'}</TableCell>
                                    <TableCell className="text-sm">{client.email}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(client.client_since)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {client.cases_count || 0}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={statusColors[client.status] || statusColors.active}>
                                            {statusLabels[client.status] || 'Activo'}
                                        </Badge>
                                    </TableCell>
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

            {/* Client Details Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : selectedClient ? (
                        <>
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                                        {selectedClient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div>{selectedClient.name}</div>
                                        <Badge variant="secondary" className={statusColors[selectedClient.status] || statusColors.active}>
                                            {statusLabels[selectedClient.status] || 'Activo'}
                                        </Badge>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información de Contacto</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{selectedClient.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{selectedClient.phone || 'Sin teléfono'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>Cliente desde {formatDate(selectedClient.client_since)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                {selectedClient.address && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Dirección</h3>
                                        <p className="text-sm">{selectedClient.address}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedClient.notes && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Notas</h3>
                                        <p className="text-sm text-gray-600">{selectedClient.notes}</p>
                                    </div>
                                )}

                                {/* Cases */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Casos</h3>
                                        <Link href={`/cases/create?client_id=${selectedClient.id}`}>
                                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                                <Plus className="w-3 h-3 mr-1" />
                                                Nuevo
                                            </Button>
                                        </Link>
                                    </div>

                                    {selectedClient.cases && selectedClient.cases.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedClient.cases.map((legalCase) => (
                                                <Link
                                                    key={legalCase.id}
                                                    href={`/cases/${legalCase.id}`}
                                                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                                        <span className="font-mono text-xs text-gray-500">{legalCase.case_number}</span>
                                                    </div>
                                                    <div className="font-medium text-sm mt-1">{legalCase.title}</div>
                                                    {legalCase.assigned_attorney && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Abogado: {legalCase.assigned_attorney.name}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No hay casos asociados</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t flex gap-2">
                                    <Link href={`/clients/${selectedClient.id}/edit`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Editar Cliente
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : null}
                </SheetContent>
            </Sheet>
        </AppLayout>
    )
}
