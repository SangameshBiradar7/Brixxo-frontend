'use client';

import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';

export default function MessagesLink() {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/conversations" className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 relative group">
      Messages
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}