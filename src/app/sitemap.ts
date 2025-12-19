import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://jan-mitra.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://jan-mitra.vercel.app/auth/login',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://jan-mitra.vercel.app/auth/signup',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Add more public routes here
    ]
}
