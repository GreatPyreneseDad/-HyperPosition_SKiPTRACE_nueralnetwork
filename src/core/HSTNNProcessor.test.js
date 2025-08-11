/**
 * Tests for HSTNN Processor
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HSTNNProcessor } from './HSTNNProcessor.js';
import { HyperpositionToken } from './HyperpositionToken.js';

describe('HSTNNProcessor', () => {
  it('should process simple text', () => {
    const processor = new HSTNNProcessor();
    const result = processor.processText("The cat sleeps");
    
    assert(result.compression.tokens.length > 0, 'Should have tokens');
    assert(result.hyperTokens.length > 0, 'Should have hyperposition tokens');
    assert(result.traces.length > 0, 'Should generate traces');
  });
  
  it('should compress text effectively', () => {
    const processor = new HSTNNProcessor();
    const text = "The boy ran because he was scared of the dog";
    const result = processor.processText(text);
    
    const originalWords = text.split(' ').length;
    const compressedTokens = result.compression.tokens.length;
    
    assert(compressedTokens < originalWords, 'Should compress text');
    assert(result.compression.compressionRatio < 1, 'Compression ratio should be less than 1');
  });
  
  it('should generate coherent traces', () => {
    const processor = new HSTNNProcessor();
    const result = processor.processText("She remembered her grandmother's voice");
    
    assert(result.bestTrace !== null, 'Should have a best trace');
    assert(result.bestTrace.coherence > 0, 'Best trace should have positive coherence');
    assert(result.coherentTraces.length > 0, 'Should have coherent traces');
  });
  
  it('should handle emotional content', () => {
    const processor = new HSTNNProcessor();
    const result = processor.processText("I was terrified when the storm hit");
    
    // Check if emotional dimensions are high for emotional words
    const terrifiedToken = result.hyperTokens.find(t => t.surface === 'terrified');
    assert(terrifiedToken !== undefined, 'Should find terrified token');
    assert(terrifiedToken.dimensions.emotional > 0.5, 'Emotional dimension should be high');
  });
  
  it('should detect causal relationships', () => {
    const processor = new HSTNNProcessor();
    const result = processor.processText("The rain fell because clouds formed");
    
    // Check if causal dimensions are high
    const becauseToken = result.hyperTokens.find(t => t.surface === 'because');
    assert(becauseToken !== undefined, 'Should find causal marker');
    
    // Best trace should connect cause and effect
    const bestTrace = result.bestTrace;
    assert(bestTrace !== null, 'Should have best trace');
    
    const traceSurfaces = bestTrace.path.map(t => t.surface);
    assert(traceSurfaces.includes('clouds'), 'Trace should include cause');
    assert(traceSurfaces.includes('rain'), 'Trace should include effect');
  });
  
  it('should compare similar texts correctly', () => {
    const processor = new HSTNNProcessor();
    const comparison = processor.compareTexts(
      "The dog runs fast",
      "The canine moves quickly"
    );
    
    assert(comparison.patternSimilarity > 0.5, 'Similar texts should have high pattern similarity');
    assert(comparison.interpretation.includes('similar'), 'Should recognize similarity');
  });
});

describe('HyperpositionToken', () => {
  it('should initialize with 8 dimensions', () => {
    const token = new HyperpositionToken('test', 'ENTITY');
    const dimensions = Object.keys(token.dimensions);
    
    assert.strictEqual(dimensions.length, 8, 'Should have 8 dimensions');
    assert(dimensions.includes('semantic'), 'Should have semantic dimension');
    assert(dimensions.includes('temporal'), 'Should have temporal dimension');
    assert(dimensions.includes('causal'), 'Should have causal dimension');
    assert(dimensions.includes('emotional'), 'Should have emotional dimension');
  });
  
  it('should normalize dimensions', () => {
    const token = new HyperpositionToken('test', 'ENTITY');
    const sum = Object.values(token.dimensions).reduce((a, b) => a + b, 0);
    
    // Due to floating point, check if close to 1
    assert(Math.abs(sum - 1.0) < 0.001, 'Dimensions should sum to 1');
  });
  
  it('should calculate resonance correctly', () => {
    const token1 = new HyperpositionToken('love', 'STATE');
    const token2 = new HyperpositionToken('hate', 'STATE');
    
    // Manually set similar dimensions
    token1.dimensions = { 
      semantic: 0.2, temporal: 0.1, causal: 0.1, emotional: 0.3,
      relational: 0.1, probability: 0.1, energy: 0.05, coherence: 0.05
    };
    token2.dimensions = { 
      semantic: 0.2, temporal: 0.1, causal: 0.1, emotional: 0.25,
      relational: 0.15, probability: 0.1, energy: 0.05, coherence: 0.05
    };
    
    const resonance = token1.resonanceWith(token2);
    assert(resonance > 0, 'Should have positive resonance');
    assert(resonance < 1, 'Resonance should be less than 1');
  });
});

// Run tests
console.log('Running HSTNN tests...');