'use client';
import { useState } from 'react';
import { api } from '../../../../services/api';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import './FriendsStyles.css';

function Friends() {
    const router = useRouter();
    const params = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUserId = Number(params.userId);

    async function findSimilarUsers(query) {
        if (!query.trim()) {
            return [];
        }
        setLoading(true);
        try {
            const data = await api.GetUsersByLine(query);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Ошибка поиска:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }

    function renderUsersList(users) {
        if (!users || users.length === 0) {
            return <div className="no-results">Пользователи не найдены</div>;
        }
        
        return (
            <div className="results-container">
                <h3 className="results-title">Найдено: {users.length}</h3>
                <ul className="users-list">
                    {users.map(user => (
                        <li key={user.Id} className="user-item">
                            <div className="user-info">
                                <span className="user-name">{user.Name}</span>
                            </div>
                            <button 
                                onClick={() => startChat(user.Id)}
                                className="write-btn"
                            >
                                Написать
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    async function startChat(userId) {
        console.log(currentUserId, userId);
        const response = await api.CreateChat(Number(currentUserId), userId);
        const chat = await response.json();
        router.push(`/${currentUserId}/${chat.Id}`);
    }

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        
        const similar = await findSimilarUsers(value);
        setSearchResults(similar);
    };

    return (
        <div className="friends-container">
            <div className="friends-card">
                <div className="friends-header">
                    <h1>Поиск друзей</h1>
                    <p>Найдите новых собеседников</p>
                </div>
                
                <div className="search-section">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Введите имя для поиска..."
                        className="search-input"
                    />
                    
                    {loading && <div className="loading-spinner">Поиск...</div>}
                    
                    {!loading && searchTerm && renderUsersList(searchResults)}
                    
                    {!loading && !searchTerm && (
                        <div className="hint">
                            🔍 Введите имя для поиска пользователей
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Friends;