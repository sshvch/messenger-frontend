import { api } from '../../../../services/api';
import WindowDialog from './ChatComponents/WindowDialog';
import './ChatComponents/styles.css';

export default async function ChatPage({ params }) {
  const { userId, chatId } = await params;
  const chat = await api.fetchChat(Number(chatId));
  const messages = await api.getMessages(Number(chatId));
  
  return (
    <WindowDialog 
      chatId={chatId} 
      chat={chat} 
      initialMessages={messages || []}
      userId={userId}
    />
  );
}