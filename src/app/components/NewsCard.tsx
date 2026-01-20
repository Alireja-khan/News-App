import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NewsArticle } from "@/types/news";
import Image from "next/image";


interface NewsCardProps {
    article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-lg transition h-full flex flex-col">
                {article.urlToImage && (
                    <CardHeader className="p-0 relative h-48 w-full">
                        <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            className="object-cover rounded-t-lg"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </CardHeader>
                )}

                <CardContent className="p-4 flex flex-col flex-grow justify-between space-y-3">
                    <Badge variant="secondary" className="self-start">
                        Top News
                    </Badge>
                    <h3 className="font-semibold text-lg line-clamp-2">
                        {article.title}
                    </h3>
                    {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {article.description}
                        </p>
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground mt-auto">
                        <span>{article.source.name}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </a>
    )
}