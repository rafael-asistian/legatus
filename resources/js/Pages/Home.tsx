import { Head } from '@inertiajs/react';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import AppLayout from '@/Components/Layout/AppLayout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
}

export default function Home({ user }: Props) {
    const firstName = user.name.split(' ')[0];

    return (
        <AppLayout userName={user.name}>
            <Head title="Inicio" />

            <div className="p-6">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Hola, {firstName} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Bienvenido de vuelta a Legatus
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Casos Activos</p>
                                <p className="text-2xl font-semibold">—</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Clientes</p>
                                <p className="text-2xl font-semibold">—</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Juicios</p>
                                <p className="text-2xl font-semibold">—</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Este Mes</p>
                                <p className="text-2xl font-semibold">—</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a
                            href="/cases/create"
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Briefcase className="w-6 h-6 text-gray-600 mb-2" />
                            <span className="text-sm text-gray-700">Nuevo Caso</span>
                        </a>
                        <a
                            href="/clients"
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Users className="w-6 h-6 text-gray-600 mb-2" />
                            <span className="text-sm text-gray-700">Ver Clientes</span>
                        </a>
                        <a
                            href="/juicios"
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <FileText className="w-6 h-6 text-gray-600 mb-2" />
                            <span className="text-sm text-gray-700">Ver Juicios</span>
                        </a>
                        <a
                            href="/cases"
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Briefcase className="w-6 h-6 text-gray-600 mb-2" />
                            <span className="text-sm text-gray-700">Ver Casos</span>
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
