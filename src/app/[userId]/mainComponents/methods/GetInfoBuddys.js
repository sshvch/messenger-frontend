  
  import { api } from "../../../../../services/api";
  export async function GetInfoBuddys(userId,chats) {

  const OnlyBuddysId = chats.map(chat => chat.User1Id === userId ? chat.User2Id : chat.User1Id);
  // Загружаем всех уникальных пользователей
  const usersPromises = OnlyBuddysId.map(id =>  api.fetchUser(id).then(user => ({ id, user })));
  const usersResults = await Promise.all(usersPromises);
  
  // Собираем в объект
  const users = {};
  usersResults.forEach(
    ({ id, user }) => { if (user) users[id] = user;}
  );
  return users;
};