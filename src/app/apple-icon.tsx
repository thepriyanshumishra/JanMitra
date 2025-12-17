import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '20%', // Apple icons usually have squircle or rounded square look, but OS clips it. 
                    // We'll provide a full square/rounded bg.
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100px', height: '100px' }}
                >
                    <path
                        d="M12 2L3 7V12C3 17.5228 7.47715 22 12 22C16.5228 22 21 17.5228 21 12V7L12 2Z"
                        fill="white"
                    />
                    <path
                        d="M12 8V16M8 12H16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
