import { describe, test, expect, beforeEach } from '@jest/globals';
import { HyperpositionToken } from './HyperpositionToken.js';

describe('HyperpositionToken', () => {
  let token;

  beforeEach(() => {
    token = new HyperpositionToken('test');
  });

  describe('constructor', () => {
    test('creates token with correct properties', () => {
      expect(token.content).toBe('test');
      expect(token.timestamp).toBeCloseTo(Date.now(), -2);
      expect(token.phase).toBe(0);
      expect(token.energy).toBe(1.0);
    });

    test('initializes 8 dimensions with values between 0 and 1', () => {
      const dimensions = Object.keys(token.dimensions);
      expect(dimensions).toHaveLength(8);
      expect(dimensions).toContain('semantic');
      expect(dimensions).toContain('temporal');
      expect(dimensions).toContain('causal');
      expect(dimensions).toContain('emotional');
      expect(dimensions).toContain('relational');
      expect(dimensions).toContain('probability');
      expect(dimensions).toContain('energy');
      expect(dimensions).toContain('coherence');

      Object.values(token.dimensions).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });

    test('dimensions are normalized to unit length', () => {
      const sumOfSquares = Object.values(token.dimensions)
        .reduce((sum, val) => sum + val * val, 0);
      expect(sumOfSquares).toBeCloseTo(1.0, 5);
    });
  });

  describe('collapse', () => {
    test('returns collapsed state based on context', () => {
      const context = { focus: 'semantic' };
      const collapsed = token.collapse(context);
      
      expect(collapsed).toHaveProperty('primary');
      expect(collapsed).toHaveProperty('value');
      expect(collapsed).toHaveProperty('confidence');
      expect(collapsed.primary).toBe('semantic');
      expect(collapsed.value).toBe(token.dimensions.semantic);
    });

    test('collapses to highest dimension when no context', () => {
      const collapsed = token.collapse({});
      const maxValue = Math.max(...Object.values(token.dimensions));
      expect(collapsed.value).toBe(maxValue);
    });

    test('updates lastObserved timestamp', () => {
      const before = token.lastObserved;
      setTimeout(() => {
        token.collapse({});
        expect(token.lastObserved).toBeGreaterThan(before);
      }, 10);
    });
  });

  describe('resonanceWith', () => {
    test('calculates resonance between two tokens', () => {
      const token2 = new HyperpositionToken('other');
      const resonance = token.resonanceWith(token2);
      
      expect(resonance).toBeGreaterThanOrEqual(0);
      expect(resonance).toBeLessThanOrEqual(1);
    });

    test('returns 1.0 for identical tokens', () => {
      // Create token with same dimensions
      const identicalToken = new HyperpositionToken('identical');
      identicalToken.dimensions = { ...token.dimensions };
      
      const resonance = token.resonanceWith(identicalToken);
      expect(resonance).toBeCloseTo(1.0, 5);
    });

    test('throws error for non-HyperpositionToken input', () => {
      expect(() => token.resonanceWith({})).toThrow();
      expect(() => token.resonanceWith(null)).toThrow();
      expect(() => token.resonanceWith('string')).toThrow();
    });
  });

  describe('normalize', () => {
    test('normalizes dimensions to unit length', () => {
      // Set unnormalized dimensions
      token.dimensions = {
        semantic: 2,
        temporal: 2,
        causal: 2,
        emotional: 2,
        relational: 2,
        probability: 2,
        energy: 2,
        coherence: 2
      };

      token.normalize();
      
      const sumOfSquares = Object.values(token.dimensions)
        .reduce((sum, val) => sum + val * val, 0);
      expect(sumOfSquares).toBeCloseTo(1.0, 5);
    });

    test('handles zero vector gracefully', () => {
      token.dimensions = {
        semantic: 0,
        temporal: 0,
        causal: 0,
        emotional: 0,
        relational: 0,
        probability: 0,
        energy: 0,
        coherence: 0
      };

      expect(() => token.normalize()).not.toThrow();
    });
  });

  describe('toHumanReadable', () => {
    test('returns human-readable representation', () => {
      const readable = token.toHumanReadable();
      
      expect(readable).toHaveProperty('content', 'test');
      expect(readable).toHaveProperty('dominantDimensions');
      expect(readable).toHaveProperty('phase');
      expect(readable).toHaveProperty('energy');
      expect(readable).toHaveProperty('ageMs');
      
      expect(readable.dominantDimensions).toHaveLength(3);
      expect(readable.ageMs).toBeGreaterThanOrEqual(0);
    });

    test('returns top 3 dimensions sorted by value', () => {
      // Set specific dimension values
      token.dimensions = {
        semantic: 0.5,
        temporal: 0.3,
        causal: 0.7,
        emotional: 0.1,
        relational: 0.2,
        probability: 0.6,
        energy: 0.4,
        coherence: 0.8
      };
      token.normalize();

      const readable = token.toHumanReadable();
      const dims = readable.dominantDimensions;

      expect(dims[0].dimension).toBe('coherence');
      expect(dims[1].dimension).toBe('causal');
      expect(dims[2].dimension).toBe('probability');
    });
  });

  describe('edge cases', () => {
    test('handles empty content', () => {
      const emptyToken = new HyperpositionToken('');
      expect(emptyToken.content).toBe('');
      expect(emptyToken.dimensions).toBeDefined();
    });

    test('handles very long content', () => {
      const longContent = 'a'.repeat(10000);
      const longToken = new HyperpositionToken(longContent);
      expect(longToken.content).toBe(longContent);
    });

    test('maintains phase boundaries', () => {
      token.phase = 2 * Math.PI + 0.1;
      expect(token.phase).toBeGreaterThanOrEqual(0);
      expect(token.phase).toBeLessThan(2 * Math.PI);
    });
  });

  describe('temporal aspects', () => {
    test('tracks age correctly', () => {
      const startTime = token.timestamp;
      
      setTimeout(() => {
        const readable = token.toHumanReadable();
        expect(readable.ageMs).toBeGreaterThan(0);
        expect(readable.ageMs).toBeCloseTo(Date.now() - startTime, -1);
      }, 100);
    });
  });
});