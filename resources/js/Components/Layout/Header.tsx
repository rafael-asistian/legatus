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
        <header className="h-14 bg-white border-b flex items-center justify-between px-4">
            {/* Search Bar */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar conversaciones, contactos, tickets..."
                    className="pl-10 bg-gray-50 border-gray-200 h-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                    ⌘K
                </span>
            </div>

            {/* Right side - Notifications and User */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-500" />
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{userName}</span>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xs">
                            {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
