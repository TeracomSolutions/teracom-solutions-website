'use client';

import { checkPost, textLength, CHANNEL_RULES } from '@/lib/socialRules';

const TITLED = ['linkedin', 'facebook', 'instagram'];

export default function ChannelPanel({ channel, label, accountName, mainText, override, onOverride, linkUrl, title, media }) {
  const usingMain = override === null || override === undefined;
  const cleanTitle = (title || '').trim();
  const composed = TITLED.includes(channel) && cleanTitle ? `${cleanTitle}\n\n${mainText || ''}` : (mainText || '');
  const text = usingMain ? composed : override;
  const link = (linkUrl || '').trim();

  const charCount = textLength(channel, text, link);
  const limit = CHANNEL_RULES[channel]?.maxTextLength;
  const isOverLimit = channel !== 'email' && Boolean(limit) && charCount > limit;

  const checks = checkPost(channel, { text, linkUrl: link, media });

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