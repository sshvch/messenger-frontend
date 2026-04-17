'use client'
import './loginStyle.css';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "../../services/api";

export default function Log() {
    const name = useRef(null);
    const password = useRef(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function CheckUser(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        let userId = await GetUserId(name, password);
        
        if (userId != '-1') {
            router.push(`/${userId}`);
        } else {
            setError('Неверное имя пользователя или пароль');
        }
        setLoading(false);
    }

    function PushToRegistration() {
        router.push('/registor');
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Вход</h1>
                    <p>Добро пожаловать обратно!</p>
                </div>
                
                <form onSubmit={CheckUser}>
                    <div className="input-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            ref={name}
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            ref={password}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                
                <div className="register-link">
                    Нет аккаунта? <button onClick={PushToRegistration}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
}



export  async function GetUserId(name,password){
    const userName = name.current.value;
    const userPassword = password.current.value;
    let userId =  await api.fetchUserByPassword(userName,userPassword)
    return userId;
  }