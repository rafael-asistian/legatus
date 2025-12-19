import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface HeaderProps {
    userName?: string;
    userAvatar?: string;
}

export default function Header({ userName = 'Legatus', userAvatar }: HeaderProps) {
    return (
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
            {/* Search Bar */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                    placeholder="Buscar conversaciones, contactos, tickets..."
                    className="pl-10 bg-neutral-50 border-neutral-200 h-9 focus:border-neutral-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                    ⌘K
                </span>
            </div>

            {/* Right side - Notifications and User */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{userName}</span>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xs font-medium">
                            {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}

