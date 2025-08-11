/**
 * HSTNN Interactive Demo
 * Demonstrates the hyperposition skip-trace neural network in action
 */

import chalk from 'chalk';
import { HSTNNProcessor } from './core/HSTNNProcessor.js';
import { HyperpositionToken } from './core/HyperpositionToken.js';

// Example sentences for demonstration
const EXAMPLES = [
  "The boy ran because he was scared of the dog",
  "She remembered her grandmother's voice",
  "I was terrified when the storm hit",
  "The rain fell because clouds formed",
  "Fear makes people do strange things",
  "Love conquers all obstacles eventually"
];

class HSTNNDemo {
  constructor() {
    this.processor = new HSTNNProcessor({
      skipThreshold: 0.3,
      maxTraceLength: 10,
      branchingFactor: 3,
      resonanceStrength: 1.2
    });
  }
  
  /**
   * Run the main demo
   */
  run() {
    console.clear();
    this.printHeader();
    
    // Demo 1: Basic processing
    this.demoBasicProcessing();
    
    // Demo 2: Compression efficiency
    this.demoCompression();
    
    // Demo 3: Skip-trace patterns
    this.demoSkipTraces();
    
    // Demo 4: Emotional resonance
    this.demoEmotionalResonance();
    
    // Demo 5: Causal analysis
    this.demoCausalAnalysis();
    
    // Demo 6: Text comparison
    this.demoTextComparison();
    
    this.printFooter();
  }
  
  /**
   * Print demo header
   */
  printHeader() {
    console.log(chalk.cyan('╔════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('   HYPERPOSITION SKIP-TRACE NEURAL NETWORK (HSTNN)     ') + chalk.cyan('║'));
    console.log(chalk.cyan('║') + chalk.gray('      Biologically-Inspired Language Processing         ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════╝'));
    console.log();
  }
  
  /**
   * Demo basic text processing
   */
  demoBasicProcessing() {
    console.log(chalk.green.bold('\n📊 DEMO 1: Basic Text Processing'));
    console.log(chalk.gray('━'.repeat(50)));
    
    const text = EXAMPLES[0];
    const result = this.processor.processText(text);
    
    console.log(this.processor.visualize(result));
  }
  
  /**
   * Demo compression efficiency
   */
  demoCompression() {
    console.log(chalk.green.bold('\n📦 DEMO 2: Compression Efficiency'));
    console.log(chalk.gray('━'.repeat(50)));
    
    for (const example of EXAMPLES.slice(0, 3)) {
      const result = this.processor.processText(example);
      const original = example.split(/\s+/).length;
      const compressed = result.compression.tokens.length;
      const ratio = ((original - compressed) / original * 100).toFixed(1);
      
      console.log(`\nOriginal: "${example}"`);
      console.log(`Tokens: ${original} → ${compressed} (${ratio}% reduction)`);
      console.log('Universal pattern:', 
        result.compression.tokens
          .map(t => chalk.blue(`[${t.universal}]`))
          .join(' ')
      );
    }
  }
  
  /**
   * Demo skip-trace patterns
   */
  demoSkipTraces() {
    console.log(chalk.green.bold('\n🔀 DEMO 3: Skip-Trace Patterns'));
    console.log(chalk.gray('━'.repeat(50)));
    
    const text = "She remembered her grandmother's voice";
    const result = this.processor.processText(text);
    
    console.log(`\nInput: "${text}"`);
    console.log('\nTraditional: Linear progression through 5 tokens');
    console.log('HSTNN Traces:');
    
    const traces = result.traces.slice(0, 3);
    traces.forEach((trace, i) => {
      const path = trace.path.map(t => chalk.yellow(t.surface)).join(' → ');
      const pattern = trace.path
        .map(t => `${t.universal}`)
        .join('-');
      console.log(`  ${i + 1}. ${path}`);
      console.log(`     Pattern: ${chalk.gray(pattern)} | Coherence: ${chalk.green(trace.coherence.toFixed(3))}`);
    });
  }
  
  /**
   * Demo emotional resonance mapping
   */
  demoEmotionalResonance() {
    console.log(chalk.green.bold('\n💗 DEMO 4: Emotional Resonance Mapping'));
    console.log(chalk.gray('━'.repeat(50)));
    
    const emotionalText = "I was terrified when the storm hit";
    const result = this.processor.processText(emotionalText);
    
    console.log(`\nInput: "${emotionalText}"`);
    console.log('\nEmotional Dimensions:');
    
    result.hyperTokens.forEach(token => {
      const emotionalValue = token.dimensions.emotional;
      const bar = '█'.repeat(Math.floor(emotionalValue * 20));
      const color = emotionalValue > 0.7 ? chalk.red : 
                    emotionalValue > 0.4 ? chalk.yellow : 
                    chalk.green;
      
      console.log(`  ${token.surface.padEnd(10)} ${color(bar)} ${(emotionalValue * 100).toFixed(0)}%`);
    });
    
    // Show emotional skip traces
    const emotionalTraces = result.traces
      .filter(trace => {
        const avgEmotion = trace.path.reduce((sum, token) => 
          sum + token.dimensions.emotional, 0) / trace.path.length;
        return avgEmotion > 0.6;
      })
      .slice(0, 2);
    
    if (emotionalTraces.length > 0) {
      console.log('\nHigh-emotion skip traces:');
      emotionalTraces.forEach(trace => {
        const path = trace.path.map(t => t.surface).join(' → ');
        console.log(`  ${chalk.red(path)}`);
      });
    }
  }
  
  /**
   * Demo causal chain analysis
   */
  demoCausalAnalysis() {
    console.log(chalk.green.bold('\n⚡ DEMO 5: Causal Chain Analysis'));
    console.log(chalk.gray('━'.repeat(50)));
    
    const causalText = "The rain fell because clouds formed";
    const result = this.processor.processText(causalText);
    
    console.log(`\nInput: "${causalText}"`);
    console.log('\nCausal Dimensions:');
    
    // Show causal values
    result.hyperTokens.forEach(token => {
      const causalValue = token.dimensions.causal;
      const bar = '▸'.repeat(Math.floor(causalValue * 15));
      console.log(`  ${token.surface.padEnd(10)} ${chalk.blue(bar)} ${(causalValue * 100).toFixed(0)}%`);
    });
    
    // Find strong causal connections
    console.log('\nCausal skip connections:');
    result.hyperTokens.forEach((token, i) => {
      token.connections
        .filter(conn => {
          const targetToken = conn.token;
          return targetToken.dimensions.causal > 0.5 && 
                 token.dimensions.causal > 0.5;
        })
        .forEach(conn => {
          console.log(`  ${chalk.yellow(token.surface)} → ${chalk.yellow(conn.token.surface)} (strength: ${conn.strength.toFixed(2)})`);
        });
    });
  }
  
  /**
   * Demo text comparison
   */
  demoTextComparison() {
    console.log(chalk.green.bold('\n🔍 DEMO 6: Text Comparison'));
    console.log(chalk.gray('━'.repeat(50)));
    
    const pairs = [
      ["Fear makes people do strange things", "People do odd things when afraid"],
      ["The boy ran because he was scared", "The child fled in fear"],
      ["Love conquers all obstacles", "Money solves every problem"]
    ];
    
    pairs.forEach(([text1, text2]) => {
      const comparison = this.processor.compareTexts(text1, text2);
      
      console.log(`\nComparing:`);
      console.log(`  1: "${text1}"`);
      console.log(`  2: "${text2}"`);
      console.log(`\nSimilarity Metrics:`);
      console.log(`  Pattern similarity: ${(comparison.patternSimilarity * 100).toFixed(0)}%`);
      console.log(`  Trace similarity: ${(comparison.traceSimilarity * 100).toFixed(0)}%`);
      console.log(`  Coherence difference: ${comparison.coherenceDifference.toFixed(3)}`);
      console.log(`  ${chalk.cyan('→')} ${comparison.interpretation}`);
    });
  }
  
  /**
   * Print demo footer
   */
  printFooter() {
    console.log('\n' + chalk.gray('─'.repeat(60)));
    console.log(chalk.gray('HSTNN Demo Complete - Exploring non-sequential language processing'));
    console.log(chalk.gray('GitHub: https://github.com/GreatPyreneseDad/-HyperPosition_SKiPTRACE_nueralnetwork'));
  }
}

// Run the demo
const demo = new HSTNNDemo();
demo.run();