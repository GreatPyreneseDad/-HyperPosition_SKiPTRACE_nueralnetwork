/**
 * Emotional Hyperposition Extension for HSTNN
 * Core implementation of quantum emotional states
 */

import { HyperpositionToken } from './HyperpositionToken.js';

export class EmotionalHyperpositionToken extends HyperpositionToken {
  constructor(surface, universal) {
    super(surface, universal);
    
    // Emotional superposition state
    this.emotionalState = {
      components: new Map(), // emotion -> {weight, phase, frequency}
      collapsed: false,
      coherence: 0
    };
    
    // Spin state for emotional dynamics
    this.emotionalSpin = 0; // -1 (decay), 0 (superposition), +1 (growth)
  }
  
  /**
   * Add emotional component with phase and frequency
   * Creates interference patterns when phases oppose
   */
  addEmotionalComponent(emotion, weight, phase = 0) {
    this.emotionalState.components.set(emotion, {
      weight: weight,
      phase: phase,
      timestamp: Date.now()
    });
    this.recalculateSuperposition();
  }
  
  /**
   * Recalculate emotional superposition using wave mechanics
   * Opposing phases create interference (numbness)
   */
  recalculateSuperposition() {
    let total = {real: 0, imaginary: 0};
    
    // Calculate wave interference
    for (let [emotion, params] of this.emotionalState.components) {
      total.real += params.weight * Math.cos(params.phase);
      total.imaginary += params.weight * Math.sin(params.phase);
    }
    
    // Magnitude = emotional intensity
    const magnitude = Math.sqrt(total.real**2 + total.imaginary**2);
    this.dimensions.emotional = magnitude;
    
    // Low magnitude with multiple components = interference/numbness
    const numComponents = this.emotionalState.components.size;
    if (numComponents > 1 && magnitude < 0.3) {
      this.emotionalState.coherence = 0; // Destructive interference
    } else {
      this.emotionalState.coherence = magnitude / numComponents;
    }
  }
  
  /**
   * Calculate emotional spin based on coherence changes
   */
  calculateSpin(deltaCoherence) {
    // Growth spin: positive coherence change
    if (deltaCoherence > 0.1) {
      this.emotionalSpin = +1;
    }
    // Decay spin: negative coherence change
    else if (deltaCoherence < -0.1) {
      this.emotionalSpin = -1;
    }
    // Superposition: stable or conflicted
    else {
      this.emotionalSpin = 0;
    }
    
    return this.emotionalSpin;
  }
  
  /**
   * Collapse emotional superposition through observation
   */
  collapseEmotional(trigger = 'expression') {
    if (this.emotionalState.collapsed) return;
    
    // Find dominant emotion by weight
    let maxWeight = 0;
    let dominantEmotion = null;
    
    for (let [emotion, params] of this.emotionalState.components) {
      if (params.weight > maxWeight) {
        maxWeight = params.weight;
        dominantEmotion = emotion;
      }
    }
    
    // Collapse to single state
    this.emotionalState.components.clear();
    this.emotionalState.components.set(dominantEmotion, {
      weight: 1,
      phase: 0,
      timestamp: Date.now()
    });
    
    this.emotionalState.collapsed = true;
    this.dimensions.emotional = 1;
    
    return dominantEmotion;
  }
}

/**
 * Enhanced Skip-Trace Engine with emotional spin dynamics
 */
export class EmotionalSkipTraceEngine {
  /**
   * Calculate skip score with emotional resonance
   */
  static emotionalSkipScore(from, to) {
    // Emotional resonance between tokens
    const emotionalDiff = Math.abs(from.dimensions.emotional - to.dimensions.emotional);
    const emotionalResonance = 1 - emotionalDiff;
    
    // Spin alignment bonus
    let spinBonus = 0;
    if (from.emotionalSpin && to.emotionalSpin) {
      spinBonus = from.emotionalSpin === to.emotionalSpin ? 0.2 : -0.1;
    }
    
    return emotionalResonance + spinBonus;
  }
  
  /**
   * Process trauma through phase alignment
   */
  static processTrauma(token) {
    const components = token.emotionalState.components;
    
    // Find opposing phases (trauma signature)
    let hasOpposition = false;
    for (let [e1, p1] of components) {
      for (let [e2, p2] of components) {
        if (Math.abs(p1.phase - p2.phase - Math.PI) < 0.1) {
          hasOpposition = true;
          break;
        }
      }
    }
    
    if (hasOpposition) {
      // Gradually align phases
      for (let [emotion, params] of components) {
        params.phase *= 0.9; // Reduce phase offset
      }
      token.recalculateSuperposition();
    }
    
    return hasOpposition;
  }
}

/**
 * Emotional basis states
 */
export const EmotionalBasis = {
  primary: ['joy', 'grief', 'rage', 'fear', 'disgust', 'surprise'],
  complex: ['shame', 'guilt', 'pride', 'gratitude'],
  meta: ['numbness', 'yearning', 'presence']
};