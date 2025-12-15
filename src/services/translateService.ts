import { TranslationResult } from '../types/translator';
import { BACKEND_API_URL } from '../config/apiConfig';

/**
 * Dịch văn bản thông qua backend API
 * Backend sẽ gọi Google Translate API
 */
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult | null> {
    if (!text.trim()) {
        return null;
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/api/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            })
        });
        
        if (!response.ok) {
            throw new Error('Translation request failed');
        }

        const data = await response.json();
        
        return {
            originalText: data.original_text,
            translatedText: data.translated_text,
            sourceLanguage: data.source_language,
            targetLanguage: data.target_language
        };
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

/**
 * Tự động phát hiện ngôn ngữ và dịch
 */
export async function autoTranslate(text: string): Promise<TranslationResult | null> {
    // Phát hiện xem văn bản có phải tiếng Việt không
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    const isVietnamese = vietnamesePattern.test(text);

    const sourceLang = isVietnamese ? 'vi' : 'en';
    const targetLang = isVietnamese ? 'en' : 'vi';

    return translateText(text, sourceLang, targetLang);
}
