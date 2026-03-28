import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Protect the admin dashboard from being indexed 
    },
    sitemap: 'https://ipl.devtree.site/sitemap.xml',
  };
}
