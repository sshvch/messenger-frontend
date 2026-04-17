'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import './settingsStyles.css';

export default function Settings() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId;
    
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        if (userId) {
            loadUserData();
            loadAvatar();
        }
    }, [userId]);
    
    async function loadUserData() {
        try {
            const userData = await api.fetchUser(userId);
            setUser(userData);
            setName(userData.Name || '');
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }
    
    async function loadAvatar() {
        try {
            const response = await api.getAvatar(userId);
            if (response && response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAvatarUrl(url);
            }
        } catch (error) {
            console.error('Ошибка загрузки аватарки:', error);
        }
    }
    
    async function handleUpdateProfile(e) {
        e.preventDefault();
        setMessage('');
        
        if (password && password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            setMessageType('error');
            return;
        }
        
        if (password && password.length < 6) {
            setMessage('Пароль должен быть минимум 6 символов');
            setMessageType('error');
            return;
        }
        
        setLoading(true);
        
        try {
            const updateData = {};
            if (name !== user?.Name) updateData.name = name;
            if (password) updateData.password = password;
            
            if (Object.keys(updateData).length === 0) {
                setMessage('Нет изменений для сохранения');
                setMessageType('error');
                setLoading(false);
                return;
            }
            
            const result = await api.updateProfile(userId, updateData);
            
            if (result.success) {
                setMessage('Профиль успешно обновлён!');
                setMessageType('success');
                setPassword('');
                setConfirmPassword('');
                loadUserData();
            } else {
                setMessage(result.message || 'Ошибка при обновлении');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setMessage('Ошибка при обновлении профиля');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    }
    
    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            setMessage('Можно загружать только изображения');
            setMessageType('error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setMessage('Файл не должен превышать 5MB');
            setMessageType('error');
            return;
        }
        
        setLoading(true);
        
        try {
            const result = await api.uploadAvatar(userId, file);
            if (result.success) {
                setMessage('Аватарка успешно обновлена!');
                setMessageType('success');
                loadAvatar();
            } else {
                setMessage(result.message || 'Ошибка при загрузке');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setMessage('Ошибка при загрузке');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    }
    
    async function handleDeleteAvatar() {
        if (!confirm('Удалить аватарку?')) return;
        
        setLoading(true);
        const result = await api.deleteAvatar(userId);
        if (result.success) {
            setAvatarUrl('');
            setMessage('Аватарка удалена');
            setMessageType('success');
        } else {
            setMessage('Ошибка при удалении');
            setMessageType('error');
        }
        setLoading(false);
    }
    
    async function handleDeleteAccount() {
        if (!confirm('Вы уверены? Это действие необратимо!')) return;
        
        const result = await api.deleteUser(userId);
        if (result.success) {
            router.push('/');
        } else {
            setMessage('Ошибка при удалении аккаунта');
            setMessageType('error');
        }
    }
    
    return (
        <div className="settings-container">
            <div className="settings-card">
                <div className="settings-header">
                    <h1>Настройки</h1>
                    <p>Управление профилем</p>
                </div>
                
                <div className="avatar-section">
                    <img
                        src={avatarUrl || '/default-avatar.png'}
                        alt="Avatar"
                        className="avatar-image"
                    />
                    <div className="avatar-buttons">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="avatar-btn avatar-upload-btn"
                        >
                            Загрузить
                        </button>
                        <button
                            onClick={handleDeleteAvatar}
                            className="avatar-btn avatar-delete-btn"
                        >
                            Удалить
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden-input"
                    />
                </div>
                
                <form onSubmit={handleUpdateProfile} className="settings-form">
                    {message && (
                        <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Новый пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Оставьте пустым, чтобы не менять"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Подтвердите пароль</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите новый пароль"
                        />
                    </div>
                    
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </form>
                
                <div className="delete-account-section">
                    <button onClick={handleDeleteAccount} className="delete-btn">
                        Удалить аккаунт
                    </button>
                </div>
            </div>
        </div>
    );
}