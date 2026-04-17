'use client';
import React, { useState, useEffect } from 'react';
//import { useSignalR } from '../../../hooks/useSignalR';
import { useSignalR } from '../../../../../hooks/useSignalR';
import MessageInput from './MessageInput';
import { ShowMessages } from './showMessages';
import './styles.css';
import { api } from '../../../../../services/api';

export default function WindowDialog({ chatId, chat, initialMessages = [], userId }) {
  const { messages, sendMessage } = useSignalR(Number(chatId), chat.User1Id, initialMessages);
  const [buddyName, setBuddyName] = useState('Загрузка...');
  
async function handleDeleteMessage(messageId) {
    try {
        const result = await api.deleteMessage(messageId, userId);  // ← передаём userId
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.message || 'Ошибка при удалении');
        }
    } catch (error) {
        console.error('Ошибка удаления:', error);
    }
}

  // Исправлено: User1Id и User2Id с большой буквы
  const otherUserId = chat.User1Id == userId ? chat.User2Id : chat.User1Id;
  
  console.log('chat:', chat);
  console.log('userId:', userId);
  console.log('otherUserId:', otherUserId);
  
  // Загружаем имя собеседника
  useEffect(() => {
    async function loadBuddyName() {
      try {
        console.log('Загружаем пользователя с ID:', otherUserId);
        const user = await api.fetchUser(otherUserId);
        console.log('Получен пользователь:', user);
        setBuddyName(user.Name || 'Пользователь');
      } catch (error) {
        console.error('Ошибка загрузки имени:', error);
        setBuddyName('Пользователь');
      }
    }
    if (otherUserId) {
      loadBuddyName();
    }
  }, [otherUserId]);

  return (
    <div className="chatContainer">
      <div className="chatHeader">
        <h2>{buddyName}</h2>
        <p>Чат</p>
      </div>
      <ShowMessages 
        messages={messages} 
        userId={userId} 
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageInput 
        senderId={userId} 
        chatId={chatId} 
        onSendMessage={sendMessage} 
      />
    </div>
  );
}