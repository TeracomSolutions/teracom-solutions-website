// This file reads one dragged, pasted or chosen file for the console Assistant.

import { MAX_FILE_BYTES, MAX_IMAGE_EDGE, MAX_TEXT_CHARS, fileKind, humanSize, imageTypeOf } from './attachments.js';

let counter = 0;

export async function readAttachment(file) {
  // Get kind of file
  const kind = fileKind(file.name, file.type);
  if (kind === null) {
    throw new Error(`${file.name}: this kind of file is not supported yet. Pictures, PDFs, spreadsheets (.xlsx) and text files such as txt, csv, json and log work.`);
  }

  // Generate ID
  counter++;
  const id = 'a' + counter;

  // Prepare result object
  const result = { id, kind, name: file.name, size: file.size };

  // Handle text files
  if (kind === 'text') {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error(`${file.name} is empty.`);
    }

    if (text.length > MAX_TEXT_CHARS) {
      result.text = text.substring(0, MAX_TEXT_CHARS) + String.fromCharCode(10) + '[The rest of the file is not shown.]';
    } else {
      result.text = text;
    }

    result.mediaType = 'text/plain';
  }
  // Handle image files
  else if (kind === 'image') {
    // Determine media type
    result.mediaType = imageTypeOf(file.name, file.type);

    // Check if we can send the image as-is (under size limit or it's a gif)
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    // as-is pictures must fit too
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`${file.name} is ${humanSize(file.size)}; the limit is ${humanSize(MAX_FILE_BYTES)}.`);
    }
    if (file.size <= 600 * 1024 || isGif) {
      // Read as base64 directly
      try {
        const reader = new FileReader();
        const readPromise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('The file could not be read.'));
        });
        reader.readAsDataURL(file);
        const dataUrl = await readPromise;
        result.data = dataUrl.substring(dataUrl.indexOf(',') + 1);
      } catch (e) {
        throw new Error(`${file.name} could not be opened as a picture.`);
      }
    } else {
      // Need to shrink the image
      try {
        const imageBitmap = await createImageBitmap(file);

        // Calculate new dimensions
        let { width, height } = imageBitmap;
        if (width > height && width > MAX_IMAGE_EDGE) {
          height = Math.round(height * MAX_IMAGE_EDGE / width);
          width = MAX_IMAGE_EDGE;
        } else if (height > MAX_IMAGE_EDGE) {
          width = Math.round(width * MAX_IMAGE_EDGE / height);
          height = MAX_IMAGE_EDGE;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Fill with white background
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Draw image
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        // Convert to blob with JPEG at quality 0.85
        let blob;
        await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.85);
        }).then(b => { blob = b; });

        // If blob is still too big, try with quality 0.6
        if (blob && blob.size > MAX_FILE_BYTES) {
          await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.6);
          }).then(b => { blob = b; });
        }

        // If still too big, reject
        if (!blob || blob.size > MAX_FILE_BYTES) {
          throw new Error(`${file.name} is too big to send, even shrunk.`);
        }

        // Read as base64
        const reader = new FileReader();
        const readPromise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('The file could not be read.'));
        });
        reader.readAsDataURL(blob);
        const dataUrl = await readPromise;
        result.data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        result.size = blob.size;
        result.mediaType = 'image/jpeg';
      } catch (e) {
        // keep the too-big message
        if (e.message.endsWith(' even shrunk.')) {
          throw e;
        }
        throw new Error(`${file.name} could not be opened as a picture.`);
      }
    }

    // Add preview URL
    result.preview = URL.createObjectURL(file);
  }
  // Handle PDF and sheet files
  else if (kind === 'pdf' || kind === 'sheet') {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`${file.name} is ${humanSize(file.size)}; the limit is ${humanSize(MAX_FILE_BYTES)}.`);
    }

    // Read as base64
    try {
      const reader = new FileReader();
      const readPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('The file could not be read.'));
      });
      reader.readAsDataURL(file);
      const dataUrl = await readPromise;
      result.data = dataUrl.substring(dataUrl.indexOf(',') + 1);
    } catch (e) {
      throw new Error('The file could not be read.');
    }

    // Set media type
    if (kind === 'pdf') {
      result.mediaType = 'application/pdf';
    } else {
      result.mediaType = file.type;
    }
  }

  return result;
}