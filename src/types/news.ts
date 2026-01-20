export interface NewsSource {
    id: string | null;
    name: string;
}

export interface NewsArticle {
    source: NewsSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}


export interface newsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}



export interface newsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export interface NewsSourceFull {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface newsSourceApiResponse {
    status: string;
    sources: NewsSourceFull[];
}