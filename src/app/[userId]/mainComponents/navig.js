"use client";

import { usePathname, useRouter } from 'next/navigation';
import './navig.css';

export default function Navigator({ userId }) {
    const router = useRouter();
    const pathname = usePathname();
    
    if (!userId) {
        console.error('Navigator: userId не передан');
        return null;
    }
    
    function GoToSettings() {
        router.push(`/${userId}/settings`);
    }
    
    function GoToChats() {
        router.push(`/${userId}`);
    }
    
    function GoToFriends() {
        router.push(`/${userId}/friends`);
    }

    const isActive = (path) => {
        if (path === '') {
            return pathname === `/${userId}`;
        }
        return pathname === `/${userId}${path}`;
    };

    return (
        <div className="navigator">
            <button 
                type="button" 
                onClick={GoToChats}
                className={isActive('') ? 'active' : ''}
            >
                💬 Чаты
            </button>
            
            <button 
                type="button" 
                onClick={GoToFriends}
                className={isActive('/friends') ? 'active' : ''}
            >
                👥 Друзья
            </button>
            
            <button 
                type="button" 
                onClick={GoToSettings}
                className={isActive('/settings') ? 'active' : ''}
            >
                ⚙️ Настройки
            </button>
        </div>
    );
}