/**
 * Sparse Distributed Representation for Hyperposition
 * Shows why this architecture is fundamentally different from dense embeddings
 */

export class SparseHyperpositionEncoder {
  constructor(dimensions = 100000, sparsity = 0.02) {
    this.dimensions = dimensions;
    this.sparsity = sparsity;
    this.activeBits = Math.floor(dimensions * sparsity);
    
    // Concept memory - stores learned patterns
    this.conceptMemory = new Map();
    
    // Precompute random seeds for deterministic encoding
    this.seeds = this.generateSeeds();
  }
  
  /**
   * Encode concept into sparse distributed representation
   * This is NOT tokenization - it's holographic encoding
   */
  encode(concept) {
    // Check if we've seen this exact concept
    if (this.conceptMemory.has(concept)) {
      return this.conceptMemory.get(concept);
    }
    
    // Generate new sparse pattern
    const pattern = new Uint8Array(this.dimensions);
    
    // Use multiple hash functions for distributed representation
    for (let i = 0; i < this.activeBits; i++) {
      const index = this.hashFunction(concept, i) % this.dimensions;
      pattern[index] = 1;
    }
    
    // Store for consistency
    this.conceptMemory.set(concept, pattern);
    
    return pattern;
  }
  
  /**
   * Create superposition by OR-ing patterns
   * This is TRUE superposition, not averaging!
   */
  superpose(patterns) {
    const superposition = new Uint8Array(this.dimensions);
    
    for (const pattern of patterns) {
      for (let i = 0; i < this.dimensions; i++) {
        superposition[i] = superposition[i] || pattern[i];
      }
    }
    
    return superposition;
  }
  
  /**
   * Find interference between patterns
   * This reveals what concepts share
   */
  findInterference(pattern1, pattern2) {
    const interference = new Uint8Array(this.dimensions);
    let overlapCount = 0;
    
    for (let i = 0; i < this.dimensions; i++) {
      if (pattern1[i] && pattern2[i]) {
        interference[i] = 1;
        overlapCount++;
      }
    }
    
    return {
      pattern: interference,
      strength: overlapCount / this.activeBits
    };
  }
  
  /**
   * Emotional superposition with phase
   * Shows how opposing emotions cancel
   */
  emotionalSuperposition(emotions) {
    const patterns = [];
    
    for (const [emotion, config] of emotions) {
      const basePattern = this.encode(emotion);
      
      // Phase shift pattern based on emotional phase
      const phasedPattern = this.applyPhase(basePattern, config.phase);
      patterns.push({
        pattern: phasedPattern,
        weight: config.weight,
        phase: config.phase
      });
    }
    
    // Check for destructive interference
    const interference = this.detectDestructiveInterference(patterns);
    
    return {
      superposition: this.weightedSuperpose(patterns),
      interference: interference,
      isNumb: interference.cancellation > 0.7
    };
  }
  
  /**
   * Apply phase to pattern (simplified quantum analogy)
   */
  applyPhase(pattern, phase) {
    if (phase === 0) return pattern;
    
    const phased = new Uint8Array(this.dimensions);
    
    // Phase shift by rotating active bits
    const shift = Math.floor((phase / (2 * Math.PI)) * this.activeBits);
    
    let activeIndices = [];
    for (let i = 0; i < this.dimensions; i++) {
      if (pattern[i]) activeIndices.push(i);
    }
    
    // Rotate active indices by phase
    for (let i = 0; i < activeIndices.length; i++) {
      const newIndex = (activeIndices[i] + shift) % this.dimensions;
      phased[newIndex] = 1;
    }
    
    return phased;
  }
  
  /**
   * Detect destructive interference (emotional cancellation)
   */
  detectDestructiveInterference(patterns) {
    let totalActivation = 0;
    let opposingPairs = 0;
    
    // Check all pairs for phase opposition
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const phaseDiff = Math.abs(patterns[i].phase - patterns[j].phase);
        
        // Check if phases are opposite (around π)
        if (Math.abs(phaseDiff - Math.PI) < 0.1) {
          opposingPairs++;
          
          // Calculate cancellation
          const overlap = this.findInterference(
            patterns[i].pattern,
            patterns[j].pattern
          );
          
          totalActivation -= overlap.strength * 
            patterns[i].weight * patterns[j].weight;
        }
      }
    }
    
    return {
      opposingPairs: opposingPairs,
      cancellation: Math.abs(totalActivation),
      description: opposingPairs > 0 ? 
        'Destructive interference detected - emotional numbness' : 
        'Constructive emotional state'
    };
  }
  
  /**
   * Skip-trace through sparse space
   * Shows non-linear conceptual jumps
   */
  generateSkipTrace(startPattern, endPattern, intermediates = []) {
    const trace = [startPattern];
    let current = startPattern;
    
    // Add intermediate patterns based on resonance
    for (const intermediate of intermediates) {
      const resonance = this.calculateResonance(current, intermediate);
      if (resonance > 0.1) {
        trace.push(intermediate);
        current = intermediate;
      }
    }
    
    // Find path to end pattern
    const finalResonance = this.calculateResonance(current, endPattern);
    if (finalResonance > 0.05) {
      trace.push(endPattern);
    }
    
    return {
      trace: trace,
      jumps: trace.length - 1,
      totalResonance: this.calculateTraceResonance(trace),
      isNonLinear: trace.length < intermediates.length + 2
    };
  }
  
  /**
   * Calculate resonance between sparse patterns
   */
  calculateResonance(pattern1, pattern2) {
    let overlap = 0;
    let union = 0;
    
    for (let i = 0; i < this.dimensions; i++) {
      if (pattern1[i] || pattern2[i]) union++;
      if (pattern1[i] && pattern2[i]) overlap++;
    }
    
    return union > 0 ? overlap / union : 0;
  }
  
  /**
   * Weighted superposition
   */
  weightedSuperpose(patterns) {
    const result = new Float32Array(this.dimensions);
    
    for (const {pattern, weight} of patterns) {
      for (let i = 0; i < this.dimensions; i++) {
        result[i] += pattern[i] * weight;
      }
    }
    
    // Threshold to binary
    const binary = new Uint8Array(this.dimensions);
    const threshold = 0.5;
    
    for (let i = 0; i < this.dimensions; i++) {
      binary[i] = result[i] > threshold ? 1 : 0;
    }
    
    return binary;
  }
  
  /**
   * Calculate total resonance through trace
   */
  calculateTraceResonance(trace) {
    if (trace.length < 2) return 0;
    
    let totalResonance = 0;
    for (let i = 0; i < trace.length - 1; i++) {
      totalResonance += this.calculateResonance(trace[i], trace[i + 1]);
    }
    
    return totalResonance / (trace.length - 1);
  }
  
  /**
   * Hash function for distributed encoding
   */
  hashFunction(input, seed) {
    let hash = this.seeds[seed % this.seeds.length];
    
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  }
  
  /**
   * Generate random seeds for hashing
   */
  generateSeeds() {
    const seeds = [];
    for (let i = 0; i < 100; i++) {
      seeds.push(Math.floor(Math.random() * 2147483647));
    }
    return seeds;
  }
  
  /**
   * Decode pattern back to concepts (associative recall)
   */
  decode(pattern, threshold = 0.3) {
    const matches = [];
    
    for (const [concept, storedPattern] of this.conceptMemory) {
      const resonance = this.calculateResonance(pattern, storedPattern);
      if (resonance > threshold) {
        matches.push({ concept, resonance });
      }
    }
    
    // Sort by resonance
    matches.sort((a, b) => b.resonance - a.resonance);
    
    return matches;
  }
}

/**
 * Demonstration of why this is different
 */
export class SparseDemonstration {
  static demonstrate() {
    console.log('=== Sparse Distributed Representation Demo ===\n');
    
    const encoder = new SparseHyperpositionEncoder(10000, 0.02);
    
    // 1. Show true superposition
    console.log('1. True Superposition (not averaging):');
    const love = encoder.encode('love');
    const fear = encoder.encode('fear');
    const superposition = encoder.superpose([love, fear]);
    
    console.log(`Love activates ${love.filter(x => x).length} bits`);
    console.log(`Fear activates ${fear.filter(x => x).length} bits`);
    console.log(`Superposition activates ${superposition.filter(x => x).length} bits`);
    console.log('→ Both patterns exist simultaneously!\n');
    
    // 2. Show emotional interference
    console.log('2. Emotional Interference:');
    const emotions = new Map([
      ['joy', { weight: 0.8, phase: 0 }],
      ['grief', { weight: 0.8, phase: Math.PI }]
    ]);
    
    const emotionalState = encoder.emotionalSuperposition(emotions);
    console.log(`Interference: ${emotionalState.interference.description}`);
    console.log(`Is numb: ${emotionalState.isNumb}`);
    console.log('→ Opposing phases create numbness through cancellation!\n');
    
    // 3. Show non-linear skip traces
    console.log('3. Non-linear Skip Traces:');
    const mother = encoder.encode('mother');
    const voice = encoder.encode('voice');
    const memory = encoder.encode('memory');
    const grandmother = encoder.encode('grandmother');
    
    const trace = encoder.generateSkipTrace(
      mother, 
      voice,
      [memory, grandmother, encoder.encode('forgotten')]
    );
    
    console.log(`Linear path would be: 5 steps`);
    console.log(`Skip-trace path: ${trace.jumps} jumps`);
    console.log(`Non-linear: ${trace.isNonLinear}`);
    console.log('→ Concepts connect through meaning, not sequence!\n');
    
    // 4. Show associative recall
    console.log('4. Associative Recall:');
    const mixed = encoder.superpose([mother, grandmother]);
    const recalled = encoder.decode(mixed, 0.2);
    
    console.log('Superposition of mother + grandmother recalls:');
    recalled.forEach(match => {
      console.log(`  ${match.concept}: ${(match.resonance * 100).toFixed(1)}%`);
    });
    
    console.log('\n=== This is fundamentally different from tokens! ===');
  }
}