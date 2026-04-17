'use client';

import { useParams } from 'next/navigation';
import Navigator from '../[userId]/mainComponents/navig';

export default function AuthLayout({ children }) {
    const params = useParams();
    const userId = params?.userId;
    
    if (!userId) {
        return <>{children}</>;
    }
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            marginBottom: '150px'
        }}>
            <div style={{ flex: 1 }}>
                {children}
            </div>
            <Navigator userId={userId} />
        </div>
    );
}