import { pickVoice, nextState, speakableText } from '../assistantVoice.js';

// Test pickVoice function
describe('pickVoice', () => {
  test('should return en-AU-Standard-A for en-AU locale', () => {
    expect(pickVoice('en-AU')).toBe('en-AU-Standard-A');
  });

  test('should return en-US-Standard-A for en-US locale', () => {
    expect(pickVoice('en-US')).toBe('en-US-Standard-A');
  });

  test('should return en-GB-Standard-A for en-GB locale', () => {
    expect(pickVoice('en-GB')).toBe('en-GB-Standard-A');
  });

  test('should return en-US-Standard-A for unrecognized locale', () => {
    expect(pickVoice('fr-FR')).toBe('en-US-Standard-A');
    expect(pickVoice('de-DE')).toBe('en-US-Standard-A');
    expect(pickVoice('')).toBe('en-US-Standard-A');
  });
});

// Test nextState function
describe('nextState', () => {
  test('should transition from idle to listening on start action', () => {
    expect(nextState('idle', 'start')).toBe('listening');
  });

  test('should transition from listening to thinking on process action', () => {
    expect(nextState('listening', 'process')).toBe('thinking');
  });

  test('should transition from listening to idle on timeout action', () => {
    expect(nextState('listening', 'timeout')).toBe('idle');
  });

  test('should transition from thinking to speaking on respond action', () => {
    expect(nextState('thinking', 'respond')).toBe('speaking');
  });

  test('should transition from thinking to idle on error action', () => {
    expect(nextState('thinking', 'error')).toBe('idle');
  });

  test('should transition from speaking to idle on complete action', () => {
    expect(nextState('speaking', 'complete')).toBe('idle');
  });

  test('should remain in same state for unrecognized actions', () => {
    expect(nextState('idle', 'unknown')).toBe('idle');
    expect(nextState('listening', 'unknown')).toBe('listening');
    expect(nextState('thinking', 'unknown')).toBe('thinking');
    expect(nextState('speaking', 'unknown')).toBe('speaking');
  });

  test('should return current state for unknown states', () => {
    expect(nextState('unknown', 'start')).toBe('unknown');
  });
});

// Test speakableText function
describe('speakableText', () => {
  test('should return original text when under 1200 characters', () => {
    const shortText = 'A'.repeat(100);
    expect(speakableText(shortText)).toBe(shortText);
  });

  test('should truncate text to 1200 characters when over limit', () => {
    const longText = 'A'.repeat(1500);
    const result = speakableText(longText);
    expect(result).toHaveLength(1200);
    expect(result).toBe('A'.repeat(1200));
  });

  test('should handle exactly 1200 characters correctly', () => {
    const exactText = 'A'.repeat(1200);
    expect(speakableText(exactText)).toBe(exactText);
  });

  test('should handle empty string', () => {
    expect(speakableText('')).toBe('');
  });
});