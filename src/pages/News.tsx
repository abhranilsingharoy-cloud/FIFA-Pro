import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Fetching Google News RSS via rss2json API to bypass CORS
        const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en');
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=`);
        const data = await res.json();
        
        if (data.items) {
          const formattedNews = data.items.map((item: any) => ({
            title: item.title.split(' - ')[0], // Google News appends the source with ' - '
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            source: item.title.split(' - ').pop() || 'Google News',
          }));
          setNews(formattedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="page-container">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient"
        style={{
          borderRadius: 20, padding: '40px 40px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="badge badge-live"><span className="live-dot" style={{ marginRight: 5 }} /> LIVE FEED</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, lineHeight: 1, marginBottom: 8, color: 'white' }}>
            Latest <span className="gradient-text">Headlines</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
            Stay up to date with the latest breaking news, official announcements, and rumors surrounding the 2026 World Cup.
          </p>
        </div>
        <Newspaper size={120} style={{ color: 'rgba(255,215,0,0.1)', position: 'absolute', right: 40 }} />
      </motion.div>

      {/* ─── NEWS GRID ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ height: 160, display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5, animation: 'pulse 1.5s infinite' }}>
              <div style={{ height: 20, width: '80%', background: 'var(--border-subtle)', borderRadius: 4 }} />
              <div style={{ height: 20, width: '60%', background: 'var(--border-subtle)', borderRadius: 4 }} />
              <div style={{ marginTop: 'auto', height: 16, width: '30%', background: 'var(--surface-card)', borderRadius: 4 }} />
            </div>
          ))
        ) : news.length > 0 ? (
          news.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ 
                display: 'flex', flexDirection: 'column', padding: '24px', 
                textDecoration: 'none', transition: 'all 0.2s ease', border: '1px solid var(--border-subtle)' 
              }}
              whileHover={{ scale: 1.02, borderColor: 'var(--brand-gold)' }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.4 }}>
                {item.title}
              </h3>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--brand-gold)', fontWeight: 600 }}>{item.source}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {item.pubDate}
                  </div>
                </div>
                <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </motion.a>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Unable to load news feed at this time.
          </div>
        )}
      </div>
    </div>
  );
}
