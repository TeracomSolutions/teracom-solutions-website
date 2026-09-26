// Helper function to pick voice based on locale preference
export function pickVoice(locale) {
  // en-AU voices are preferred over others
  if (locale === 'en-AU') {
    return 'en-AU-Standard-A';
  } else if (locale === 'en-US') {
    return 'en-US-Standard-A';
  } else if (locale === 'en-GB') {
    return 'en-GB-Standard-A';
  }
  
  // Fallback to en-US if locale not recognized
  return 'en-US-Standard-A';
}

// Helper function to determine next state based on current state and action
export function nextState(currentState, action) {
  switch (currentState) {
    case 'idle':
      if (action === 'start') {
        return 'listening';
      }
      return currentState;
    
    case 'listening':
      if (action === 'process') {
        return 'thinking';
      } else if (action === 'timeout') {
        return 'idle';
      }
      return currentState;
      
    case 'thinking':
      if (action === 'respond') {
        return 'speaking';
      } else if (action === 'error') {
        return 'idle';
      }
      return currentState;
      
    case 'speaking':
      if (action === 'complete') {
        return 'idle';
      }
      return currentState;
      
    default:
      return currentState;
  }
}

// Helper function to get speakable text with character limit
export function speakableText(text) {
  // If text is longer than 1200 characters, truncate it
  if (text.length > 1200) {
    return text.substring(0, 1200);
  }
  
  return text;
}