"use client";

import { useEffect, useState } from "react";
import NewsList from "./components/NewsList";
import NewsFilters from "./components/NewsFilters";
import { NewsArticle } from "@/types/news";

export default function Home() {
  const [country, setCountry] = useState("us");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("en");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        country,
        category,
        language,
        from,
        to,
        status: "published",
      });

      const res = await fetch(`/api/news?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setArticles(data.articles || []);
      
      if (!data.articles || data.articles.length === 0) {
        setError("No articles found. Try different filters.");
      }
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(`Failed to load news: ${err.message}`);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [country, category, language, from, to]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Top Headlines</h1>

      <NewsFilters
        country={country} setCountry={setCountry}
        category={category} setCategory={setCategory}
        language={language} setLanguage={setLanguage}
        from={from} setFrom={setFrom}
        to={to} setTo={setTo}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchNews}
            className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-center">
          <p>Loading news...</p>
          <div className="mt-2 h-1 w-full bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <NewsList articles={articles} />
      )}
    </main>
  );
}