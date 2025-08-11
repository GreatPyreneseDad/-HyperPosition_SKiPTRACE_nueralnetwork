/**
 * HSTNNProcessor - Main processor that orchestrates the hyperposition neural network
 * Combines universal tokenization, hyperposition states, and skip-trace processing
 */

import { HyperpositionToken } from './HyperpositionToken.js';
import { SkipTraceEngine } from './SkipTraceEngine.js';
import { UniversalTokenLibrary } from './UniversalTokenLibrary.js';

export class HSTNNProcessor {
  constructor(config = {}) {
    this.library = new UniversalTokenLibrary();
    this.config = {
      skipThreshold: config.skipThreshold || 0.3,
      maxTraceLength: config.maxTraceLength || 10,
      branchingFactor: config.branchingFactor || 3,
      resonanceStrength: config.resonanceStrength || 1.0,
      ...config
    };
    
    // Metrics for analysis
    this.metrics = {
      totalTokensProcessed: 0,
      compressionRatio: 0,
      averageCoherence: 0,
      processingTime: 0
    };
  }
  
  /**
   * Process input text through the HSTNN pipeline
   */
  processText(text) {
    const startTime = Date.now();
    
    // Step 1: Tokenize and classify into universal tokens
    const compression = this.library.compress(text);
    
    // Step 2: Create hyperposition tokens
    const hyperTokens = this.createHyperpositionTokens(compression);
    
    // Step 3: Build resonance connections
    this.buildResonanceConnections(hyperTokens);
    
    // Step 4: Apply context to collapse states
    const context = this.analyzeContext(text);
    hyperTokens.forEach(token => token.collapse(context));
    
    // Step 5: Generate skip traces
    const engine = new SkipTraceEngine(hyperTokens, this.config.skipThreshold);
    const traces = engine.generateTraces();
    
    // Update metrics
    this.updateMetrics(compression, traces, Date.now() - startTime);
    
    return {
      original: text,
      compression: compression,
      hyperTokens: hyperTokens,
      traces: traces,
      bestTrace: engine.getBestTrace(),
      coherentTraces: engine.getCoherentTraces(),
      metrics: this.metrics
    };
  }
  
  /**
   * Create hyperposition tokens from compressed representation
   */
  createHyperpositionTokens(compression) {
    const hyperTokens = [];
    
    for (const token of compression.tokens) {
      const hyperToken = new HyperpositionToken(
        token.surface,
        token.universal
      );
      
      // Adjust initial dimensions based on token type
      this.adjustInitialDimensions(hyperToken, token);
      
      hyperTokens.push(hyperToken);
    }
    
    return hyperTokens;
  }
  
  /**
   * Adjust token dimensions based on its universal type and transform
   */
  adjustInitialDimensions(hyperToken, tokenInfo) {
    const adjustments = {
      'ENTITY': {
        semantic: 1.2,
        relational: 1.1,
        probability: 0.9
      },
      'ACTION': {
        temporal: 1.3,
        causal: 1.2,
        energy: 1.2
      },
      'RELATION': {
        causal: 1.4,
        relational: 1.5,
        coherence: 1.1
      },
      'STATE': {
        emotional: 1.3,
        temporal: 0.8,
        probability: 1.1
      },
      'MODIFIER': {
        semantic: 0.8,
        energy: 0.7,
        coherence: 1.2
      }
    };
    
    const typeAdjustments = adjustments[tokenInfo.universal] || {};
    
    for (const [dim, factor] of Object.entries(typeAdjustments)) {
      hyperToken.dimensions[dim] *= factor;
    }
    
    hyperToken.normalizeDimensions();
  }
  
  /**
   * Build resonance connections between tokens
   */
  buildResonanceConnections(hyperTokens) {
    const n = hyperTokens.length;
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const resonance = hyperTokens[i].resonanceWith(hyperTokens[j]);
        
        // Apply resonance strength multiplier
        const adjustedResonance = resonance * this.config.resonanceStrength;
        
        // Create bidirectional connections for strong resonance
        if (adjustedResonance > 0.5) {
          hyperTokens[i].addConnection(hyperTokens[j], adjustedResonance);
          hyperTokens[j].addConnection(hyperTokens[i], adjustedResonance);
        }
      }
    }
  }
  
  /**
   * Analyze context to determine collapse weights
   */
  analyzeContext(text) {
    const context = {
      hasTemporalMarkers: false,
      hasCausalMarkers: false,
      hasEmotionalContent: false,
      isQuestion: false
    };
    
    // Simple pattern matching for context detection
    const temporalPatterns = /\b(when|before|after|during|while|then|now|yesterday|tomorrow)\b/i;
    const causalPatterns = /\b(because|therefore|thus|so|cause|effect|result)\b/i;
    const emotionalPatterns = /\b(feel|felt|happy|sad|angry|love|hate|fear|joy)\b/i;
    const questionPatterns = /\?|^(who|what|where|when|why|how)\b/i;
    
    context.hasTemporalMarkers = temporalPatterns.test(text);
    context.hasCausalMarkers = causalPatterns.test(text);
    context.hasEmotionalContent = emotionalPatterns.test(text);
    context.isQuestion = questionPatterns.test(text);
    
    return context;
  }
  
  /**
   * Update processing metrics
   */
  updateMetrics(compression, traces, processingTime) {
    this.metrics.totalTokensProcessed += compression.tokens.length;
    this.metrics.compressionRatio = compression.compressionRatio;
    this.metrics.processingTime = processingTime;
    
    // Calculate average coherence
    if (traces.length > 0) {
      const totalCoherence = traces.reduce((sum, trace) => sum + trace.coherence, 0);
      this.metrics.averageCoherence = totalCoherence / traces.length;
    }
  }
  
  /**
   * Visualize the processing results
   */
  visualize(result) {
    const output = [];
    
    output.push('\n=== HSTNN Processing Results ===\n');
    output.push(`Original: "${result.original}"`);
    output.push(`\nCompression: ${(1 - result.compression.compressionRatio) * 100}% reduction`);
    
    // Show universal tokens
    output.push('\nUniversal Tokens:');
    result.compression.tokens.forEach(token => {
      output.push(`  ${token.surface} → [${token.universal}.${token.transform}]`);
    });
    
    // Show best trace
    if (result.bestTrace) {
      output.push('\nBest Skip-Trace:');
      const path = result.bestTrace.path
        .map(t => `[${t.surface}]`)
        .join(' → ');
      output.push(`  ${path}`);
      output.push(`  Coherence: ${result.bestTrace.coherence.toFixed(3)}`);
    }
    
    // Show alternative traces
    if (result.coherentTraces.length > 1) {
      output.push('\nAlternative Interpretations:');
      result.coherentTraces.slice(1, 4).forEach((trace, i) => {
        const path = trace.path
          .map(t => t.surface)
          .join(' → ');
        output.push(`  ${i + 2}. ${path} (${trace.coherence.toFixed(3)})`);
      });
    }
    
    // Show metrics
    output.push('\nMetrics:');
    output.push(`  Processing Time: ${result.metrics.processingTime}ms`);
    output.push(`  Average Coherence: ${result.metrics.averageCoherence.toFixed(3)}`);
    output.push(`  Tokens Processed: ${result.metrics.totalTokensProcessed}`);
    
    return output.join('\n');
  }
  
  /**
   * Compare two texts using HSTNN analysis
   */
  compareTexts(text1, text2) {
    const result1 = this.processText(text1);
    const result2 = this.processText(text2);
    
    // Compare universal token patterns
    const pattern1 = result1.compression.tokens.map(t => t.universal).join('-');
    const pattern2 = result2.compression.tokens.map(t => t.universal).join('-');
    const patternSimilarity = pattern1 === pattern2 ? 1.0 : this.calculatePatternSimilarity(pattern1, pattern2);
    
    // Compare best traces
    let traceSimilarity = 0;
    if (result1.bestTrace && result2.bestTrace) {
      traceSimilarity = this.calculateTraceSimilarity(
        result1.bestTrace.path,
        result2.bestTrace.path
      );
    }
    
    // Compare coherence
    const coherenceDiff = Math.abs(
      result1.metrics.averageCoherence - result2.metrics.averageCoherence
    );
    
    return {
      text1: text1,
      text2: text2,
      patternSimilarity: patternSimilarity,
      traceSimilarity: traceSimilarity,
      coherenceDifference: coherenceDiff,
      interpretation: this.interpretComparison(patternSimilarity, traceSimilarity, coherenceDiff)
    };
  }
  
  /**
   * Calculate similarity between two patterns
   */
  calculatePatternSimilarity(pattern1, pattern2) {
    const tokens1 = pattern1.split('-');
    const tokens2 = pattern2.split('-');
    
    let matches = 0;
    const maxLength = Math.max(tokens1.length, tokens2.length);
    
    for (let i = 0; i < Math.min(tokens1.length, tokens2.length); i++) {
      if (tokens1[i] === tokens2[i]) matches++;
    }
    
    return matches / maxLength;
  }
  
  /**
   * Calculate similarity between two trace paths
   */
  calculateTraceSimilarity(path1, path2) {
    const types1 = path1.map(t => t.universal);
    const types2 = path2.map(t => t.universal);
    
    // Use longest common subsequence approach
    const lcs = this.longestCommonSubsequence(types1, types2);
    const maxLength = Math.max(types1.length, types2.length);
    
    return maxLength > 0 ? lcs / maxLength : 0;
  }
  
  /**
   * Calculate longest common subsequence length
   */
  longestCommonSubsequence(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    return dp[m][n];
  }
  
  /**
   * Interpret comparison results
   */
  interpretComparison(patternSim, traceSim, coherenceDiff) {
    if (patternSim > 0.8 && traceSim > 0.7 && coherenceDiff < 0.1) {
      return 'Very similar - likely expressing the same concept';
    } else if (patternSim > 0.6 || traceSim > 0.6) {
      return 'Moderately similar - related concepts with different expression';
    } else if (patternSim > 0.3 || traceSim > 0.3) {
      return 'Somewhat related - share some conceptual elements';
    } else {
      return 'Different - expressing distinct concepts';
    }
  }
}