import { TranslationResult } from '../types/translator';

/**
 * Dịch văn bản sử dụng Google Translate API miễn phí
 * Sử dụng endpoint công khai của Google Translate
 */
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult | null> {
    if (!text.trim()) {
        return null;
    }

    try {
        // Sử dụng Google Translate API endpoint công khai
        // API này miễn phí nhưng không có rate limit chính thức
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Translation request failed');
        }

        const data = await response.json();
        
        // Parse kết quả từ API
        // Format: [[[translated_text, original_text, null, null, 0]], null, source_lang]
        let translatedText = '';
        
        if (data[0]) {
            for (const item of data[0]) {
                if (item[0]) {
                    translatedText += item[0];
                }
            }
        }

        const detectedSourceLang = data[2] || sourceLang;

        return {
            originalText: text,
            translatedText: translatedText,
            sourceLanguage: detectedSourceLang,
            targetLanguage: targetLang
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
