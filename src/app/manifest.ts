import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'JAN-MITRA | AI Governance Layer',
        short_name: 'JAN-MITRA',
        description: 'Next-Gen Intelligence & Accountability Layer for Public Grievances.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#7c3aed',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
