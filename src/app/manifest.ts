import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Jan-Mitra | AI Governance Layer',
        short_name: 'Jan-Mitra',
        description: 'Intelligence & Accountability Layer for Public Grievances',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
            {
                src: '/icon',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/apple-icon',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
