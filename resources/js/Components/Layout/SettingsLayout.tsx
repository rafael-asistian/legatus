import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Building2, User, Users, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/Components/Layout/AppLayout';

interface SettingsLayoutProps extends PropsWithChildren {
    title: string;
}

const settingsNavItems = [
    { href: '/settings/company', icon: Building2, label: 'Despacho' },
    { href: '/settings/profile', icon: User, label: 'Mi Perfil' },
    { href: '/settings/users', icon: Users, label: 'Usuarios' },
    { href: '/settings/courts', icon: Gavel, label: 'Tribunales' },
];

export default function SettingsLayout({ children, title }: SettingsLayoutProps) {
    const { url } = usePage();

    return (
        <AppLayout userName="Legatus">
            <div className="flex h-full">
                {/* Settings Sidebar */}
                <aside className="w-56 bg-card border-r border-border p-4 flex-shrink-0">
                    <h2 className="text-sm font-semibold text-foreground mb-4 px-2">Configuración</h2>
                    <nav className="space-y-1">
                        {settingsNavItems.map((item) => {
                            const isActive = url.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                                        isActive
                                            ? "bg-neutral-100 text-neutral-900"
                                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
