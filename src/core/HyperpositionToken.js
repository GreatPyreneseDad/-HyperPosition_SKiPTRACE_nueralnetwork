/**
 * HyperpositionToken - A token that exists in multiple dimensional states simultaneously
 * Inspired by quantum superposition and hippocampal memory indexing
 */

export class HyperpositionToken {
  constructor(surface, universal) {
    this.surface = surface;        // Original text representation
    this.universal = universal;    // Universal token type (ENTITY, ACTION, etc.)
    this.connections = [];         // Skip-trace connections to other tokens
    this.resonance = 0;           // Total resonance with context
    
    // Initialize 8-dimensional state vector
    // Each dimension represents a different aspect of meaning
    this.dimensions = {
      semantic: Math.random(),     // Meaning space position
      temporal: Math.random(),     // Time relationship
      causal: Math.random(),       // Cause-effect strength
      emotional: Math.random(),    // Affective resonance
      relational: Math.random(),   // Connection strength
      probability: Math.random(),  // Interpretation likelihood
      energy: Math.random(),       // Activation potential
      coherence: Math.random()     // Internal consistency
    };
    
    // Normalize dimensions to ensure valid probability space
    this.normalizeDimensions();
  }
  
  /**
   * Normalize dimensions so they represent a valid probability distribution
   */
  normalizeDimensions() {
    const sum = Object.values(this.dimensions).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      for (const dim in this.dimensions) {
        this.dimensions[dim] /= sum;
      }
    }
  }
  
  /**
   * Collapse the hyperposition state based on observational context
   * Similar to quantum wave function collapse
   */
  collapse(context) {
    // Context influences which dimensions become dominant
    const contextWeights = this.calculateContextWeights(context);
    
    // Apply context weights to dimensions
    for (const dim in this.dimensions) {
      this.dimensions[dim] *= contextWeights[dim] || 1.0;
    }
    
    // Re-normalize after collapse
    this.normalizeDimensions();
    
    // Update energy based on collapse
    this.dimensions.energy *= 0.9; // Energy dissipates with observation
    
    return this.dimensions;
  }
  
  /**
   * Calculate how context affects dimensional weights
   */
  calculateContextWeights(context) {
    const weights = {
      semantic: 1.0,
      temporal: 1.0,
      causal: 1.0,
      emotional: 1.0,
      relational: 1.0,
      probability: 1.0,
      energy: 1.0,
      coherence: 1.0
    };
    
    // Analyze context tokens to determine weight adjustments
    if (context.hasTemporalMarkers) weights.temporal *= 2.0;
    if (context.hasCausalMarkers) weights.causal *= 1.8;
    if (context.hasEmotionalContent) weights.emotional *= 1.5;
    if (context.isQuestion) weights.probability *= 1.3;
    
    return weights;
  }
  
  /**
   * Calculate resonance with another token across all dimensions
   * High resonance indicates strong conceptual connection
   */
  resonanceWith(other) {
    if (!(other instanceof HyperpositionToken)) {
      throw new Error('Can only calculate resonance with another HyperpositionToken');
    }
    
    let totalResonance = 0;
    
    // Calculate resonance for each dimension
    for (const dim in this.dimensions) {
      const dimResonance = 1 - Math.abs(this.dimensions[dim] - other.dimensions[dim]);
      totalResonance += dimResonance * this.getResonanceWeight(dim);
    }
    
    // Apply distance penalty for non-adjacent tokens
    const distancePenalty = this.calculateDistancePenalty(other);
    totalResonance *= distancePenalty;
    
    return totalResonance;
  }
  
  /**
   * Get dimension-specific resonance weights
   * Some dimensions are more important for certain connections
   */
  getResonanceWeight(dimension) {
    const weights = {
      semantic: 0.25,      // Meaning is fundamental
      temporal: 0.10,      // Time matters less for resonance
      causal: 0.20,        // Causality creates strong connections
      emotional: 0.15,     // Emotions resonate strongly
      relational: 0.10,    // Relations are contextual
      probability: 0.05,   // Probability is derived
      energy: 0.10,        // Energy affects activation
      coherence: 0.05      // Coherence is emergent
    };
    return weights[dimension] || 0.1;
  }
  
  /**
   * Calculate distance penalty for skip-trace connections
   * Allows non-linear jumps but with decreasing probability
   */
  calculateDistancePenalty(other) {
    // In a real implementation, this would consider token positions
    // For now, return a simulated penalty
    return 0.8 + Math.random() * 0.2;
  }
  
  /**
   * Add a skip-trace connection to another token
   */
  addConnection(token, strength) {
    this.connections.push({
      token: token,
      strength: strength,
      timestamp: Date.now()
    });
    
    // Update relational dimension based on connections
    this.dimensions.relational = Math.min(1.0, 
      this.dimensions.relational + strength * 0.1
    );
  }
  
  /**
   * Get the strongest connections for skip-tracing
   */
  getStrongestConnections(n = 3) {
    return this.connections
      .sort((a, b) => b.strength - a.strength)
      .slice(0, n);
  }
  
  /**
   * Create a string representation of the token's state
   */
  toString() {
    const dims = Object.entries(this.dimensions)
      .map(([k, v]) => `${k}: ${v.toFixed(3)}`)
      .join(', ');
    return `${this.surface} [${this.universal}] {${dims}}`;
  }
  
  /**
   * Create a compact representation for visualization
   */
  toCompact() {
    return {
      text: this.surface,
      type: this.universal,
      dims: this.dimensions,
      resonance: this.resonance,
      connections: this.connections.length
    };
  }
}