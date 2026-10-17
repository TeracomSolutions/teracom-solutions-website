// This file holds the pure helpers for files dragged onto the Assistant.
// It is used by components/AdminAssistantChat.js and the backend.

export const MAX_FILES = 4;
export const MAX_FILE_BYTES = 2.8 * 1024 * 1024;
export const MAX_SEND_CHARS = 4000000;
export const MAX_TEXT_CHARS = 50000;
export const MAX_IMAGE_EDGE = 1600;

const TEXT_EXTENSIONS = [
  'txt',
  'md',
  'csv',
  'tsv',
  'json',
  'log',
  'xml',
  'html',
  'htm',
  'css',
  'js',
  'mjs',
  'ts',
  'tsx',
  'jsx',
  'py',
  'sh',
  'yaml',
  'yml',
  'ini',
  'conf',
  'sql',
  'eml'
];

export const ACCEPT = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  '.xlsx',
  ...TEXT_EXTENSIONS.map(ext => `.${ext}`)
].join(',');

export function extensionOf(name) {
  if (!name || typeof name !== 'string') return '';
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return '';
  return name.substring(lastDot + 1).toLowerCase();
}

// extension only when there is no type
export function imageTypeOf(name, type = '') {
  if (type === 'image/png' ||
    type === 'image/jpeg' ||
    type === 'image/webp' ||
    type === 'image/gif'
  ) return type;

  if (type !== '') return '';

  const ext = extensionOf(name);
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';

  return '';
}

export function fileKind(name, type = '') {
  if (imageTypeOf(name, type)) return 'image';
  if (type === 'application/pdf' || extensionOf(name) === 'pdf') return 'pdf';
  if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || extensionOf(name) === 'xlsx') return 'sheet';
  if (
    type.startsWith('text/') ||
    type === 'application/json' ||
    type === 'application/xml' ||
    TEXT_EXTENSIONS.includes(extensionOf(name))
  ) return 'text';
  return null;
}

export function humanSize(bytes) {
  if (typeof bytes !== 'number' || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function weigh(attachment) {
  const dataLength = attachment.data ? attachment.data.length : 0;
  const textLength = attachment.text ? attachment.text.length : 0;
  return dataLength + textLength;
}

export function forSend(messages, limit = MAX_SEND_CHARS) {
  // Create a new array to avoid mutating the original
  const result = [];
  let budget = limit;

  // Process messages from newest to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const newMsg = { role: msg.role, content: msg.content };

    if (msg.attachments && msg.attachments.length > 0) {
      const keptAttachments = [];
      let noteAdded = false;

      // Process attachments from newest to oldest
      for (let j = msg.attachments.length - 1; j >= 0; j--) {
        const att = msg.attachments[j];
        const cost = weigh(att);

        if (cost <= budget) {
          budget -= cost;
          keptAttachments.unshift({
            kind: att.kind || '',
            name: att.name || '',
            mediaType: att.mediaType || '',
            data: att.data || '',
            text: att.text || ''
          }); // Keep in original order
        } else {
          // Add note about left out attachment
          if (!noteAdded) {
            newMsg.content += ' ';
            noteAdded = true;
          }
          newMsg.content += `[An attachment, ${att.name || 'unnamed'}, from earlier in this conversation is no longer included.]`;
        }
      }

      if (keptAttachments.length > 0) {
        newMsg.attachments = keptAttachments;
      }
    }

    result.unshift(newMsg); // Keep original order
  }

  return result;
}

export function toBackendMessage(message) {
  const result = { role: message.role, content: message.content };

  if (message.attachments && message.attachments.length > 0) {
    result.attachments = message.attachments.map(att => ({
      kind: att.kind || '',
      name: att.name || '',
      media_type: att.mediaType || '',
      data: att.data || '',
      text: att.text || ''
    }));
  }

  return result;
}