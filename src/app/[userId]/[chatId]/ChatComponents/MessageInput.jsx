'use client';
import { useState } from 'react';
import './styles.css';

export default function MessageInput({ senderId, chatId, onSendMessage }) {
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const apiBase = (process.env.NEXT_PUBLIC_API_URL).replace('/api', '');
    const handleSend = async () => {
        if (!text.trim() || isSending) return;

        setIsSending(true);
        
        try {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatId: Number(chatId),
    senderId: senderId,
    text: text
  })
});


            if (response.ok) {
                try {
                    await onSendMessage(text);
                } catch (signalRError) {
                    // Сообщение всё равно сохранится в БД
                }
                setText('');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="inputContainer">
            <div className="message-form">
                <input
                    className="message-input"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    disabled={isSending}
                    placeholder="Введите сообщение..."
                />
                <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={isSending || !text.trim()}
                >
                    {isSending ? '...' : '→'}
                </button>
            </div>
        </div>
    );
}
