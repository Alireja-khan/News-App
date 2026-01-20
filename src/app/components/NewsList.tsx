import { NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";

interface NewsListProps {
  articles: NewsArticle[];
}

export default function NewsList({ articles }: NewsListProps) {
  if (!articles.length) {
    return <p className="mt-6 text-center text-muted-foreground">No news found</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
}
