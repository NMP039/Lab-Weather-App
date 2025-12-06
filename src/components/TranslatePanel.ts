import { autoTranslate, translateText } from '../services/translateService';
import { TranslationResult } from '../types/translator';

export class TranslatePanel {
    private container: HTMLElement;
    private sourceTextarea: HTMLTextAreaElement | null = null;
    private targetTextarea: HTMLTextAreaElement | null = null;
    private isTranslating: boolean = false;

    constructor(container: HTMLElement) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="translate-container">
                <div class="translate-header">
                    <h3 class="translate-title">🌐 Dịch Thuật</h3>
                    <div class="language-selector">
                        <button class="lang-btn active" data-mode="en-vi">Anh → Việt</button>
                        <button class="lang-btn" data-mode="vi-en">Việt → Anh</button>
                    </div>
                </div>
                
                <div class="translate-content">
                    <div class="translate-input-section">
                        <label class="translate-label">Văn bản gốc</label>
                        <textarea 
                            class="translate-textarea source-text" 
                            placeholder="Nhập văn bản cần dịch..."
                            rows="4"
                        ></textarea>
                        <div class="translate-actions">
                            <button class="translate-btn">
                                <span class="translate-icon">🔄</span>
                                Dịch
                            </button>
                            <button class="clear-btn">
                                <span class="clear-icon">🗑️</span>
                                Xóa
                            </button>
                        </div>
                    </div>
                    
                    <div class="translate-output-section">
                        <label class="translate-label">Bản dịch</label>
                        <textarea 
                            class="translate-textarea target-text" 
                            placeholder="Kết quả dịch sẽ hiển thị ở đây..."
                            rows="4"
                            readonly
                        ></textarea>
                        <div class="translate-info">
                            <span class="translation-status"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.sourceTextarea = this.container.querySelector('.source-text');
        this.targetTextarea = this.container.querySelector('.target-text');
    }

    private attachEventListeners(): void {
        // Translate button
        const translateBtn = this.container.querySelector('.translate-btn');
        translateBtn?.addEventListener('click', () => this.handleTranslate());

        // Clear button
        const clearBtn = this.container.querySelector('.clear-btn');
        clearBtn?.addEventListener('click', () => this.handleClear());

        // Language mode buttons
        const langButtons = this.container.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                langButtons.forEach(b => b.classList.remove('active'));
                (e.target as HTMLElement).classList.add('active');
            });
        });

        // Enter key to translate (with Ctrl/Cmd)
        this.sourceTextarea?.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.handleTranslate();
            }
        });
    }

    private async handleTranslate(): Promise<void> {
        if (this.isTranslating || !this.sourceTextarea || !this.targetTextarea) {
            return;
        }

        const text = this.sourceTextarea.value.trim();
        
        if (!text) {
            this.showStatus('⚠️ Vui lòng nhập văn bản cần dịch', 'warning');
            return;
        }

        this.isTranslating = true;
        this.showStatus('⏳ Đang dịch...', 'loading');
        
        const translateBtn = this.container.querySelector('.translate-btn');
        translateBtn?.classList.add('translating');

        try {
            const activeMode = this.container.querySelector('.lang-btn.active')?.getAttribute('data-mode');
            let result: TranslationResult | null = null;

            if (activeMode === 'en-vi') {
                result = await translateText(text, 'en', 'vi');
            } else if (activeMode === 'vi-en') {
                result = await translateText(text, 'vi', 'en');
            }

            if (result) {
                this.targetTextarea.value = result.translatedText;
                const langNames: { [key: string]: string } = {
                    'en': 'Tiếng Anh',
                    'vi': 'Tiếng Việt'
                };
                const statusText = `✅ Đã dịch từ ${langNames[result.sourceLanguage] || result.sourceLanguage} sang ${langNames[result.targetLanguage] || result.targetLanguage}`;
                this.showStatus(statusText, 'success');
            } else {
                this.showStatus('❌ Không thể dịch văn bản. Vui lòng thử lại.', 'error');
            }
        } catch (error) {
            console.error('Translation error:', error);
            this.showStatus('❌ Có lỗi xảy ra khi dịch. Vui lòng thử lại.', 'error');
        } finally {
            this.isTranslating = false;
            translateBtn?.classList.remove('translating');
        }
    }

    private handleClear(): void {
        if (this.sourceTextarea && this.targetTextarea) {
            this.sourceTextarea.value = '';
            this.targetTextarea.value = '';
            this.showStatus('', '');
            this.sourceTextarea.focus();
        }
    }

    private showStatus(message: string, type: string): void {
        const statusElement = this.container.querySelector('.translation-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `translation-status ${type}`;
        }
    }
}
