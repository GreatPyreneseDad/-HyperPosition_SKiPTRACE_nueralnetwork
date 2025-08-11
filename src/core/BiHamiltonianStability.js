/**
 * Bi-Hamiltonian Stability System for HSTNN
 * Implements dual energy systems for preventing coherence collapse
 */

import { EmotionalHyperpositionToken } from './EmotionalHyperposition.js';

export class BiHamiltonianToken extends EmotionalHyperpositionToken {
  constructor(surface, universal) {
    super(surface, universal);
    
    // Dual Hamiltonian system
    this.H1_coherence = 0;    // How well things fit together
    this.H2_structure = 0;    // Whether the structure is sound
    
    // Fourth-order dynamics tracking
    this.derivatives = {
      position: 0,      // Ψ
      velocity: 0,      // dΨ/dt
      acceleration: 0,  // d²Ψ/dt²
      jerk: 0,         // d³Ψ/dt³
      snap: 0          // d⁴Ψ/dt⁴
    };
    
    // Stability threshold
    this.divergenceThreshold = 0.3;
    
    this.updateHamiltonians();
  }
  
  /**
   * Calculate coherence energy (H1) - how well components align
   */
  calculateCoherenceEnergy() {
    let coherence = 0;
    
    // Sum coherence across all dimensions
    for (let dim in this.dimensions) {
      coherence += this.dimensions[dim] * this.dimensions[dim];
    }
    
    // Add emotional coherence if present
    if (this.emotionalState) {
      coherence += this.emotionalState.coherence;
    }
    
    return Math.sqrt(coherence);
  }
  
  /**
   * Calculate structural energy (H2) - internal consistency
   */
  calculateStructuralEnergy() {
    // Check dimensional balance
    const values = Object.values(this.dimensions);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Low variance = high structural integrity
    const structure = 1 / (1 + variance);
    
    // Add emotional structural check
    if (this.emotionalState && this.emotionalState.components.size > 0) {
      const emotionalStructure = this.checkEmotionalStructure();
      return (structure + emotionalStructure) / 2;
    }
    
    return structure;
  }
  
  /**
   * Check for opposing emotional phases (structural weakness)
   */
  checkEmotionalStructure() {
    const components = Array.from(this.emotionalState.components.values());
    let oppositionCount = 0;
    
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const phaseDiff = Math.abs(components[i].phase - components[j].phase);
        if (Math.abs(phaseDiff - Math.PI) < 0.1) {
          oppositionCount++;
        }
      }
    }
    
    // More opposition = less structure
    return 1 / (1 + oppositionCount);
  }
  
  /**
   * Update both Hamiltonians
   */
  updateHamiltonians() {
    const prevH1 = this.H1_coherence;
    const prevH2 = this.H2_structure;
    
    this.H1_coherence = this.calculateCoherenceEnergy();
    this.H2_structure = this.calculateStructuralEnergy();
    
    // Update derivatives for fourth-order dynamics
    this.updateDerivatives(prevH1, prevH2);
  }
  
  /**
   * Track fourth-order dynamics
   */
  updateDerivatives(prevH1, prevH2) {
    const dt = 0.1; // Time step
    
    // Update position (average of both Hamiltonians)
    const prevPosition = this.derivatives.position;
    this.derivatives.position = (this.H1_coherence + this.H2_structure) / 2;
    
    // Update velocity
    const prevVelocity = this.derivatives.velocity;
    this.derivatives.velocity = (this.derivatives.position - prevPosition) / dt;
    
    // Update acceleration
    const prevAcceleration = this.derivatives.acceleration;
    this.derivatives.acceleration = (this.derivatives.velocity - prevVelocity) / dt;
    
    // Update jerk (sudden changes)
    const prevJerk = this.derivatives.jerk;
    this.derivatives.jerk = (this.derivatives.acceleration - prevAcceleration) / dt;
    
    // Update snap (rate of jerk change)
    this.derivatives.snap = (this.derivatives.jerk - prevJerk) / dt;
  }
  
  /**
   * Check if systems are diverging (ghost state emerging)
   */
  checkDivergence() {
    const divergence = Math.abs(this.H1_coherence - this.H2_structure);
    
    if (divergence > this.divergenceThreshold) {
      return {
        warning: 'GHOST_STATE_EMERGING',
        divergence: divergence,
        H1: this.H1_coherence,
        H2: this.H2_structure,
        recommendation: this.H1_coherence > this.H2_structure 
          ? 'Strengthen structure' 
          : 'Increase coherence'
      };
    }
    
    return null;
  }
  
  /**
   * Check stability using both Hamiltonians
   */
  isStable() {
    const divergence = Math.abs(this.H1_coherence - this.H2_structure);
    const highJerk = Math.abs(this.derivatives.jerk) > 1.0;
    const highSnap = Math.abs(this.derivatives.snap) > 2.0;
    
    return divergence < this.divergenceThreshold && !highJerk && !highSnap;
  }
  
  /**
   * Attempt to restore stability
   */
  stabilize() {
    if (this.H1_coherence > this.H2_structure) {
      // Too much coherence, not enough structure
      this.strengthenStructure();
    } else {
      // Too rigid, needs more coherence
      this.increaseCoherence();
    }
    
    this.updateHamiltonians();
  }
  
  /**
   * Strengthen structural integrity
   */
  strengthenStructure() {
    // Balance dimensions
    const mean = Object.values(this.dimensions).reduce((a, b) => a + b) / 8;
    for (let dim in this.dimensions) {
      this.dimensions[dim] = this.dimensions[dim] * 0.7 + mean * 0.3;
    }
    
    // Align emotional phases if present
    if (this.emotionalState) {
      for (let [emotion, params] of this.emotionalState.components) {
        params.phase *= 0.8; // Reduce phase differences
      }
    }
  }
  
  /**
   * Increase coherence flow
   */
  increaseCoherence() {
    // Amplify strongest dimension
    let maxDim = null;
    let maxVal = 0;
    
    for (let dim in this.dimensions) {
      if (this.dimensions[dim] > maxVal) {
        maxVal = this.dimensions[dim];
        maxDim = dim;
      }
    }
    
    if (maxDim) {
      this.dimensions[maxDim] *= 1.2;
      this.normalizeDimensions();
    }
  }
}

/**
 * Ghost State Detector - Predicts identity/coherence collapse
 */
export class GhostStateDetector {
  constructor() {
    this.criticalDivergence = 0.5;
    this.warningDivergence = 0.3;
  }
  
  /**
   * Analyze token for ghost state emergence
   */
  analyze(token) {
    if (!(token instanceof BiHamiltonianToken)) {
      throw new Error('Token must be BiHamiltonianToken');
    }
    
    const divergence = Math.abs(token.H1_coherence - token.H2_structure);
    const jerk = Math.abs(token.derivatives.jerk);
    const snap = Math.abs(token.derivatives.snap);
    
    // Calculate collapse risk
    const risk = divergence * (1 + jerk * 0.3 + snap * 0.1);
    
    return {
      divergence: divergence,
      jerk: jerk,
      snap: snap,
      risk: risk,
      status: risk > this.criticalDivergence ? 'CRITICAL' :
              risk > this.warningDivergence ? 'WARNING' : 'STABLE',
      timeToCollapse: risk > this.warningDivergence ? 
        this.estimateCollapseTime(risk, jerk) : null
    };
  }
  
  /**
   * Estimate time until collapse based on current dynamics
   */
  estimateCollapseTime(risk, jerk) {
    // Higher jerk means faster approach to collapse
    const baseTime = (this.criticalDivergence - risk) / (jerk + 0.1);
    return Math.max(0, baseTime);
  }
  
  /**
   * Suggest intervention based on analysis
   */
  suggestIntervention(analysis, token) {
    if (analysis.status === 'STABLE') return null;
    
    const interventions = [];
    
    if (token.H1_coherence > token.H2_structure) {
      interventions.push({
        type: 'STRENGTHEN_STRUCTURE',
        urgency: analysis.status === 'CRITICAL' ? 'IMMEDIATE' : 'SOON',
        methods: ['Balance dimensions', 'Align emotional phases', 'Reduce variation']
      });
    } else {
      interventions.push({
        type: 'INCREASE_COHERENCE',
        urgency: analysis.status === 'CRITICAL' ? 'IMMEDIATE' : 'SOON',
        methods: ['Amplify core dimensions', 'Express emotions', 'Find flow states']
      });
    }
    
    if (analysis.jerk > 1.0) {
      interventions.push({
        type: 'REDUCE_JERK',
        urgency: 'IMMEDIATE',
        methods: ['Slow down changes', 'Gradual transitions', 'Avoid sudden shifts']
      });
    }
    
    return interventions;
  }
}

/**
 * Therapeutic stabilizer using dual Hamiltonian approach
 */
export class TherapeuticStabilizer {
  /**
   * Apply intervention that helps both systems
   */
  applyDualIntervention(token) {
    const analysis = new GhostStateDetector().analyze(token);
    
    if (analysis.status === 'STABLE') return { success: true, message: 'Already stable' };
    
    // Find intervention that improves both H1 and H2
    const beforeH1 = token.H1_coherence;
    const beforeH2 = token.H2_structure;
    
    // Try gentle balancing first
    this.gentleBalance(token);
    token.updateHamiltonians();
    
    // Check if both improved
    const afterH1 = token.H1_coherence;
    const afterH2 = token.H2_structure;
    
    const h1Improved = afterH1 >= beforeH1;
    const h2Improved = afterH2 >= beforeH2;
    const divergenceReduced = Math.abs(afterH1 - afterH2) < Math.abs(beforeH1 - beforeH2);
    
    return {
      success: h1Improved && h2Improved && divergenceReduced,
      beforeH1, afterH1,
      beforeH2, afterH2,
      message: divergenceReduced ? 'Systems converging' : 'Further intervention needed'
    };
  }
  
  /**
   * Gentle balancing that helps both systems
   */
  gentleBalance(token) {
    // Slightly balance dimensions (helps H2)
    const dims = Object.values(token.dimensions);
    const mean = dims.reduce((a, b) => a + b) / dims.length;
    
    for (let dim in token.dimensions) {
      token.dimensions[dim] = token.dimensions[dim] * 0.9 + mean * 0.1;
    }
    
    // Slightly amplify highest dimension (helps H1)
    let maxDim = Object.keys(token.dimensions).reduce((a, b) => 
      token.dimensions[a] > token.dimensions[b] ? a : b
    );
    token.dimensions[maxDim] *= 1.05;
    
    // Normalize to maintain valid state
    token.normalizeDimensions();
    
    // If emotional, gently align phases
    if (token.emotionalState) {
      for (let [emotion, params] of token.emotionalState.components) {
        params.phase *= 0.95;
      }
      token.recalculateSuperposition();
    }
  }
}