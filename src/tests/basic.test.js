import { describe, test, expect } from '@jest/globals';
import { HyperpositionToken } from '../core/HyperpositionToken.js';
import { EmotionalHyperpositionToken } from '../core/EmotionalHyperposition.js';
import { BiHamiltonianToken } from '../core/BiHamiltonianStability.js';
import { SparseHyperpositionEncoder } from '../architecture/SparseDistributed.js';

describe('Basic HSTNN Tests', () => {
  
  test('HyperpositionToken creates with surface and universal type', () => {
    const token = new HyperpositionToken('hello', 'ENTITY');
    
    expect(token.surface).toBe('hello');
    expect(token.universal).toBe('ENTITY');
    expect(token.connections).toBeDefined();
    expect(token.dimensions).toBeDefined();
  });

  test('EmotionalHyperpositionToken extends HyperpositionToken', () => {
    const token = new EmotionalHyperpositionToken('joy', 'STATE');
    
    expect(token.surface).toBe('joy');
    expect(token.universal).toBe('STATE');
    expect(token.emotionalState).toBeDefined();
  });

  test('BiHamiltonianToken includes stability monitoring', () => {
    const token = new BiHamiltonianToken('stable', 'ENTITY');
    
    expect(token.surface).toBe('stable');
    expect(token.H1_coherence).toBeDefined();
    expect(token.H2_structure).toBeDefined();
  });

  test('SparseHyperpositionEncoder creates sparse patterns', () => {
    const encoder = new SparseHyperpositionEncoder(1000, 0.1);
    const pattern = encoder.encode('test');
    
    expect(pattern).toBeInstanceOf(Uint8Array);
    expect(pattern.length).toBe(1000);
    
    // Count active bits
    const activeBits = Array.from(pattern).filter(bit => bit === 1).length;
    expect(activeBits).toBeGreaterThan(50);
    expect(activeBits).toBeLessThan(150);
  });

  test('Sparse patterns enable true superposition', () => {
    const encoder = new SparseHyperpositionEncoder(1000, 0.1);
    const pattern1 = encoder.encode('love');
    const pattern2 = encoder.encode('fear');
    
    const superposition = encoder.superpose([pattern1, pattern2]);
    
    // Verify OR operation
    for (let i = 0; i < pattern1.length; i++) {
      if (pattern1[i] === 1 || pattern2[i] === 1) {
        expect(superposition[i]).toBe(1);
      }
    }
  });

  test('Emotional interference creates destructive patterns', () => {
    const encoder = new SparseHyperpositionEncoder(1000, 0.1);
    
    const emotions = new Map([
      ['joy', { weight: 0.8, phase: 0 }],
      ['grief', { weight: 0.8, phase: Math.PI }]
    ]);
    
    const result = encoder.emotionalSuperposition(emotions);
    
    expect(result.interference).toBeDefined();
    expect(result.interference.opposingPairs).toBeGreaterThan(0);
  });
});