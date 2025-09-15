import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scanpay.cz';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: `${baseUrl}`,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 