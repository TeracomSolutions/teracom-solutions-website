export const ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime';

export function kindOf(file) {
  return (file.type || '').startsWith('video/') ? 'video' : 'image';
}

export function sizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return mb.endsWith('.0') ? mb.slice(0, -2) + ' MB' : mb + ' MB';
}

export function durationLabel(seconds) {
  if (seconds === null || seconds === undefined) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export function canAdd(existing, incoming) {
  // Count existing media
  const existingImages = existing.filter(item => item.kind === 'image').length;
  const existingVideos = existing.filter(item => item.kind === 'video').length;
  
  // Check if incoming is video or image
  const incomingIsVideo = kindOf(incoming) === 'video';
  
  // Check type support
  if (!ACCEPT.split(',').includes(incoming.type)) {
    return 'Pictures must be JPEG, PNG or WebP; videos MP4 or MOV.';
  }
  
  // Check max limits
  if (incomingIsVideo && existingImages > 0) {
    return 'Use pictures or one video, not both.';
  }
  
  if (!incomingIsVideo && existingImages >= 20) {
    return 'Up to 20 pictures in one post.';
  }
  
  if (incomingIsVideo && existingVideos >= 1) {
    return 'Use pictures or one video, not both.';
  }

  if (!incomingIsVideo && existingVideos > 0) {
    return 'Use pictures or one video, not both.';
  }
  
  return '';
}

export function tooBig(file, maxImage, maxVideo) {
  const isVideo = kindOf(file) === 'video';
  const maxSize = isVideo ? maxVideo : maxImage;
  
  if (file.size > maxSize) {
    return `Too big: the limit is ${sizeLabel(maxSize)} for a ${isVideo ? 'video' : 'picture'}.`;
  }
  
  return '';
}