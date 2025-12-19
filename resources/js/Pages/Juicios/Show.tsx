import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Gavel, Building2, Calendar, FileText, User, ArrowLeft,
    Plus, Upload, Loader2, Trash2, RefreshCw, Download,
    FileUp, X, Check
} from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';
import { useState, useRef } from 'react';

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

interface JuicioUpdate {
    id: number;
    juicio_id: number;
    tipo: 'auto' | 'promocion' | 'resolucion' | 'sentencia' | null;
    titulo: string | null;
    sintesis: string | null;
    fecha_documento: string | null;
    documento_path: string | null;
    documento_nombre: string | null;
    ai_analyzed: boolean;
    created_at: string;
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
    legal_case: LegalCase;
    court: Court | null;
    updates: JuicioUpdate[];
}

interface Props {
    juicio: Juicio;
}

const statusColors: Record<string, string> = {
    activo: 'bg-green-100 text-green-700',
    suspendido: 'bg-yellow-100 text-yellow-700',
    archivado: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
    activo: 'Activo',
    suspendido: 'Suspendido',
    archivado: 'Archivado',
};

const tipoColors: Record<string, string> = {
    auto: 'bg-blue-100 text-blue-700',
    promocion: 'bg-purple-100 text-purple-700',
    resolucion: 'bg-orange-100 text-orange-700',
    sentencia: 'bg-red-100 text-red-700',
};

const tipoLabels: Record<string, string> = {
    auto: 'Auto',
    promocion: 'Promoción',
    resolucion: 'Resolución',
    sentencia: 'Sentencia',
};

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export default function Show({ juicio }: Props) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [aiResult, setAiResult] = useState<{ tipo: string | null, titulo: string, sintesis: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress('uploading');

        const formData = new FormData();
        formData.append('documento', selectedFile);

        try {
            setUploadProgress('analyzing');

            const response = await fetch(`/juicios/${juicio.id}/updates`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setUploadProgress('done');
                setAiResult(data.ai_result);

                // Refresh the page after a short delay
                setTimeout(() => {
                    router.reload();
                    setShowUploadModal(false);
                    resetUpload();
                }, 2000);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadProgress('idle');
        } finally {
            setUploading(false);
        }
    };

    const resetUpload = () => {
        setSelectedFile(null);
        setUploadProgress('idle');
        setAiResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = (updateId: number) => {
        if (confirm('¿Estás seguro de eliminar esta actualización?')) {
            router.delete(`/juicio-updates/${updateId}`);
        }
    };

    return (
        <AppLayout userName="Legatus">
            <Head title={`Juicio ${juicio.expediente}`} />

            <div className="p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/juicios" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Volver a Juicios
                    </Link>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Gavel className="w-6 h-6 text-gray-700" />
                            <div>
                                <h1 className="text-2xl font-bold">{juicio.expediente}</h1>
                                <p className="text-gray-500">{juicio.actor} vs {juicio.demandado}</p>
                            </div>
                        </div>
                        <Badge className={statusColors[juicio.status]}>
                            {statusLabels[juicio.status]}
                        </Badge>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm">Cliente</span>
                        </div>
                        <Link href={`/cases/${juicio.legal_case.id}`} className="font-medium hover:underline">
                            {juicio.legal_case.client.name}
                        </Link>
                        <p className="text-sm text-gray-500">{juicio.legal_case.case_number}</p>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">Juzgado</span>
                        </div>
                        {juicio.court ? (
                            <>
                                <p className="font-medium">{juicio.court.name}</p>
                                <p className="text-sm text-gray-500">
                                    {juicio.court.level === 'federal' ? 'Federal' : 'Local'}
                                    {juicio.court.city && ` • ${juicio.court.city}`}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-400">Sin asignar</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Fecha de Inicio</span>
                        </div>
                        <p className="font-medium">{formatDate(juicio.fecha_inicio)}</p>
                    </div>
                </div>

                {/* Updates Section */}
                <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <h2 className="font-semibold">Actualizaciones</h2>
                            <span className="text-sm text-gray-500">({juicio.updates.length})</span>
                        </div>
                        <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Actualización
                        </Button>
                    </div>

                    {juicio.updates.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-700 mb-1">Sin actualizaciones</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Agrega documentos para mantener el historial del juicio
                            </p>
                            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                                <Upload className="w-4 h-4 mr-2" />
                                Subir primer documento
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {juicio.updates.map((update) => (
                                <div key={update.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {update.tipo && (
                                                    <Badge variant="secondary" className={tipoColors[update.tipo]}>
                                                        {tipoLabels[update.tipo]}
                                                    </Badge>
                                                )}
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(update.fecha_documento)}
                                                </span>
                                                {update.ai_analyzed && (
                                                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                                                        <Check className="w-3 h-3" />
                                                        IA
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-medium mb-1">{update.titulo || 'Sin título'}</h3>
                                            {update.sintesis && (
                                                <p className="text-sm text-gray-600 line-clamp-3">{update.sintesis}</p>
                                            )}
                                            {update.documento_nombre && (
                                                <a
                                                    href={`/storage/${update.documento_path}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    {update.documento_nombre}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                                onClick={() => handleDelete(update.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                {juicio.notas && (
                    <div className="bg-white rounded-lg border p-4 mt-6">
                        <h3 className="font-medium mb-2">Notas</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{juicio.notas}</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="font-semibold">Agregar Actualización</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    setShowUploadModal(false);
                                    resetUpload();
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-6">
                            {uploadProgress === 'idle' && (
                                <>
                                    <div
                                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="font-medium mb-1">
                                            {selectedFile ? selectedFile.name : 'Selecciona un archivo PDF'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {selectedFile
                                                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                                                : 'Arrastra aquí o haz clic para seleccionar'
                                            }
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                    </div>

                                    {selectedFile && (
                                        <div className="mt-4 flex gap-2">
                                            <Button className="flex-1 gap-2" onClick={handleUpload}>
                                                <Upload className="w-4 h-4" />
                                                Subir y Analizar con IA
                                            </Button>
                                            <Button variant="outline" onClick={resetUpload}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}

                            {uploadProgress === 'uploading' && (
                                <div className="text-center py-8">
                                    <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-3 animate-spin" />
                                    <p className="font-medium">Subiendo documento...</p>
                                    <p className="text-sm text-gray-500">Por favor espera</p>
                                </div>
                            )}

                            {uploadProgress === 'analyzing' && (
                                <div className="text-center py-8">
                                    <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-3 animate-spin" />
                                    <p className="font-medium">Analizando con IA...</p>
                                    <p className="text-sm text-gray-500">
                                        Google Gemini está procesando el documento
                                    </p>
                                </div>
                            )}

                            {uploadProgress === 'done' && aiResult && (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Check className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="font-medium mb-4">¡Documento analizado!</p>

                                    <div className="text-left bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-500">Tipo detectado:</span>
                                            {aiResult.tipo && (
                                                <Badge className={`ml-2 ${tipoColors[aiResult.tipo]}`}>
                                                    {tipoLabels[aiResult.tipo]}
                                                </Badge>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Título:</span>
                                            <p className="font-medium">{aiResult.titulo}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Síntesis:</span>
                                            <p className="text-sm">{aiResult.sintesis}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
