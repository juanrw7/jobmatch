'use client';

import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Bell, Search, Menu } from 'lucide-react';

interface TopbarProps {
  user: User;
}

export function Topbar({ user }: TopbarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-4 ml-8">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
