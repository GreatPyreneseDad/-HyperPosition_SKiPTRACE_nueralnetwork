/**
 * SkipTraceEngine - Generates non-linear meaning paths through token space
 * Mimics hippocampal sharp wave ripples that replay experiences at 20x speed
 */

import { HyperpositionToken } from './HyperpositionToken.js';

export class SkipTraceEngine {
  constructor(tokens, threshold = 0.3) {
    this.tokens = tokens;           // Array of HyperpositionTokens
    this.threshold = threshold;     // Minimum score for skip connections
    this.traces = [];              // Generated skip traces
    this.energy = 1.0;             // Total energy for trace generation
    this.maxTraceLength = 10;      // Maximum length of a single trace
    this.branchingFactor = 3;      // Maximum branches per token
    
    // Weights for skip score calculation
    this.weights = {
      causal: 0.3,      // λ₁: Causal link strength
      emotional: 0.25,  // λ₂: Emotional resonance
      semantic: 0.25,   // λ₃: Semantic similarity (inverted distance)
      temporal: 0.2     // λ₄: Temporal flow
    };
  }
  
  /**
   * Generate all possible skip traces through the token space
   * Returns multiple interpretation paths
   */
  generateTraces() {
    this.traces = [];
    
    // Find anchor points (high-energy starting tokens)
    const anchors = this.findAnchors();
    
    // Generate traces from each anchor
    for (const anchor of anchors) {
      const anchorTraces = this.traceFromToken(anchor, [], this.energy);
      this.traces.push(...anchorTraces);
    }
    
    // Prune redundant or low-coherence traces
    this.traces = this.pruneTraces(this.traces);
    
    // Calculate trace coherence scores
    this.traces.forEach(trace => {
      trace.coherence = this.calculateTraceCoherence(trace);
    });
    
    // Sort by coherence
    this.traces.sort((a, b) => b.coherence - a.coherence);
    
    return this.traces;
  }
  
  /**
   * Find high-energy anchor points to start traces
   * These are tokens with high activation potential
   */
  findAnchors() {
    // If no high-energy tokens, use tokens with highest energy
    const sorted = [...this.tokens]
      .sort((a, b) => b.dimensions.energy - a.dimensions.energy);
    
    // Take at least 1 anchor, up to 30% of tokens
    const anchorCount = Math.max(1, Math.ceil(this.tokens.length * 0.3));
    return sorted.slice(0, anchorCount);
  }
  
  /**
   * Generate traces starting from a specific token
   * Recursive function that branches through meaning space
   */
  traceFromToken(currentToken, path, remainingEnergy) {
    // Terminal conditions
    if (path.length >= this.maxTraceLength || remainingEnergy < 0.1) {
      return [{
        path: [...path, currentToken],
        energy: this.energy - remainingEnergy,
        complete: true
      }];
    }
    
    // Add current token to path
    const newPath = [...path, currentToken];
    
    // Calculate skip scores to all other tokens
    const skipCandidates = this.findSkipCandidates(currentToken, newPath);
    
    // If no good candidates, end trace here
    if (skipCandidates.length === 0) {
      return [{
        path: newPath,
        energy: this.energy - remainingEnergy,
        complete: false
      }];
    }
    
    // Branch to top candidates
    const traces = [];
    const branches = Math.min(this.branchingFactor, skipCandidates.length);
    
    for (let i = 0; i < branches; i++) {
      const candidate = skipCandidates[i];
      const energyCost = this.calculateEnergyCost(currentToken, candidate.token);
      
      // Recursively trace from candidate
      const subTraces = this.traceFromToken(
        candidate.token,
        newPath,
        remainingEnergy - energyCost
      );
      
      traces.push(...subTraces);
    }
    
    return traces;
  }
  
  /**
   * Find valid skip candidates from current token
   */
  findSkipCandidates(fromToken, currentPath) {
    const candidates = [];
    
    for (const toToken of this.tokens) {
      // Skip if already in path (prevent loops)
      if (currentPath.includes(toToken)) continue;
      
      // Calculate skip score
      const score = this.skipScore(fromToken, toToken);
      
      // Only consider if above threshold
      if (score > this.threshold) {
        candidates.push({ token: toToken, score: score });
      }
    }
    
    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);
    
    return candidates;
  }
  
  /**
   * Calculate skip score between two tokens
   * S(tᵢ, tⱼ) = λ₁·C(tᵢ,tⱼ) + λ₂·E(tᵢ,tⱼ) + λ₃·(1-D(tᵢ,tⱼ)) + λ₄·T(tᵢ,tⱼ)
   */
  skipScore(from, to) {
    // Causal link strength
    const causal = this.causalStrength(from, to);
    
    // Emotional resonance
    const emotional = this.emotionalResonance(from, to);
    
    // Semantic similarity (inverse of distance)
    const semantic = 1 - this.semanticDistance(from, to);
    
    // Temporal flow
    const temporal = this.temporalFlow(from, to);
    
    // Weighted combination
    const score = 
      this.weights.causal * causal +
      this.weights.emotional * emotional +
      this.weights.semantic * semantic +
      this.weights.temporal * temporal;
    
    return score;
  }
  
  /**
   * Calculate causal relationship strength
   */
  causalStrength(from, to) {
    // Strong causal dimension in both tokens indicates potential link
    const causalProduct = from.dimensions.causal * to.dimensions.causal;
    
    // Boost if 'to' has higher causal than 'from' (effect follows cause)
    const causalFlow = to.dimensions.causal > from.dimensions.causal ? 1.2 : 0.8;
    
    return Math.min(1.0, causalProduct * causalFlow);
  }
  
  /**
   * Calculate emotional resonance between tokens
   */
  emotionalResonance(from, to) {
    // Similar emotional dimensions resonate
    const emotionalDiff = Math.abs(from.dimensions.emotional - to.dimensions.emotional);
    const resonance = 1 - emotionalDiff;
    
    // High emotional content in either token boosts resonance
    const emotionalIntensity = (from.dimensions.emotional + to.dimensions.emotional) / 2;
    
    return resonance * (0.5 + emotionalIntensity * 0.5);
  }
  
  /**
   * Calculate semantic distance in meaning space
   */
  semanticDistance(from, to) {
    // Euclidean distance in semantic dimension
    // In full implementation, would use all relevant dimensions
    return Math.abs(from.dimensions.semantic - to.dimensions.semantic);
  }
  
  /**
   * Calculate temporal flow compatibility
   */
  temporalFlow(from, to) {
    // Temporal dimension should flow forward
    const temporalDiff = to.dimensions.temporal - from.dimensions.temporal;
    
    // Positive difference (forward flow) is good
    if (temporalDiff > 0) {
      return Math.min(1.0, temporalDiff * 2);
    } else {
      // Backward flow is possible but penalized
      return Math.max(0, 1 + temporalDiff * 0.5);
    }
  }
  
  /**
   * Calculate energy cost for making a skip
   */
  calculateEnergyCost(from, to) {
    // Longer semantic jumps cost more energy
    const distance = this.semanticDistance(from, to);
    
    // High-energy tokens reduce cost
    const energyFactor = (from.dimensions.energy + to.dimensions.energy) / 2;
    
    return distance * (1 - energyFactor * 0.5);
  }
  
  /**
   * Prune redundant or low-quality traces
   */
  pruneTraces(traces) {
    const pruned = [];
    const seenPatterns = new Set();
    
    for (const trace of traces) {
      // Create a pattern signature
      const pattern = trace.path
        .map(t => t.universal)
        .join('-');
      
      // Skip if we've seen this pattern
      if (seenPatterns.has(pattern)) continue;
      
      // Skip very short traces
      if (trace.path.length < 3) continue;
      
      seenPatterns.add(pattern);
      pruned.push(trace);
    }
    
    return pruned;
  }
  
  /**
   * Calculate coherence score for a complete trace
   * Coherence(N) = (Σᵢⱼ R(tᵢ,tⱼ)) / (n(n-1)/2)
   */
  calculateTraceCoherence(trace) {
    const path = trace.path;
    const n = path.length;
    
    if (n < 2) return 0;
    
    let totalResonance = 0;
    let connections = 0;
    
    // Calculate pairwise resonance
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const resonance = path[i].resonanceWith(path[j]);
        totalResonance += resonance;
        connections++;
      }
    }
    
    // Normalize by number of connections
    const coherence = connections > 0 ? totalResonance / connections : 0;
    
    // Boost for energy efficiency
    const energyBonus = (1 - trace.energy / this.energy) * 0.2;
    
    return Math.min(1.0, coherence + energyBonus);
  }
  
  /**
   * Get the best trace (highest coherence)
   */
  getBestTrace() {
    return this.traces.length > 0 ? this.traces[0] : null;
  }
  
  /**
   * Get all traces above a coherence threshold
   */
  getCoherentTraces(minCoherence = 0.5) {
    return this.traces.filter(trace => trace.coherence >= minCoherence);
  }
  
  /**
   * Visualize traces as string paths
   */
  visualizeTraces(maxTraces = 5) {
    const result = [];
    const tracesToShow = Math.min(maxTraces, this.traces.length);
    
    for (let i = 0; i < tracesToShow; i++) {
      const trace = this.traces[i];
      const path = trace.path
        .map(token => `[${token.surface}]`)
        .join(' → ');
      
      result.push({
        rank: i + 1,
        path: path,
        coherence: trace.coherence.toFixed(3),
        energy: trace.energy.toFixed(3),
        length: trace.path.length
      });
    }
    
    return result;
  }
}