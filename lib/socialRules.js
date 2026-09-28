// Rules for social media posts, matching the backend's services/social_rules.py.
// This is a JavaScript implementation of the same rules for instant feedback.

export const CHANNEL_RULES = {
  x: {
    maxTextLength: 280,
    requiresMedia: false,
    maxMediaCount: 4,
    mediaTypes: ['image', 'video'],
    videoDurationRange: [0.5, 140], // in seconds
  },
  instagram: {
    maxTextLength: 2200,
    maxHashtags: 30,
    requiresMedia: true,
    maxMediaCount: 10,
    mediaTypes: ['image', 'video'],
    imageAspectRatios: [0.8, 1.91], // min, max
    videoDurationRange: [3, 900], // in seconds (3 seconds to 15 minutes)
  },
  facebook: {
    maxTextLength: 63206,
    requiresMedia: false,
    maxMediaCount: 10,
    mediaTypes: ['image', 'video'],
    videoDurationRange: [1, 14400], // in seconds (1 second to 4 hours)
  },
  linkedin: {
    maxTextLength: 3000,
    requiresMedia: false,
    maxMediaCount: 20,
    mediaTypes: ['image', 'video'],
    videoDurationRange: [3, 1800], // in seconds (3 seconds to 30 minutes)
  },
  email: {
    requiresMedia: false,
    maxMediaCount: 10, // Email allows up to 10 pictures
    mediaTypes: ['image', 'video'],
  },
};

export function textLength(channel, text, linkUrl) {
  let length = (text || '').trim().length;
  if (linkUrl && linkUrl.trim() && channel === 'x') {
    // X shortens links to 23 characters plus the line break
    length += 24; 
  }
  return length;
}

export const CHANNELS = ['linkedin','facebook','instagram','x','email'];

export function checkPost(channel, { text, linkUrl, media }) {
  const errors = [];
  
  // General rule: some text or media
  if ((!text || !text.trim()) && (!media || media.length === 0)) {
    errors.push({ level: 'error', message: 'Write something or add a picture or video.' });
  }
  
  const channelRules = CHANNEL_RULES[channel];
  if (!channelRules) {
    errors.push({ level: 'error', message: `Unknown channel: ${channel}` });
    return errors;
  }
  
  // Check text length
  let textLength = (text || '').trim().length;
  const originalTextLength = textLength;
  if (linkUrl && linkUrl.trim() && channel === 'x') {
    textLength += 24; // X shortens links to 24 characters (23 + line break)
  }
  
  if (textLength > channelRules.maxTextLength) {
    const limit = channelRules.maxTextLength;
    const length = textLength;
    let message = `Too long: ${length} characters`; 
    if (linkUrl && linkUrl.trim() && channel === 'x') {
      message += ` including the link; the limit is ${limit}.`;
    } else {
      message += `; the limit is ${limit}.`;
    }
    errors.push({
      level: 'error',
      message
    });
  }
  
  // Check for both images and videos (only allowed for some channels)
  const imageCount = (media || []).filter(item => item.kind === 'image').length;
  const videoCount = (media || []).filter(item => item.kind === 'video').length;
  
  // Error: more than one video (not for email)
  if (channel !== 'email' && videoCount > 1) {
    errors.push({
      level: 'error',
      message: 'Only one video per post.'
    });
  }
  
  // Error: images and a video together (not for email)
  if (channel !== 'email' && imageCount > 0 && videoCount > 0) {
    errors.push({
      level: 'error',
      message: 'Use pictures or one video, not both.'
    });
  }
  
  // Check media count first (this covers maxMediaCount)
  if (imageCount > channelRules.maxMediaCount) {
    const max = channelRules.maxMediaCount;
    const n = imageCount;
    let message = `Up to ${max} pictures; this post has ${n}.`;
    errors.push({
      level: 'error',
      message
    });
  }
  
  // Channel-specific checks for Instagram
  if (channel === 'instagram') {
    if (!media || media.length === 0) {
      errors.push({ level: 'error', message: 'Instagram needs a picture or a video.' });
    }
    if (media && media.length > 10 && imageCount <= channelRules.maxMediaCount) {
      errors.push({ level: 'error', message: 'Instagram allows up to 10 items in one post.' });
    }
    // Check hashtag limit (30 max)
    const hashtagCount = (text || '').match(/(?<!\w)#\w+/g)?.length || 0;
    if (hashtagCount > channelRules.maxHashtags) {
      errors.push({
        level: 'error',
        message: `Instagram allows ${channelRules.maxHashtags} hashtags; this has ${hashtagCount}.`
      });
    }
    
    // Instagram single video warning
    if (videoCount === 1 && imageCount === 0) {
      errors.push({
        level: 'warning',
        message: 'A single video is posted as a Reel.'
      });
    }
  }
  
  // Check specific rules for each media item
  if (media && media.length > 0) {
    let pictureNumber = 0;
    for (const item of media) {
      if (item.kind === 'image') {
        pictureNumber += 1;
        // Check image aspect ratio
        if (channelRules.imageAspectRatios) {
          const [minRatio, maxRatio] = channelRules.imageAspectRatios;
          const ratio = item.width && item.height ? item.width / item.height : null;
          if (ratio !== null && (ratio < minRatio || ratio > maxRatio)) {
            errors.push({
              level: 'warning',
              message: `Picture ${pictureNumber} is ${item.width}x${item.height}; Instagram wants a shape between 4:5 (portrait) and 1.91:1 (landscape) and may refuse it.`
            });
          }
        }
      } else if (item.kind === 'video') {
        // Check video duration
        if (channelRules.videoDurationRange) {
          const [minDur, maxDur] = channelRules.videoDurationRange;
          if (item.duration_seconds === undefined || item.duration_seconds === null) {
            errors.push({
              level: 'warning',
              message: 'The video length could not be read; the network will check it.'
            });
          } else if (item.duration_seconds < minDur || item.duration_seconds > maxDur) {
            const low = formatDuration(minDur);
            const high = formatDuration(maxDur);
            const actual = formatDuration(item.duration_seconds);
            errors.push({
              level: 'error',
              message: `Video must be ${low} to ${high} long; this one is ${actual}.`
            });
          }
        }
      }
    }
  }
  
  // Warning for LinkedIn when there is a link and media
  if (channel === 'linkedin' && linkUrl && linkUrl.trim() && media && media.length > 0) {
    errors.push({
      level: 'warning',
      message: 'With pictures or a video, LinkedIn shows the link in the text rather than as a preview card.'
    });
  }
  
  // Warning for Facebook when there is a link and media
  if (channel === 'facebook' && linkUrl && linkUrl.trim() && media && media.length > 0) {
    errors.push({
      level: 'warning',
      message: 'With pictures or a video, Facebook shows the link in the text rather than as a preview card.'
    });
  }
  
  // Warning for Instagram when there is a link
  if (channel === 'instagram' && linkUrl && linkUrl.trim()) {
    errors.push({
      level: 'warning',
      message: 'Links in Instagram captions are not clickable; the address is shown as text.'
    });
  }
  
  // Warning for email about video being sent as a link
  if (channel === 'email' && media && media.some(item => item.kind === 'video')) {
    errors.push({
      level: 'warning',
      message: 'Email cannot play video; customers get a Watch the video link.'
    });
  }
  
  // Warning for X with no text but media
  if (channel === 'x' && (!text || !text.trim()) && media && media.length > 0) {
    errors.push({
      level: 'warning',
      message: 'The post has no text, only media.'
    });
  }
  
  return errors;
}

function formatDuration(seconds) {
  const g = (n) => String(Number(Number(n).toPrecision(6)));
  if (seconds >= 3600 && seconds % 3600 === 0) return `${g(seconds / 3600)} hours`;
  if (seconds >= 60 && seconds % 60 === 0) return `${g(seconds / 60)} minutes`;
  if (seconds < 600) return `${g(seconds)} seconds`;
  if (seconds < 3600) return `${g(Math.round((seconds / 60) * 10) / 10)} minutes`;
  return `${g(Math.round((seconds / 3600) * 10) / 10)} hours`;
}
