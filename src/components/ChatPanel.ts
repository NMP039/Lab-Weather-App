import { chatWithBot, ChatResponse } from '../services/aiService';

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    timestamp: string;
}

export class ChatPanel {
    private container: HTMLElement;
    private chatHistory: ChatMessage[] = [];
    private sessionId: string;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'chat-panel';
        this.sessionId = `user_${Date.now()}`;
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="chat-header">
                <h3>💬 AI Chatbot</h3>
                <button class="chat-toggle-btn" id="chatToggle">−</button>
            </div>
            <div class="chat-content" id="chatContent">
                <div class="chat-messages" id="chatMessages">
                    <div class="chat-message bot">
                        <div class="message-content">Xin chào! Tôi có thể giúp gì cho bạn?</div>
                        <div class="message-time">${new Date().toLocaleTimeString('vi-VN')}</div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chatInput" 
                        class="chat-input" 
                        placeholder="Nhập tin nhắn..."
                        autocomplete="off"
                    />
                    <button id="chatSend" class="chat-send-btn">
                        <span>📤</span>
                    </button>
                </div>
            </div>
        `;
    }

    private attachEventListeners(): void {
        const input = this.container.querySelector('#chatInput') as HTMLInputElement;
        const sendBtn = this.container.querySelector('#chatSend') as HTMLButtonElement;
        const toggleBtn = this.container.querySelector('#chatToggle') as HTMLButtonElement;
        const chatContent = this.container.querySelector('#chatContent') as HTMLElement;

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        toggleBtn.addEventListener('click', () => {
            const isCollapsed = chatContent.style.display === 'none';
            chatContent.style.display = isCollapsed ? 'flex' : 'none';
            toggleBtn.textContent = isCollapsed ? '−' : '+';
        });
    }

    private async sendMessage(): Promise<void> {
        const input = this.container.querySelector('#chatInput') as HTMLInputElement;
        const message = input.value.trim();

        if (!message) return;

        // Add user message to UI
        this.addMessageToUI('user', message);
        input.value = '';

        // Show loading
        const loadingId = this.showLoading();

        try {
            // Call backend API
            const response = await chatWithBot(message, this.sessionId);

            // Remove loading
            this.removeLoading(loadingId);

            if (response) {
                this.addMessageToUI('bot', response.reply);
            } else {
                this.addMessageToUI('bot', 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại.');
            }
        } catch (error) {
            this.removeLoading(loadingId);
            this.addMessageToUI('bot', 'Đã xảy ra lỗi. Vui lòng kiểm tra kết nối backend.');
            console.error('Chat error:', error);
        }
    }

    private addMessageToUI(role: 'user' | 'bot', content: string): void {
        const messagesContainer = this.container.querySelector('#chatMessages') as HTMLElement;
        const timestamp = new Date().toLocaleTimeString('vi-VN');

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${role}`;
        messageEl.innerHTML = `
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${timestamp}</div>
        `;

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        this.chatHistory.push({ role, content, timestamp });
    }

    private showLoading(): string {
        const messagesContainer = this.container.querySelector('#chatMessages') as HTMLElement;
        const loadingId = `loading_${Date.now()}`;

        const loadingEl = document.createElement('div');
        loadingEl.className = 'chat-message bot loading';
        loadingEl.id = loadingId;
        loadingEl.innerHTML = `
            <div class="message-content">
                <span class="loading-dots">●●●</span>
            </div>
        `;

        messagesContainer.appendChild(loadingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return loadingId;
    }

    private removeLoading(loadingId: string): void {
        const loadingEl = this.container.querySelector(`#${loadingId}`);
        if (loadingEl) {
            loadingEl.remove();
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public getElement(): HTMLElement {
        return this.container;
    }

    public clearHistory(): void {
        this.chatHistory = [];
        const messagesContainer = this.container.querySelector('#chatMessages') as HTMLElement;
        messagesContainer.innerHTML = `
            <div class="chat-message bot">
                <div class="message-content">Xin chào! Tôi có thể giúp gì cho bạn?</div>
                <div class="message-time">${new Date().toLocaleTimeString('vi-VN')}</div>
            </div>
        `;
    }
}
