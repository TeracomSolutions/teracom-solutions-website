'use client';

import { checkPost, textLength, CHANNEL_RULES } from '@/lib/socialRules';

const TITLED = ['linkedin', 'facebook', 'instagram'];

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function ChannelPanel({ channel, label, accountName, mainText, override, onOverride, linkUrl, title, media }) {
  const usingMain = override === null || override === undefined;
  const cleanTitle = (title || '').trim();
  const composed = TITLED.includes(channel) && cleanTitle ? `${cleanTitle}\n\n${mainText || ''}` : (mainText || '');
  const text = usingMain ? composed : override;
  const link = (linkUrl || '').trim();
  const items = media || [];

  const charCount = textLength(channel, text, link);
  const limit = CHANNEL_RULES[channel]?.maxTextLength;
  const isOverLimit = channel !== 'email' && Boolean(limit) && charCount > limit;

  // What the network shows: X and Instagram carry the link in the text.
  let previewText = text;
  if (link && (channel === 'x' || channel === 'instagram') && !previewText.includes(link)) {
    previewText = `${previewText}\n\n${link}`.trim();
  }
  if (channel === 'x' && previewText.length > 280) {
    previewText = previewText.substring(0, 280);
  } else if ((channel === 'facebook' || channel === 'instagram') && previewText.length > 125) {
    previewText = `${previewText.substring(0, 125)}… more`;
  }

  const checks = checkPost(channel, { text, linkUrl: link, media: items });

  return (
    <div className="posting-channel">
      <h3>{label}</h3>
      
      <div className="admin-form">
        <label className="admin-check">
          <input
            type="checkbox"
            checked={usingMain}
            onChange={(e) => onOverride(e.target.checked ? null : composed)}
          />{' '}
          Use the main text
        </label>

        {!usingMain && (
          <div className="form-group">
            <textarea
              value={override || ''}
              onChange={(e) => onOverride(e.target.value)}
              rows={6}
              placeholder={`The text for ${label} only`}
            />
          </div>
        )}
        
        <div className="form-group">
          <div className="posting-preview">
            <div className="posting-preview-header">
              <div className="posting-preview-account">
                {accountName || label}
              </div>
            </div>
            
            <div className="posting-preview-text" style={{ whiteSpace: 'pre-wrap' }}>
              {previewText}
            </div>
            
            {items.length > 0 ? (
              <div className="posting-preview-media">
                {items.slice(0, 4).map((item, index) => (
                  <div key={index} className="posting-preview-media-item">
                    {item.kind === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.alt_text || ''} />
                    ) : (
                      <div className="posting-preview-video">
                        <video src={item.url} muted preload="metadata" />
                        <div className="posting-preview-video-play">▶</div>
                      </div>
                    )}
                  </div>
                ))}
                {items.length > 4 && (
                  <div className="posting-preview-media-item">
                    +{items.length - 4}
                  </div>
                )}
              </div>
            ) : link ? (
              <div className="posting-preview-link">
                {hostOf(link)}
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="form-group">
          <div className="posting-checks">
            {checks.length > 0 ? (
              checks.map((check, index) => (
                <div key={index} className={`check-item ${check.level}`}>
                  {check.level === 'error' ? '✕' : '!'} {check.message}
                </div>
              ))
            ) : (
              <div className="check-item ready">
                ✓ Ready for {label}
              </div>
            )}
          </div>
        </div>
        
        {channel !== 'email' && (
          <div className={isOverLimit ? 'form-error' : 'admin-muted'}>
            {charCount} of {limit} characters
          </div>
        )}
      </div>
    </div>
  );
}