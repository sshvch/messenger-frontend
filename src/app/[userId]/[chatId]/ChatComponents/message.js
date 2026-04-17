import './styles.css';

export function Message({ msg, userId, onDelete }) {
    // Проверка на фронте - показываем кнопку только для своих сообщений
    const isMyMessage = msg.senderId == userId;
    
    async function handleDelete() {
        if (confirm('Удалить сообщение?')) {
            onDelete(msg.id);
        }
    }
    
    return (
        <div className={isMyMessage ? "msgSender" : "msgBuddy"}>
            <div className='textMsg'>
                {msg.text}
            </div>
            {/* Кнопка только для своих сообщений */}
            {isMyMessage && (
                <button 
                    onClick={handleDelete}
                    className="deleteMsgBtn"
                >
                    🗑️
                </button>
            )}
        </div>
    );
}