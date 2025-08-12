import { describe, test, expect, beforeEach } from '@jest/globals';
import { EmotionalHyperpositionToken as EmotionalHyperposition } from './EmotionalHyperposition.js';

describe('EmotionalHyperposition', () => {
  let emotionalState;

  beforeEach(() => {
    emotionalState = new EmotionalHyperposition();
  });

  describe('constructor', () => {
    test('initializes with empty components', () => {
      expect(emotionalState.emotionalState.components.size).toBe(0);
      expect(emotionalState.emotionalState.interference).toBeNull();
      expect(emotionalState.emotionalState.dominantEmotion).toBeNull();
    });
  });

  describe('addEmotionalComponent', () => {
    test('adds emotional component with weight and phase', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      
      const components = emotionalState.emotionalState.components;
      expect(components.size).toBe(1);
      expect(components.has('joy')).toBe(true);
      
      const joy = components.get('joy');
      expect(joy.weight).toBe(0.8);
      expect(joy.phase).toBe(0);
      expect(joy.timestamp).toBeCloseTo(Date.now(), -2);
    });

    test('updates existing component', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      const firstTimestamp = emotionalState.emotionalState.components.get('joy').timestamp;
      
      setTimeout(() => {
        emotionalState.addEmotionalComponent('joy', 0.9, Math.PI/2);
        const joy = emotionalState.emotionalState.components.get('joy');
        
        expect(joy.weight).toBe(0.9);
        expect(joy.phase).toBe(Math.PI/2);
        expect(joy.timestamp).toBeGreaterThan(firstTimestamp);
      }, 10);
    });

    test('handles multiple emotions', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('sadness', 0.6, Math.PI);
      emotionalState.addEmotionalComponent('fear', 0.3, Math.PI/2);
      
      expect(emotionalState.emotionalState.components.size).toBe(3);
    });
  });

  describe('calculateInterference', () => {
    test('detects destructive interference between opposing emotions', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('sadness', 0.8, Math.PI);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference).toBeDefined();
      expect(interference.destructive).toContain('joy-sadness');
      expect(interference.totalAmplitude).toBeLessThan(1.6); // Less than sum due to cancellation
    });

    test('detects constructive interference between aligned emotions', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('excitement', 0.6, 0);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.constructive).toContain('joy-excitement');
      expect(interference.totalAmplitude).toBeGreaterThan(1.0);
    });

    test('identifies numbness from multiple opposing pairs', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('sadness', 0.8, Math.PI);
      emotionalState.addEmotionalComponent('anger', 0.7, 0);
      emotionalState.addEmotionalComponent('peace', 0.7, Math.PI);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.destructive.length).toBe(2);
      expect(interference.isNumb).toBe(true);
    });

    test('calculates phase differences correctly', () => {
      emotionalState.addEmotionalComponent('emotion1', 0.5, Math.PI/4);
      emotionalState.addEmotionalComponent('emotion2', 0.5, 3*Math.PI/4);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.constructive.length).toBe(1); // π/2 difference is constructive
    });
  });

  describe('getDominantEmotion', () => {
    test('returns emotion with highest weight', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('sadness', 0.3, Math.PI);
      emotionalState.addEmotionalComponent('fear', 0.5, Math.PI/2);
      
      const dominant = emotionalState.getDominantEmotion();
      expect(dominant.emotion).toBe('joy');
      expect(dominant.weight).toBe(0.8);
    });

    test('returns null for empty state', () => {
      const dominant = emotionalState.getDominantEmotion();
      expect(dominant).toBeNull();
    });

    test('accounts for interference in dominance', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('sadness', 0.8, Math.PI);
      
      emotionalState.calculateInterference();
      const dominant = emotionalState.getDominantEmotion();
      
      // After destructive interference, effective amplitude is reduced
      expect(dominant).toBeDefined();
      expect(emotionalState.emotionalState.interference.isNumb).toBe(false); // Not quite numb with just one pair
    });
  });

  describe('getEmotionalVector', () => {
    test('returns normalized emotional state vector', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('fear', 0.6, Math.PI/2);
      
      const vector = emotionalState.getEmotionalVector();
      
      expect(vector).toHaveProperty('joy');
      expect(vector).toHaveProperty('fear');
      expect(vector.joy).toBe(0.8);
      expect(vector.fear).toBe(0.6);
    });

    test('returns empty object for no emotions', () => {
      const vector = emotionalState.getEmotionalVector();
      expect(Object.keys(vector).length).toBe(0);
    });
  });

  describe('removeEmotionalComponent', () => {
    test('removes specified emotion', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('fear', 0.6, Math.PI/2);
      
      emotionalState.removeEmotionalComponent('joy');
      
      expect(emotionalState.emotionalState.components.has('joy')).toBe(false);
      expect(emotionalState.emotionalState.components.has('fear')).toBe(true);
      expect(emotionalState.emotionalState.components.size).toBe(1);
    });

    test('handles removing non-existent emotion', () => {
      expect(() => emotionalState.removeEmotionalComponent('nonexistent')).not.toThrow();
    });
  });

  describe('clearEmotionalState', () => {
    test('removes all emotional components', () => {
      emotionalState.addEmotionalComponent('joy', 0.8, 0);
      emotionalState.addEmotionalComponent('fear', 0.6, Math.PI/2);
      emotionalState.addEmotionalComponent('anger', 0.4, Math.PI);
      
      emotionalState.clearEmotionalState();
      
      expect(emotionalState.emotionalState.components.size).toBe(0);
      expect(emotionalState.emotionalState.interference).toBeNull();
      expect(emotionalState.emotionalState.dominantEmotion).toBeNull();
    });
  });

  describe('complex emotional scenarios', () => {
    test('models trauma response (opposing high-intensity emotions)', () => {
      // Intense fear and intense need for safety in opposition
      emotionalState.addEmotionalComponent('fear', 0.9, 0);
      emotionalState.addEmotionalComponent('safety-need', 0.9, Math.PI);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.destructive).toContain('fear-safety-need');
      expect(interference.totalAmplitude).toBeLessThan(1.0); // Significant cancellation
    });

    test('models emotional complexity with multiple phases', () => {
      // Complex emotional state with various phase relationships
      emotionalState.addEmotionalComponent('joy', 0.6, 0);
      emotionalState.addEmotionalComponent('nostalgia', 0.7, Math.PI/3);
      emotionalState.addEmotionalComponent('melancholy', 0.5, 2*Math.PI/3);
      emotionalState.addEmotionalComponent('hope', 0.8, Math.PI/6);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.constructive.length).toBeGreaterThan(0);
      expect(interference.totalAmplitude).toBeGreaterThan(2.0); // Some constructive interference
    });

    test('models gradual phase alignment (therapeutic process)', () => {
      // Start with opposing emotions
      emotionalState.addEmotionalComponent('trauma', 0.8, 0);
      emotionalState.addEmotionalComponent('healing', 0.8, Math.PI);
      
      emotionalState.calculateInterference();
      const initialInterference = emotionalState.emotionalState.interference.totalAmplitude;
      
      // Gradually align phases (therapy progress)
      emotionalState.addEmotionalComponent('healing', 0.8, Math.PI/2);
      emotionalState.calculateInterference();
      const midInterference = emotionalState.emotionalState.interference.totalAmplitude;
      
      emotionalState.addEmotionalComponent('healing', 0.8, Math.PI/4);
      emotionalState.calculateInterference();
      const finalInterference = emotionalState.emotionalState.interference.totalAmplitude;
      
      // Interference should decrease as phases align
      expect(midInterference).toBeGreaterThan(initialInterference);
      expect(finalInterference).toBeGreaterThan(midInterference);
    });
  });

  describe('edge cases', () => {
    test('handles zero weight emotions', () => {
      emotionalState.addEmotionalComponent('neutral', 0, 0);
      emotionalState.calculateInterference();
      
      expect(() => emotionalState.getDominantEmotion()).not.toThrow();
    });

    test('handles very small phase differences', () => {
      emotionalState.addEmotionalComponent('emotion1', 0.5, 0);
      emotionalState.addEmotionalComponent('emotion2', 0.5, 0.0001);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.constructive).toContain('emotion1-emotion2');
    });

    test('handles phase wrap-around', () => {
      emotionalState.addEmotionalComponent('emotion1', 0.5, 0.1);
      emotionalState.addEmotionalComponent('emotion2', 0.5, 2 * Math.PI - 0.1);
      
      emotionalState.calculateInterference();
      
      const interference = emotionalState.emotionalState.interference;
      expect(interference.constructive.length).toBe(1); // Should recognize as aligned
    });
  });
});