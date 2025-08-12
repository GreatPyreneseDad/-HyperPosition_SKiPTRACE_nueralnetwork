import { describe, test, expect, beforeEach } from '@jest/globals';
import { SparseHyperpositionEncoder } from './SparseDistributed.js';

describe('SparseHyperpositionEncoder', () => {
  let encoder;

  beforeEach(() => {
    encoder = new SparseHyperpositionEncoder(10000, 0.02);
  });

  describe('constructor', () => {
    test('initializes with correct parameters', () => {
      expect(encoder.dimensions).toBe(10000);
      expect(encoder.sparsity).toBe(0.02);
      expect(encoder.activeBits).toBe(200); // 10000 * 0.02
      expect(encoder.conceptMemory).toBeInstanceOf(Map);
      expect(encoder.seeds).toHaveLength(100);
    });

    test('handles custom dimensions and sparsity', () => {
      const customEncoder = new SparseHyperpositionEncoder(50000, 0.01);
      expect(customEncoder.dimensions).toBe(50000);
      expect(customEncoder.sparsity).toBe(0.01);
      expect(customEncoder.activeBits).toBe(500);
    });
  });

  describe('encode', () => {
    test('creates sparse pattern with correct density', () => {
      const pattern = encoder.encode('test-concept');
      
      expect(pattern).toBeInstanceOf(Uint8Array);
      expect(pattern.length).toBe(10000);
      
      const activeBits = pattern.filter(bit => bit === 1).length;
      expect(activeBits).toBeCloseTo(200, 50); // Allow some variance due to hashing
    });

    test('returns consistent encoding for same concept', () => {
      const pattern1 = encoder.encode('consistency');
      const pattern2 = encoder.encode('consistency');
      
      expect(pattern1).toEqual(pattern2);
    });

    test('creates different patterns for different concepts', () => {
      const pattern1 = encoder.encode('concept1');
      const pattern2 = encoder.encode('concept2');
      
      let differences = 0;
      for (let i = 0; i < pattern1.length; i++) {
        if (pattern1[i] !== pattern2[i]) differences++;
      }
      
      expect(differences).toBeGreaterThan(100); // Should be significantly different
    });

    test('stores patterns in memory', () => {
      encoder.encode('memorable');
      expect(encoder.conceptMemory.has('memorable')).toBe(true);
    });
  });

  describe('superpose', () => {
    test('creates true OR superposition', () => {
      const love = encoder.encode('love');
      const fear = encoder.encode('fear');
      
      const superposition = encoder.superpose([love, fear]);
      
      // Every active bit in either pattern should be active in superposition
      for (let i = 0; i < love.length; i++) {
        if (love[i] === 1 || fear[i] === 1) {
          expect(superposition[i]).toBe(1);
        }
      }
    });

    test('preserves all patterns in superposition', () => {
      const patterns = [
        encoder.encode('pattern1'),
        encoder.encode('pattern2'),
        encoder.encode('pattern3')
      ];
      
      const superposition = encoder.superpose(patterns);
      
      // Count active bits
      const individualActive = patterns.reduce((sum, pattern) => 
        sum + pattern.filter(bit => bit === 1).length, 0
      );
      const superpositionActive = superposition.filter(bit => bit === 1).length;
      
      // Superposition should have at least as many active bits as largest pattern
      // but no more than sum of all (due to overlaps)
      expect(superpositionActive).toBeGreaterThanOrEqual(200);
      expect(superpositionActive).toBeLessThanOrEqual(individualActive);
    });
  });

  describe('findInterference', () => {
    test('detects overlap between patterns', () => {
      const pattern1 = encoder.encode('pattern1');
      const pattern2 = encoder.encode('pattern2');
      
      const interference = encoder.findInterference(pattern1, pattern2);
      
      expect(interference).toHaveProperty('pattern');
      expect(interference).toHaveProperty('strength');
      expect(interference.pattern).toBeInstanceOf(Uint8Array);
      expect(interference.strength).toBeGreaterThanOrEqual(0);
      expect(interference.strength).toBeLessThanOrEqual(1);
    });

    test('returns high interference for identical patterns', () => {
      const pattern = encoder.encode('identical');
      
      const interference = encoder.findInterference(pattern, pattern);
      
      expect(interference.strength).toBe(1.0);
    });

    test('returns low interference for unrelated patterns', () => {
      // Use very different strings to minimize hash collisions
      const pattern1 = encoder.encode('aaaaaaaaaaaaaaaaaa');
      const pattern2 = encoder.encode('zzzzzzzzzzzzzzzzzz');
      
      const interference = encoder.findInterference(pattern1, pattern2);
      
      expect(interference.strength).toBeLessThan(0.3); // Should have minimal overlap
    });
  });

  describe('emotionalSuperposition', () => {
    test('handles emotional states with phases', () => {
      const emotions = new Map([
        ['joy', { weight: 0.8, phase: 0 }],
        ['sadness', { weight: 0.6, phase: Math.PI }]
      ]);
      
      const result = encoder.emotionalSuperposition(emotions);
      
      expect(result).toHaveProperty('superposition');
      expect(result).toHaveProperty('interference');
      expect(result).toHaveProperty('isNumb');
      expect(result.superposition).toBeInstanceOf(Uint8Array);
    });

    test('detects emotional numbness from opposing phases', () => {
      const emotions = new Map([
        ['joy', { weight: 0.9, phase: 0 }],
        ['grief', { weight: 0.9, phase: Math.PI }]
      ]);
      
      const result = encoder.emotionalSuperposition(emotions);
      
      expect(result.interference.opposingPairs).toBeGreaterThan(0);
      expect(result.interference.description).toContain('Destructive interference');
    });

    test('handles constructive emotional states', () => {
      const emotions = new Map([
        ['joy', { weight: 0.8, phase: 0 }],
        ['excitement', { weight: 0.7, phase: 0.1 }]
      ]);
      
      const result = encoder.emotionalSuperposition(emotions);
      
      expect(result.isNumb).toBe(false);
      expect(result.interference.description).toContain('Constructive');
    });
  });

  describe('applyPhase', () => {
    test('returns original pattern for zero phase', () => {
      const pattern = encoder.encode('no-phase');
      const phased = encoder.applyPhase(pattern, 0);
      
      expect(phased).toEqual(pattern);
    });

    test('rotates pattern by phase amount', () => {
      const pattern = encoder.encode('phase-test');
      const phased = encoder.applyPhase(pattern, Math.PI);
      
      // Should have same number of active bits
      const originalActive = pattern.filter(bit => bit === 1).length;
      const phasedActive = phased.filter(bit => bit === 1).length;
      
      expect(phasedActive).toBe(originalActive);
      
      // But different positions
      let differences = 0;
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== phased[i]) differences++;
      }
      expect(differences).toBeGreaterThan(0);
    });
  });

  describe('generateSkipTrace', () => {
    test('creates trace between patterns', () => {
      const start = encoder.encode('beginning');
      const end = encoder.encode('ending');
      const intermediates = [
        encoder.encode('middle1'),
        encoder.encode('middle2')
      ];
      
      const trace = encoder.generateSkipTrace(start, end, intermediates);
      
      expect(trace).toHaveProperty('trace');
      expect(trace).toHaveProperty('jumps');
      expect(trace).toHaveProperty('totalResonance');
      expect(trace).toHaveProperty('isNonLinear');
      expect(trace.trace).toContain(start);
    });

    test('identifies non-linear paths', () => {
      const start = encoder.encode('A');
      const end = encoder.encode('Z');
      const intermediates = Array.from({length: 10}, (_, i) => 
        encoder.encode(`intermediate${i}`)
      );
      
      const trace = encoder.generateSkipTrace(start, end, intermediates);
      
      // Should skip some intermediates
      expect(trace.trace.length).toBeLessThan(intermediates.length + 2);
      expect(trace.isNonLinear).toBe(true);
    });
  });

  describe('calculateResonance', () => {
    test('calculates Jaccard similarity correctly', () => {
      const pattern1 = new Uint8Array([1, 0, 1, 0, 1]);
      const pattern2 = new Uint8Array([1, 0, 0, 1, 1]);
      
      const resonance = encoder.calculateResonance(pattern1, pattern2);
      
      // Overlap: 2 bits (positions 0 and 4)
      // Union: 4 bits (positions 0, 2, 3, 4)
      // Resonance: 2/4 = 0.5
      expect(resonance).toBe(0.5);
    });

    test('returns 1 for identical patterns', () => {
      const pattern = encoder.encode('same');
      const resonance = encoder.calculateResonance(pattern, pattern);
      
      expect(resonance).toBe(1);
    });

    test('returns 0 for non-overlapping patterns', () => {
      const pattern1 = new Uint8Array([1, 1, 0, 0]);
      const pattern2 = new Uint8Array([0, 0, 1, 1]);
      
      const resonance = encoder.calculateResonance(pattern1, pattern2);
      
      expect(resonance).toBe(0);
    });
  });

  describe('decode', () => {
    test('retrieves stored concepts by pattern', () => {
      // Store some concepts
      encoder.encode('apple');
      encoder.encode('banana');
      encoder.encode('cherry');
      
      // Decode exact pattern
      const applePattern = encoder.encode('apple');
      const matches = encoder.decode(applePattern);
      
      expect(matches).toHaveLength(1);
      expect(matches[0].concept).toBe('apple');
      expect(matches[0].resonance).toBe(1);
    });

    test('finds similar patterns with threshold', () => {
      encoder.encode('cat');
      encoder.encode('car');
      encoder.encode('cap');
      
      const catPattern = encoder.encode('cat');
      // Slightly modify pattern
      const modifiedPattern = new Uint8Array(catPattern);
      for (let i = 0; i < 10; i++) {
        const idx = Math.floor(Math.random() * modifiedPattern.length);
        modifiedPattern[idx] = modifiedPattern[idx] ? 0 : 1;
      }
      
      const matches = encoder.decode(modifiedPattern, 0.8);
      
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].concept).toBe('cat');
    });

    test('returns empty array for unknown patterns', () => {
      const randomPattern = new Uint8Array(10000);
      const matches = encoder.decode(randomPattern, 0.9);
      
      expect(matches).toEqual([]);
    });
  });

  describe('memory management', () => {
    test('stores patterns efficiently', () => {
      const concepts = 100;
      for (let i = 0; i < concepts; i++) {
        encoder.encode(`concept${i}`);
      }
      
      expect(encoder.conceptMemory.size).toBe(concepts);
    });
  });

  describe('hash function', () => {
    test('generates consistent hashes', () => {
      const hash1 = encoder.hashFunction('test', 0);
      const hash2 = encoder.hashFunction('test', 0);
      
      expect(hash1).toBe(hash2);
    });

    test('generates different hashes for different seeds', () => {
      const hash1 = encoder.hashFunction('test', 0);
      const hash2 = encoder.hashFunction('test', 1);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('performance characteristics', () => {
    test('encodes quickly even with large dimensions', () => {
      const largeEncoder = new SparseHyperpositionEncoder(100000, 0.01);
      
      const start = Date.now();
      largeEncoder.encode('performance-test');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100); // Should encode in under 100ms
    });

    test('superposition scales linearly with pattern count', () => {
      const patterns = Array.from({length: 100}, (_, i) => 
        encoder.encode(`pattern${i}`)
      );
      
      const start = Date.now();
      encoder.superpose(patterns);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(200); // Should complete quickly
    });
  });
});