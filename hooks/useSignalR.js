'use client';
import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export function useSignalR(chatId, userId, initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const connection = useRef(null);
  const pendingMessages = useRef([]);  // ← очередь сообщений
  
  const chatIdNumber = chatId ? Number(chatId) : null;
  const userIdNumber = userId ? Number(userId) : null;

  // Функция отправки с очередью
  const sendMessage = async (text) => {
    if (!text?.trim()) return false;
    if (!userIdNumber) return false;
    
    const messageToSend = text.trim();
    
    // Если не подключены - кладём в очередь
    if (!isConnected || !connection.current) {
      console.log('Нет соединения, сообщение в очередь');
      pendingMessages.current.push(messageToSend);
      return false;
    }
    
    // Отправляем
    try {
      await connection.current.invoke('SendMessage', chatIdNumber, userIdNumber, messageToSend);
      return true;
    } catch (error) {
      console.error('Ошибка отправки:', error);
      return false;
    }
  };
  
  // Отправка накопленных сообщений при подключении
  useEffect(() => {
    if (isConnected && pendingMessages.current.length > 0) {
      console.log('Отправка накопленных сообщений:', pendingMessages.current.length);
      const messagesToSend = [...pendingMessages.current];
      pendingMessages.current = [];
      
      messagesToSend.forEach(async (msg) => {
        try {
          await connection.current.invoke('SendMessage', chatIdNumber, userIdNumber, msg);
        } catch (error) {
          console.error('Ошибка отправки накопленного сообщения:', error);
          pendingMessages.current.push(msg); // возвращаем в очередь
        }
      });
    }
  }, [isConnected, chatIdNumber, userIdNumber]);

  // Подключение к чату
  useEffect(() => {
    if (!chatIdNumber) return;

    const hub = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chathub')
      .withAutomaticReconnect()
      .build();
    
    connection.current = hub;
    
    hub.on('ReceiveMessage', (newMessage) => { 
      setMessages(old => [...old, newMessage]);  
    });
    
    hub.start()
      .then(() => {
        console.log('SignalR connected');
        setIsConnected(true);
        return hub.invoke('JoinChat', chatIdNumber);
      })
      .catch(error => console.error('Ошибка подключения:', error));
    
    hub.onreconnected(() => {
      console.log('SignalR reconnected');
      setIsConnected(true);
      hub.invoke('JoinChat', chatIdNumber);
    });
    
    hub.onreconnecting(() => {
      setIsConnected(false);
    });
    
    return () => {
      if (connection.current) {
        connection.current.invoke('LeaveChat', chatIdNumber)
          .finally(() => connection.current.stop());
        setIsConnected(false);
      }
    };
  }, [chatIdNumber]);

  return { messages, sendMessage, isConnected };
}