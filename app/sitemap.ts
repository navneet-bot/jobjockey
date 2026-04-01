import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

    const baseUrl = "https://jobjockey.in";

    return [

        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },

        {
            url: `${baseUrl}/jobs`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },

        {
            url: `${baseUrl}/internships`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9
        },

        {
            url: `${baseUrl}/login`,
            lastModified: new Date()
        },

        {
            url: `${baseUrl}/register`,
            lastModified: new Date()
        }

    ];
}