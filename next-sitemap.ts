/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  additionalSitemaps: [
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/custom-sitemap.xml`,
  ],
};
