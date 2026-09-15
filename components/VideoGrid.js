'use client';
import Link from 'next/link';
import { useState } from 'react';
import { channelUrl, videos } from '@/lib/resourceVideos';
import { categories } from '@/lib/categories';
import CategoryIcon from './CategoryIcon';

export default function VideoGrid() {
  const [activeTab, setActiveTab] = useState('all');

  if (videos.length === 0) {
    return (
      <div className="form-note-banner" role="status">
        Product videos are being added here.
        {channelUrl ? (
          <>
            {' '}
            In the meantime, browse our{' '}
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
              YouTube channel
            </a>
            .
          </>
        ) : (
          <>
            {' '}
            In the meantime, <Link href="/#contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>contact us</Link> for the video you need.
          </>
        )}
      </div>
    );
  }

  // Get unique category slugs from videos, maintaining order from categories.js
  const videoCategories = [...new Set(videos.map(v => v.category))];
  
  // Build tabs list with titles and icons from categories.js, preserving order
  const tabs = [
    { slug: 'all', title: 'All' },
    ...videoCategories
      .map(slug => {
        const category = categories.find(c => c.slug === slug);
        if (!category) return null;

        return {
          slug,
          title: category.title,
          icon: slug,
        };
      })
      .filter(Boolean)
  ];

  // Filter videos based on selected tab
  const filteredVideos = activeTab === 'all' 
    ? videos 
    : videos.filter(v => v.category === activeTab);

  return (
    <>
      {/* Tabs */}
      <div className="brand-tabs" role="tablist" aria-label="Video categories">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            className={`brand-tab ${activeTab === tab.slug ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.slug)}
            role="tab"
            aria-selected={activeTab === tab.slug}
          >
            {tab.icon && (
              <CategoryIcon slug={tab.icon} />
            )}
            {tab.title}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {filteredVideos.map((v) => (
          <article className="video-card" key={v.youtubeId}>
            <div className="video-embed">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3>{v.title}</h3>
            {v.description && <p>{v.description}</p>}
          </article>
        ))}
      </div>
    </>
  );
}
