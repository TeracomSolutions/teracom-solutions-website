"use client";

import { Fragment, useEffect, useState } from 'react';
import { displayText, visiblePart, hostOf, shortLink, mediaLayout, initials } from '@/lib/postPreview';

export default function PostPreview({ channel, accountName, title, text, linkUrl, media }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [channel]);

  const full = displayText(channel, text || '', linkUrl || '');
  const { shown, more } = visiblePart(channel, full, expanded);
  
  const name = accountName || (channel === 'linkedin' ? 'LinkedIn' : 
                                 channel === 'facebook' ? 'Facebook' : 
                                 channel === 'instagram' ? 'Instagram' : 
                                 channel === 'x' ? 'X' : 
                                 'Customer email');

  const moreWords = channel === 'linkedin' ? '…see more' : channel === 'facebook' ? 'See more' : channel === 'instagram' ? 'more' : 'see more';
  const seeMore = (
    <button type="button" className="pv-more" onClick={() => setExpanded(true)}>{moreWords}</button>
  );

  // Media block rendering
  const renderMediaBlock = () => {
    if (!media || media.length === 0) return null;
    
    const mediaItems = media.slice(0, 4); // Only show first 4 items
    const mediaElements = mediaItems.map((item, index) => {
      if (item.kind === 'image') {
        return (
          <div key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt_text || ''} />
          </div>
        );
      } else if (item.kind === 'video') {
        return (
          <div key={item.id} className="pv-video">
            <video src={item.url} muted preload="metadata" />
            <span className="pv-play">▶</span>
          </div>
        );
      }
      return null;
    });

    // Add extra count if there are more than 4 items
    if (media.length > 4) {
      mediaElements[3] = (
        <div key="extra" className="pv-media-item pv-media-item-extra">
          {mediaElements[3]}
          <span className="pv-extra">+{media.length - 4}</span>
        </div>
      );
    }

    return (
      <div className={`pv-media pv-media-${mediaLayout(media.length)}`}>
        {mediaElements}
      </div>
    );
  };

  // Link card rendering
  const renderLinkCard = () => {
    if (!linkUrl || media?.length > 0) return null;
    
    return (
      <div className="pv-link">
        <div className="pv-link-host">{hostOf(linkUrl)}</div>
        <div className="pv-link-title">{title || hostOf(linkUrl)}</div>
      </div>
    );
  };

  // Avatar rendering
  const renderAvatar = () => {
    return (
      <span className="pv-avatar">{initials(name)}</span>
    );
  };

  // Channel-specific rendering
  switch (channel) {
    case 'linkedin':
      return (
        <div className={`pv pv-${channel}`}>
          <div className="pv-head">
            {renderAvatar()}
            <div>
              <div className="pv-name">{name}</div>
              <div className="pv-sub">Now · 🌐</div>
            </div>
          </div>
          <div className="pv-text">{shown}{more && <> {seeMore}</>}</div>
          {renderMediaBlock() || renderLinkCard()}
          <div className="pv-actions">Like · Comment · Repost · Send</div>
        </div>
      );
    
    case 'facebook':
      return (
        <div className={`pv pv-${channel}`}>
          <div className="pv-head">
            {renderAvatar()}
            <div>
              <div className="pv-name">{name}</div>
              <div className="pv-sub">Just now · 🌐</div>
            </div>
          </div>
          <div className="pv-text">{shown}{more && <> {seeMore}</>}</div>
          {renderMediaBlock() || renderLinkCard()}
          <div className="pv-actions">Like · Comment · Share</div>
        </div>
      );
    
    case 'instagram':
      return (
        <div className={`pv pv-${channel}`}>
          <div className="pv-head">
            {renderAvatar()}
            <div className="pv-name">{name}</div>
          </div>
          
          {media && media.length > 0 ? (
            <div className="pv-ig-media">
              {media[0].kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media[0].url} alt={media[0].alt_text || ''} />
              ) : (
                <div className="pv-video">
                  <video src={media[0].url} muted preload="metadata" />
                  <span className="pv-play">▶</span>
                </div>
              )}
              
              {media.length > 1 && (
                <div className="pv-dots">
                  {Array.from({ length: media.length }, (_, i) => (
                    <span key={i} className={i === 0 ? 'on' : ''} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="pv-ig-empty">Instagram needs a picture or a video</div>
          )}
          
          <div className="pv-actions">♡ 💬 ➤</div>
          <div className="pv-text">
            <strong>{name}</strong> {shown}{more && <> … {seeMore}</>}  
          </div>
        </div>
      );
    
    case 'x':
      return (
        <div className={`pv pv-${channel}`}>
          <div className="pv-head">
            {renderAvatar()}
            <div>
              <span className="pv-name">{name}</span> 
              <span className="pv-sub">· now</span>
            </div>
          </div>
          <div className="pv-text">
            {linkUrl ? full.split(linkUrl).map((part, i, parts) => (
              <Fragment key={i}>
                {part}
                {i < parts.length - 1 && <span className="pv-linktext">{shortLink(linkUrl)}</span>}
              </Fragment>
            )) : full}
          </div>
          {renderMediaBlock()}
          <div className="pv-actions">💬 🔁 ♡ 📊</div>
        </div>
      );
    
    case 'email':
      return (
        <div className={`pv pv-${channel}`}>
          <div className="pv-mail-head">
            <div><strong>Teracom Solutions</strong></div>
            <div className="pv-sub">Subject: {title}</div>
          </div>
          <div className="pv-mail-body">
            {(text || '').split('\n\n').filter((p) => p.trim()).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            
            {media && media.length > 0 && media.map(item => {
              if (item.kind === 'image') {
                // eslint-disable-next-line @next/next/no-img-element
                return <img key={item.id} src={item.url} alt={item.alt_text || ''} />;
              } else if (item.kind === 'video') {
                return (
                  <p key={item.id}><a href={item.url}>Watch the video</a></p>
                );
              }
              return null;
            })}
            
            {linkUrl && (
              <p><a href={linkUrl}>{linkUrl}</a></p>
            )}
            
            <p className="pv-sub">You are receiving this because you agreed to hear from Teracom Solutions. Stop these emails</p>
          </div>
        </div>
      );
    
    default:
      return null;
  }
}