import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/admin/', '/dashboard/officer/'],
        },
        sitemap: 'https://jan-mitra.vercel.app/sitemap.xml',
    }
}
