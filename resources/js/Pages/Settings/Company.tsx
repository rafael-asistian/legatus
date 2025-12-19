import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Separator } from "@/Components/ui/separator"
import { Save } from 'lucide-react';
import SettingsLayout from '@/Components/Layout/SettingsLayout';

interface CompanySettings {
    id: number;
    name: string;
    legal_name: string | null;
    rfc: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
}

interface Props {
    company: CompanySettings | null;
}

export default function Company({ company }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: company?.name || '',
        legal_name: company?.legal_name || '',
        rfc: company?.rfc || '',
        address: company?.address || '',
        city: company?.city || '',
        state: company?.state || '',
        postal_code: company?.postal_code || '',
        phone: company?.phone || '',
        email: company?.email || '',
        website: company?.website || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/settings/company');
    }

    return (
        <SettingsLayout title="Despacho">
            <Head title="Configuración - Despacho" />

            <div className="p-6">
                <div className="bg-card rounded-lg border border-border shadow-sm max-w-3xl">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-medium text-foreground">Información del Despacho</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Configura los datos de tu despacho legal.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Despacho *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Legatus Abogados"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="legal_name">Razón Social</Label>
                                <Input
                                    id="legal_name"
                                    value={data.legal_name}
                                    onChange={(e) => setData('legal_name', e.target.value)}
                                    placeholder="Ej: Legatus Servicios Legales S.A. de C.V."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rfc">RFC</Label>
                            <Input
                                id="rfc"
                                value={data.rfc}
                                onChange={(e) => setData('rfc', e.target.value)}
                                placeholder="Ej: LSL1234567890"
                                maxLength={13}
                                className="max-w-xs"
                            />
                        </div>

                        <Separator />

                        {/* Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground">Dirección</h3>

                            <div className="space-y-2">
                                <Label htmlFor="address">Calle y Número</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Ej: Av. Reforma 505, Piso 12, Col. Cuauhtémoc"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Ej: Ciudad de México"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">Estado</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                        placeholder="Ej: CDMX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Código Postal</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        placeholder="Ej: 06500"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground">Contacto</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Ej: +52 55 1234 5678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Ej: contacto@legatus.mx"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Sitio Web</Label>
                                    <Input
                                        id="website"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="Ej: https://legatus.mx"
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
