# HSTNN Implementation Details

## Overview

This implementation of the Hyperposition Skip-Trace Neural Network (HSTNN) demonstrates the core concepts described in the README. The architecture consists of four main components working together to process language through non-sequential, biologically-inspired patterns.

## Architecture Components

### 1. HyperpositionToken
- **Location**: `src/core/HyperpositionToken.js`
- **Purpose**: Represents tokens that exist in multiple dimensional states simultaneously
- **Key Features**:
  - 8-dimensional state vector (semantic, temporal, causal, emotional, relational, probability, energy, coherence)
  - Quantum-like collapse based on context
  - Resonance calculation between tokens
  - Dynamic connection building

### 2. UniversalTokenLibrary
- **Location**: `src/core/UniversalTokenLibrary.js`
- **Purpose**: Maps all language to fundamental conceptual primitives
- **Key Features**:
  - 5 prime universal tokens (ENTITY, ACTION, RELATION, STATE, MODIFIER)
  - Pattern-based classification
  - Semantic distance calculations
  - Text compression capabilities

### 3. SkipTraceEngine
- **Location**: `src/core/SkipTraceEngine.js`
- **Purpose**: Generates non-linear meaning paths through token space
- **Key Features**:
  - Mimics hippocampal sharp wave ripples
  - Multi-branch trace generation
  - Coherence-based pruning
  - Energy-based termination

### 4. HSTNNProcessor
- **Location**: `src/core/HSTNNProcessor.js`
- **Purpose**: Orchestrates the complete processing pipeline
- **Key Features**:
  - Text tokenization and classification
  - Hyperposition state management
  - Resonance network building
  - Trace generation and analysis

## Processing Pipeline

1. **Tokenization**: Input text is parsed and classified into universal token types
2. **Hyperposition Creation**: Each token becomes a HyperpositionToken with 8D state
3. **Resonance Building**: Tokens form connections based on dimensional similarity
4. **Context Analysis**: System detects temporal, causal, emotional markers
5. **State Collapse**: Token dimensions adjust based on context
6. **Skip-Trace Generation**: Non-linear paths through meaning space are created
7. **Coherence Scoring**: Traces are evaluated for internal consistency

## Key Algorithms

### Resonance Calculation
```javascript
resonance = Σ(1 - |dim_i - dim_j|) * weight_i
```

### Skip Score Function
```javascript
S(ti, tj) = λ1·C(ti,tj) + λ2·E(ti,tj) + λ3·(1-D(ti,tj)) + λ4·T(ti,tj)
```

### Coherence Metric
```javascript
Coherence(N) = (Σij R(ti,tj)) / (n(n-1)/2)
```

## Usage Examples

### Basic Processing
```javascript
import { HSTNNProcessor } from './src/core/HSTNNProcessor.js';

const processor = new HSTNNProcessor();
const result = processor.processText("Your text here");
console.log(processor.visualize(result));
```

### Custom Configuration
```javascript
const processor = new HSTNNProcessor({
  skipThreshold: 0.3,      // Minimum score for skip connections
  maxTraceLength: 10,      // Maximum trace length
  branchingFactor: 3,      // Max branches per token
  resonanceStrength: 1.2   // Resonance multiplier
});
```

### Token Analysis
```javascript
const token = new HyperpositionToken("word", "ENTITY");
console.log(token.dimensions);  // View 8D state
token.collapse(context);        // Apply context
```

## Experimental Features

### Compression Efficiency
The system achieves 20-65% token reduction while preserving meaning through universal token mapping.

### Multiple Interpretations
Skip-trace branching allows multiple valid interpretations of ambiguous text.

### Emotional and Causal Tracking
Dedicated dimensions track emotional resonance and causal relationships through text.

## Performance Considerations

- **Memory**: O(n²) for resonance connections
- **Time**: O(n² × b^d) for trace generation (b=branching, d=depth)
- **Optimization**: Pruning and energy limits prevent exponential explosion

## Future Enhancements

1. **Learning**: Implement trace reinforcement based on feedback
2. **Scale**: Optimize for larger text processing
3. **Integration**: Connect to existing NLP pipelines
4. **Validation**: Compare with human cognitive patterns

## Testing

Run tests with:
```bash
npm test
```

Run interactive demo:
```bash
npm run demo
```

## Contributing

The implementation is experimental and welcomes contributions in:
- Algorithm optimization
- Biological accuracy improvements
- New dimensional additions
- Application development

See the main README for theoretical background and research directions.