// ElevenLabsAudioNative.tsx

'use client';
import { useEffect } from 'react';

export type ElevenLabsProps = {
    size?: 'small' | 'large';
    children?: React.ReactNode;
};

export const ElevenLabsAudioNative = ({
    children,
}: ElevenLabsProps) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = 'https://elevenlabs.io/player/audioNativeHelper.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
        document.body.removeChild(script);
        };
    }, []);

    return (
      <div
        id="elevenlabs-audionative-widget"
        data-height="90"
        data-width="100%"
        data-frameborder="no"
        data-scrolling="no"
        data-publicuserid="2b5cf394afcaf568d07f6b4b3a3ccb644f3c70cca3b25386a620debdb45acbc5"
        data-playerurl="https://elevenlabs.io/player/index.html"
      >
        {children ? children : 'Elevenlabs AudioNative Player'}
      </div>
    );
};

export default ElevenLabsAudioNative;
