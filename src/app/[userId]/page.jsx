import { api } from '../../../services/api';
import { ChatList } from './mainComponents/ChatList';
import { GetInfoBuddys } from './mainComponents/methods/GetInfoBuddys';
import Navigator from './mainComponents/navig'; 

export default async function Home({params}) {
  const { userId } = await params;
  const userIdInt = Number(userId);
  
  const response = await api.fetchChats(userIdInt);
  const chats = Array.isArray(response) ? response : [];
  const users = await GetInfoBuddys(userIdInt, chats);
  
  return (
    <div className="chats-page">
      <div className="chats-header">
        <h1>Чаты</h1>
      </div>
      <ChatList chats={chats} users={users} userId={userIdInt} />
    </div>
  );
}