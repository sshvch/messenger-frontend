'use client';

import { useEffect, useState } from 'react';
import {api} from '../../../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.GetStats();  // ← data уже готовый объект
        setStats(data);
      } catch (err) {
        setError('Ошибка загрузки статистики');
        console.error(err);
      } finally {
        setLoading(false);
  }
};

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка статистики...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  // Подсчёт визитов по часам
  const visitsByHour = {};
  for (let i = 0; i < 24; i++) {
    visitsByHour[i] = 0;
  }
  
  stats?.Visits?.forEach(visit => {
    const hour = new Date(visit.VisitTime).getHours();
    visitsByHour[hour]++;
  });

  const maxHourCount = Math.max(...Object.values(visitsByHour), 1);
  const uniqueUsers = new Set(stats?.Visits?.map(v => v.UserId)).size;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: '#1f2937' }}>
          📊 Админ-панель
        </h1>

        {/* Карточки */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Сегодня зашло</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{stats?.Total || 0}</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Уникальных сегодня</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{uniqueUsers}</p>
            </div>
          </div>
        </div>

        {/* График по часам */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>📈 Посещения по часам (сегодня)</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '250px', overflowX: 'auto', paddingBottom: '10px' }}>
            {Object.entries(visitsByHour).map(([hour, count]) => (
              <div key={hour} style={{ flex: 1, minWidth: '35px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                  height: `${(count / maxHourCount) * 200}px`,
                  transition: 'height 0.3s'
                }}>
                  <div style={{ textAlign: 'center', color: 'white', fontSize: '10px', paddingTop: '2px' }}>
                    {count}
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '8px' }}>
                  {hour}:00
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            📊 Высота столбца = количество визитов в час
          </div>
        </div>

        {/* Таблица визитов */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>👤 Визиты за сегодня</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>ID пользователя</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Имя</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Время визита</th>
                </tr>
              </thead>
              <tbody>
                {stats?.Visits?.length > 0 ? (
                  stats.Visits.map((visit, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{visit.UserId}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{visit.UserName}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                        {new Date(visit.VisitTime).toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Нет визитов за сегодня
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}