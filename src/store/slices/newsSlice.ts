import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  sentiment: number;
  trust: number;
  impactOnPrice: number;
  timeHorizon: string;
  confidence: number;
  category: string;
  url?: string;
  summary?: string;
}

interface NewsSentiment {
  symbol: string;
  overallSentiment: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  lastUpdated: string;
}

interface NewsState {
  articles: NewsItem[];
  sentiment: NewsSentiment | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    timeRange: string;
    sentiment: string;
  };
  selectedArticle: NewsItem | null;
}

const initialState: NewsState = {
  articles: [],
  sentiment: null,
  loading: false,
  error: null,
  filters: {
    category: 'All',
    timeRange: '24h',
    sentiment: 'All'
  },
  selectedArticle: null
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateNews: (state, action: PayloadAction<NewsItem[]>) => {
      state.articles = action.payload;
    },
    addNews: (state, action: PayloadAction<NewsItem>) => {
      state.articles.unshift(action.payload);
      // Keep only last 100 articles
      if (state.articles.length > 100) {
        state.articles = state.articles.slice(0, 100);
      }
    },
    updateNewsSentiment: (state, action: PayloadAction<NewsSentiment>) => {
      state.sentiment = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<NewsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedArticle: (state, action: PayloadAction<NewsItem | null>) => {
      state.selectedArticle = action.payload;
    },
    clearNews: (state) => {
      state.articles = [];
      state.sentiment = null;
    }
  }
});

export const {
  setLoading,
  setError,
  updateNews,
  addNews,
  updateNewsSentiment,
  setFilters,
  setSelectedArticle,
  clearNews
} = newsSlice.actions;

export default newsSlice.reducer;
