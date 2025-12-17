import { useState, useEffect, useCallback } from 'react';

export interface UseSpeechRecognitionProps {
    onResult?: (transcript: string) => void;
    onEnd?: () => void;
}

export function useSpeechRecognition({ onResult, onEnd }: UseSpeechRecognitionProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = 'en-US';
                setRecognition(recognitionInstance);
            } else {
                setError('Speech recognition is not supported in this browser.');
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            try {
                recognition.start();
                setIsListening(true);
                setError(null);
            } catch (err) {
                console.error("Speech recognition start error:", err);
            }
        }
    }, [recognition, isListening]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event: any) => {
            const currentTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');

            setTranscript(currentTranscript);
            if (onResult) {
                onResult(currentTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (onEnd) {
                onEnd();
            }
        };

        return () => {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
        };
    }, [recognition, onResult, onEnd]);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        hasSupport: !!recognition
    };
}

// Add type definitions for Web Speech API if not present
// Add type definitions for Web Speech API if not present
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
