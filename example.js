/**
 * Simple example of using HSTNN
 */

import { HSTNNProcessor } from './src/core/HSTNNProcessor.js';
import { HyperpositionToken } from './src/core/HyperpositionToken.js';

// Create processor
const processor = new HSTNNProcessor({
  skipThreshold: 0.3,
  resonanceStrength: 1.2
});

// Example 1: Basic usage
console.log('=== Example 1: Basic Usage ===');
const result = processor.processText("The boy ran because he was scared of the dog");
console.log(processor.visualize(result));

// Example 2: Create individual tokens
console.log('\n=== Example 2: Individual Tokens ===');
const fearToken = new HyperpositionToken("fear", "STATE");
const loveToken = new HyperpositionToken("love", "STATE");

console.log('Fear token dimensions:', fearToken.dimensions);
console.log('Resonance between fear and love:', fearToken.resonanceWith(loveToken));

// Example 3: Compare texts
console.log('\n=== Example 3: Text Comparison ===');
const comparison = processor.compareTexts(
  "Fear makes people do strange things",
  "People act oddly when afraid"
);

console.log('Comparison result:', comparison.interpretation);
console.log('Pattern similarity:', (comparison.patternSimilarity * 100).toFixed(0) + '%');