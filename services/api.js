//true

class ApiService {
  baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async fetchChats(userId) {
    const res = await fetch(`${this.baseURL}/chats/${userId}`);
    return res.json();
  }
  async checkUserName(name) {
    const res = await fetch(`${this.baseURL}/users/check-name/${name}`);
    return res.json();
}
  async fetchChat(chatId) {
    const res = await fetch(`${this.baseURL}/chats/now/${chatId}`);
    return res.json();
  }
async fetchUser(userId) {
    try {
        const res = await fetch(`${this.baseURL}/users/${userId}`);
        const data = await res.json();
        console.log('fetchUser вернул:', data);
        return data;
    } catch (error) {
        console.error('Ошибка fetchUser:', error);
        return { Name: 'Пользователь' };
    }
}
  async getMessages(chatId) {
    const res = await fetch(`${this.baseURL}/messages/${chatId}`);
    
    return res.json();
  }
  async fetchUserByPassword(name, password) {
    const options = {
      method: "POST",
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({_name: name,_password: password})
    };
    const res = await fetch(`${this.baseURL}/users/check`, options);
    return res.json();
  }
  async CreateUser(name,password){
    const option={
      method: "POST",
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({Name:name,Password:password})
    }
    const res = await fetch(`${this.baseURL}/users/create`,option)
    return res;
  }
async CreateChat(user1Id, user2Id) {
    console.log('Создание чата для:', user1Id, user2Id);
    
    const option = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            
                User1Id: Number(user1Id),
                User2Id: Number(user2Id)
            
        })
    }
    
    console.log('Отправляю:', option.body);
    
    const res = await fetch(`${this.baseURL}/chats/create`, option);
    
    return res;
}
  async GetUsersByLine(line){
        const res = await fetch(`${this.baseURL}/users/getByLine/${line}`)
    return res.json();
  }
async deleteMessage(messageId, userId) {
    const options = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    };
    const res = await fetch(`${this.baseURL}/messages/${messageId}?userId=${userId}`, options);
    return res.json();
}

async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const res = await fetch(`${this.baseURL}/users/${userId}/avatar`, {
        method: 'PUT',
        body: formData
    });
    return res.json();
}

async getAvatar(userId) {
    const res = await fetch(`${this.baseURL}/users/${userId}/avatar`);
    if (!res.ok) {return null;}
    return res; 
}
async deleteAvatar(userId) {
    const options = { method: "DELETE" };
    const res = await fetch(`${this.baseURL}/users/${userId}/avatar`, options);
    return res.json();
}
async updateProfile(userId, data) {
    const options = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    const res = await fetch(`${this.baseURL}/users/${userId}/profile`, options);
    return res.json();
}
}
export const api = new ApiService();