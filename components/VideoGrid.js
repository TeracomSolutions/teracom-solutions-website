import Link from 'next/link';
import { channelUrl, videos } from '@/lib/resourceVideos';

export default function VideoGrid() {
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

  return (
    <div className="video-grid">
      {videos.map((v) => (
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
  );
}
