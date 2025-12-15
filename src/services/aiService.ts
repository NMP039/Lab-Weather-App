import { BACKEND_API_URL } from '../config/apiConfig';

export interface ChatMessage {
    message: string;
    session_id?: string;
}

export interface ChatResponse {
    reply: string;
    session_id: string;
    timestamp: string;
}

/**
 * Chat with AI bot through backend Hugging Face API
 */
export async function chatWithBot(message: string, sessionId: string = 'default'): Promise<ChatResponse | null> {
    if (!message.trim()) {
        return null;
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            })
        });

        if (!response.ok) {
            throw new Error('Chat request failed');
        }

        const data = await response.json();
        return {
            reply: data.reply,
            session_id: data.session_id,
            timestamp: data.timestamp
        };
    } catch (error) {
        console.error('Chat error:', error);
        return null;
    }
}
