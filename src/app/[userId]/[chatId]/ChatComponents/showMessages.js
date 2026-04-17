'use client';
import React, { useEffect, useRef } from 'react';
import { Message } from './message';

export function ShowMessages({ messages, userId,onDeleteMessage }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="messagesContainer">
        <div className="no-messages">
          Нет сообщений. Напишите первое!
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  }
  return (
    <div className="messagesContainer">
      {messages.map((msg, index) => 
        <Message key={index} msg={msg} userId={userId} onDelete={onDeleteMessage} />
      )}
      <div ref={messagesEndRef} /></div>
  );
}