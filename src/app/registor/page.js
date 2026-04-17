'use client'
import './RegistorStyles.css';
import { useRef, useState } from 'react';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation'; 

export default function Register() {
    const nameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingName, setCheckingName] = useState(false);
    const router = useRouter();

    // Проверка имени при вводе
    async function checkName(name) {
        if (name.length < 3) return;
        
        setCheckingName(true);
        try {
            const result = await api.checkUserName(name);
            if (result.exists) {
                setError('Пользователь с таким именем уже существует');
                return false;
            } else {
                if (error === 'Пользователь с таким именем уже существует') {
                    setError('');
                }
                return true;
            }
        } catch (err) {
            console.error('Ошибка проверки имени:', err);
            return false;
        } finally {
            setCheckingName(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError('');
        
        const name = nameRef.current?.value;
        const password = passwordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        
        if (!name || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        // Проверка уникальности имени
        const isNameAvailable = await checkName(name);
        if (!isNameAvailable) {
            return;
        }

        setLoading(true);
        const response = await api.CreateUser(name, password);
        if (response.ok) {
            router.push('/');
        } else {
            setError('Ошибка при создании пользователя');
        }
        setLoading(false);
    }

    function goToLogin() {
        router.push('/');
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1>Регистрация</h1>
                    <p>Создайте новый аккаунт</p>
                </div>
                
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            ref={nameRef}
                            placeholder="Введите ваше имя"
                            onChange={(e) => {
                                // Очищаем ошибку при изменении имени
                                if (error === 'Пользователь с таким именем уже существует') {
                                    setError('');
                                }
                            }}
                            onBlur={(e) => checkName(e.target.value)}
                            required
                        />
                        {checkingName && <small style={{ color: '#666' }}>Проверка имени...</small>}
                    </div>
                    
                    <div className="input-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Подтвердите пароль</label>
                        <input
                            type="password"
                            ref={confirmPasswordRef}
                            placeholder="Повторите пароль"
                            required
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        type="submit" 
                        className="register-btn"
                        disabled={loading || checkingName}
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <div className="login-link">
                    Уже есть аккаунт? <button onClick={goToLogin}>Войти</button>
                </div>
            </div>
        </div>
    );
}