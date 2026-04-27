'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './MainStyles.css';
import { api } from '../../../../services/api';

export function ChatList({ chats, users, userId }) {  
    const router = useRouter();
    const [avatars, setAvatars] = useState({});
    const loadedRef = useRef(false); // флаг, чтобы загрузить только один раз
    
    const safeChats = Array.isArray(chats) ? chats : [];
    
    const sortedChats = [...safeChats].sort((a, b) => {
        const dateA = a.LastMessageAt ? new Date(a.LastMessageAt) : new Date(0);
        const dateB = b.LastMessageAt ? new Date(b.LastMessageAt) : new Date(0);
        return dateB - dateA;
    });
    
    // Загружаем аватарки ТОЛЬКО ОДИН РАЗ
    useEffect(() => {
        if (loadedRef.current) return; // если уже загружали, выходим
        if (sortedChats.length === 0) return;
        
        loadedRef.current = true;
        
        async function loadAvatars() {
            const avatarMap = {};
            for (const chat of sortedChats) {
                const otherUserId = chat.User1Id === userId ? chat.User2Id : chat.User1Id;
                try {
                    const response = await api.getAvatar(otherUserId);
                    if (response && response.ok) {
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        avatarMap[otherUserId] = url;
                    } else {
                        avatarMap[otherUserId] = '/default-avatar.png';
                    }
                } catch (error) {
                    avatarMap[otherUserId] = '/default-avatar.png';
                }
            }
            setAvatars(avatarMap);
        }
        
        loadAvatars();
        
        // Очистка URL при размонтировании
        return () => {
            Object.values(avatars).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []); // ← ПУСТОЙ МАССИВ = ЗАПУСКАЕМ ТОЛЬКО 1 РАЗ
    
    function Transition(chat) {
        router.push(`/${userId}/${chat.Id}`);
    }
    
    if (sortedChats.length === 0) {
        return (
            <div className="chatList">
                <div className="emptyChats">
                    📭 У вас пока нет чатов<br/>
                    Начните общение с новыми друзьями!
                </div>
            </div>
        );
    }
    
    return (
        <div className="chatList">
            {sortedChats.map(chat => {
                const otherUserId = chat.User1Id === userId ? chat.User2Id : chat.User1Id;
                const userName = users[otherUserId]?.Name || 'Чат';
                const avatarUrl = avatars[otherUserId] || '/default-avatar.png';
                
                return (
                    <div className='chat' key={chat.Id} onClick={() => Transition(chat)}>
                        <div className="chat-avatar">
                            <img 
                                src={avatarUrl} 
                                alt={userName}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div className="chat-info">
                            <div className='nameChat'>{userName}</div>
                            <div className='lastMessage'>{chat.LastMessage || 'Нет сообщений'}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}