// This file holds the Assistant's attachments: files dragged onto it, pasted into the box (a screenshot, say) or chosen with the Attach button.

import { useRef, useState } from 'react';
import { MAX_FILES } from './attachments.js';
import { readAttachment } from './readAttachment.js';

export function useAttachments({ onError } = {}) {
  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);

  // Ref to track drag depth
  const dragDepthRef = useRef(0);

  // Update ref when state changes
  itemsRef.current = items;

  function addFiles(list) {
    if (!list || list.length === 0) return;

    setReading(true);

    const problems = [];
    const addedInThisDrop = 0;

    const processFile = async (file) => {
      // Check if we've reached the maximum
      if (itemsRef.current.length + addedInThisDrop >= MAX_FILES) {
        problems.push(`Only ${MAX_FILES} files can go with one message.`);
        return null;
      }

      try {
        const result = await readAttachment(file);
        // Increment the counter for successfully processed files
        addedInThisDrop++;
        return result;
      } catch (error) {
        problems.push(error.message);
        return null;
      }
    };

    // Process files sequentially
    const processAll = async () => {
      let results = [];

      for (let i = 0; i < list.length; i++) {
        const result = await processFile(list[i]);
        if (result) {
          results.push(result);
        }
      }

      // Update state with new items
      setItems(prev => [...prev, ...results]);

      // Handle problems
      if (problems.length > 0 && onError) {
        onError(problems.join(' '));
      }

      setReading(false);
    };

    processAll();
  }

  function remove(id) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function clear() {
    setItems([]);
  }

  function restore(list) {
    setItems(list);
  }

  const dropProps = {
    onDragEnter(event) {
      if (!event.dataTransfer.types.includes('Files')) return;

      event.preventDefault();
      dragDepthRef.current++;
      setDragging(true);
    },

    onDragOver(event) {
      if (!event.dataTransfer.types.includes('Files')) return;

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },

    onDragLeave(event) {
      if (!event.dataTransfer.types.includes('Files')) return;

      event.preventDefault();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) {
        setDragging(false);
      }
    },

    onDrop(event) {
      if (!event.dataTransfer.types.includes('Files')) return;

      event.preventDefault();
      dragDepthRef.current = 0;
      setDragging(false);

      addFiles(event.dataTransfer.files);
    }
  };

  function onPaste(event) {
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
      event.preventDefault();
      addFiles(event.clipboardData.files);
    }
  }

  return {
    items,
    dragging,
    reading,
    addFiles,
    dropProps,
    onPaste,
    remove,
    clear,
    restore
  };
}