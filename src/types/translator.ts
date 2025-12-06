export interface TranslationRequest {
    text: string;
    from: 'en' | 'vi';
    to: 'en' | 'vi';
}

export interface TranslationResult {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}
