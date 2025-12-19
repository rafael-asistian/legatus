import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Users,
    FileText,
    BarChart3,
    Settings,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const navItems: NavItem[] = [
    { href: '/clients', icon: <Home className="w-5 h-5" />, label: 'Inicio' },
    { href: '/clients', icon: <Users className="w-5 h-5" />, label: 'Clientes' },
    { href: '#', icon: <Briefcase className="w-5 h-5" />, label: 'Casos' },
    { href: '#', icon: <FileText className="w-5 h-5" />, label: 'Documentos' },
    { href: '#', icon: <BarChart3 className="w-5 h-5" />, label: 'Reportes' },
];

export default function Sidebar() {
    const { url } = usePage();

    return (
        <aside className="w-14 bg-white border-r flex flex-col items-center py-4 gap-1">
            {/* Logo */}
            <div className="mb-4">
                <Link href="/" className="flex items-center justify-center w-8 h-8">
                    <span className="text-pink-600 font-bold text-xl">A</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center gap-1">
                {navItems.map((item, index) => {
                    const isActive = url.startsWith(item.href) && item.href !== '#';
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                                isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </nav>

            {/* Settings at bottom */}
            <div className="mt-auto">
                <Link
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    title="Configuración"
                >
                    <Settings className="w-5 h-5" />
                </Link>
            </div>
        </aside>
    );
}
