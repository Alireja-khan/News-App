// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["example.com", "cdn.some-news-site.com", "images.unsplash.com"], // add allowed domains
  },
};

module.exports = nextConfig;
