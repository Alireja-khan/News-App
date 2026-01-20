import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { newsApiResponse, NewsArticle } from "@/types/news";

const MONGO_URI = process.env.MONGODB_URL!;
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "e7073154b5144b5a812f137aa5d67180";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const country = url.searchParams.get("country") || "us";
    const category = url.searchParams.get("category") || "";
    const language = url.searchParams.get("language") || "en";
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const status = url.searchParams.get("status") || "published";

    console.log("Fetching news with params:", { country, category, language, from, to });

    const apiUrl = new URL("https://newsapi.org/v2/top-headlines");
    apiUrl.searchParams.append("country", country);
    if (category) apiUrl.searchParams.append("category", category);
    if (language) apiUrl.searchParams.append("language", language);
    if (from) apiUrl.searchParams.append("from", from);
    if (to) apiUrl.searchParams.append("to", to);
    apiUrl.searchParams.append("apiKey", NEWS_API_KEY);

    console.log("NewsAPI URL:", apiUrl.toString());

    const newsRes = await fetch(apiUrl.toString());
    
    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      console.error("NewsAPI error response:", errorText);
      throw new Error(`NewsAPI error: ${newsRes.status} ${newsRes.statusText}`);
    }

    const data: newsApiResponse = await newsRes.json();
    
    if (data.status !== "ok") {
      throw new Error(`NewsAPI returned status: ${data.status}`);
    }

    console.log(`Fetched ${data.articles.length} articles from NewsAPI`);

    let client;
    try {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      const db = client.db("newsApp");
      const collection = db.collection("news_articles");

      if (data.articles.length > 0) {
        const bulkOps = data.articles.map((article) => ({
          updateOne: {
            filter: { url: article.url },
            update: {
              $set: {
                ...article,
                category: category || "general",
                country,
                language,
                status,
                fetchedAt: new Date(),
              },
            },
            upsert: true,
          },
        }));

        console.log("Saving to MongoDB...");
        const result = await collection.bulkWrite(bulkOps);
        console.log(`MongoDB result: ${result.upsertedCount} upserted, ${result.modifiedCount} modified`);
      }

      const query: any = { country };
      if (category) query.category = category;
      if (status) query.status = status;

      console.log("Querying MongoDB with:", query);
      const filteredArticles = await collection
        .find(query)
        .sort({ publishedAt: -1 })
        .limit(50)
        .toArray();

      console.log(`Found ${filteredArticles.length} articles in MongoDB`);

      return NextResponse.json({ 
        status: "success", 
        articles: filteredArticles,
        count: filteredArticles.length 
      });

    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback to returning NewsAPI data if DB fails
      return NextResponse.json({ 
        status: "success", 
        articles: data.articles,
        count: data.articles.length,
        note: "Using NewsAPI data directly due to DB error"
      });
    } finally {
      if (client) {
        await client.close();
      }
    }

  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json({ 
      error: err.message,
      details: "Check server logs for more information"
    }, { status: 500 });
  }
}