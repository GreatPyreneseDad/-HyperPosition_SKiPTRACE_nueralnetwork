/**
 * Demonstration of Emotional Hyperposition in HSTNN
 */

import chalk from 'chalk';
import { EmotionalHyperpositionToken, EmotionalSkipTraceEngine, EmotionalBasis } from './core/EmotionalHyperposition.js';

console.log(chalk.cyan('\n=== Emotional Hyperposition Demo ===\n'));

// Demo 1: Emotional Superposition
console.log(chalk.yellow('1. Emotional Superposition States'));
console.log(chalk.gray('Creating token with multiple simultaneous emotions...\n'));

const token = new EmotionalHyperpositionToken('remembered', 'ACTION');

// Add multiple emotional components
token.addEmotionalComponent('joy', 0.7, 0);        // Positive memory
token.addEmotionalComponent('grief', 0.7, Math.PI); // Loss - opposing phase

console.log('Emotional components:');
console.log('  Joy: weight=0.7, phase=0');
console.log('  Grief: weight=0.7, phase=π');
console.log(`\nResulting emotional magnitude: ${token.dimensions.emotional.toFixed(3)}`);
console.log(`Coherence: ${token.emotionalState.coherence.toFixed(3)}`);
console.log(chalk.red('→ Low magnitude despite high weights = Emotional numbness from interference\n'));

// Demo 2: Spin Dynamics
console.log(chalk.yellow('2. Emotional Spin Dynamics'));
console.log(chalk.gray('Tracking emotional state evolution...\n'));

const growthToken = new EmotionalHyperpositionToken('healing', 'ACTION');
growthToken.addEmotionalComponent('fear', 0.3, 0);
growthToken.addEmotionalComponent('hope', 0.8, 0.1); // Slightly shifted phase

const previousCoherence = growthToken.emotionalState.coherence;
growthToken.recalculateSuperposition();
const deltaCoherence = growthToken.emotionalState.coherence - previousCoherence;

const spin = growthToken.calculateSpin(deltaCoherence);
console.log(`Previous coherence: ${previousCoherence.toFixed(3)}`);
console.log(`Current coherence: ${growthToken.emotionalState.coherence.toFixed(3)}`);
console.log(`Spin state: ${spin} (${spin === 1 ? 'Growth' : spin === -1 ? 'Decay' : 'Superposition'})\n`);

// Demo 3: Trauma Processing
console.log(chalk.yellow('3. Trauma Processing Through Phase Alignment'));
console.log(chalk.gray('Detecting and healing opposing emotional states...\n'));

const traumaToken = new EmotionalHyperpositionToken('accident', 'ENTITY');
traumaToken.addEmotionalComponent('fear', 0.9, 0);
traumaToken.addEmotionalComponent('relief', 0.9, Math.PI); // Opposing phase

console.log('Before processing:');
console.log(`  Emotional magnitude: ${traumaToken.dimensions.emotional.toFixed(3)}`);
console.log(`  Coherence: ${traumaToken.emotionalState.coherence.toFixed(3)}`);

const hasTrauma = EmotionalSkipTraceEngine.processTrauma(traumaToken);
console.log(`\nTrauma detected: ${hasTrauma}`);
console.log('After phase alignment:');
console.log(`  Emotional magnitude: ${traumaToken.dimensions.emotional.toFixed(3)}`);
console.log(`  Coherence: ${traumaToken.emotionalState.coherence.toFixed(3)}\n`);

// Demo 4: Emotional Collapse
console.log(chalk.yellow('4. Emotional State Collapse'));
console.log(chalk.gray('Observing superposition collapse through expression...\n'));

const mixedToken = new EmotionalHyperpositionToken('birthday', 'ENTITY');
mixedToken.addEmotionalComponent('joy', 0.6, 0);
mixedToken.addEmotionalComponent('nostalgia', 0.4, Math.PI/2);
mixedToken.addEmotionalComponent('sadness', 0.3, Math.PI);

console.log('Superposition state:');
for (let [emotion, params] of mixedToken.emotionalState.components) {
  console.log(`  ${emotion}: weight=${params.weight.toFixed(2)}`);
}

const collapsed = mixedToken.collapseEmotional('expression');
console.log(`\nCollapsed to: ${chalk.green(collapsed)}`);
console.log(`Emotional dimension: ${mixedToken.dimensions.emotional.toFixed(3)}\n`);

// Demo 5: Emotional Resonance in Skip-Traces
console.log(chalk.yellow('5. Emotional Skip-Trace Resonance'));
console.log(chalk.gray('Calculating emotional connections between tokens...\n'));

const token1 = new EmotionalHyperpositionToken('mother', 'ENTITY');
token1.addEmotionalComponent('love', 0.9, 0);
token1.emotionalSpin = +1;

const token2 = new EmotionalHyperpositionToken('embrace', 'ACTION');
token2.addEmotionalComponent('love', 0.8, 0.1);
token2.addEmotionalComponent('comfort', 0.4, 0);
token2.emotionalSpin = +1;

const token3 = new EmotionalHyperpositionToken('goodbye', 'ACTION');
token3.addEmotionalComponent('grief', 0.7, Math.PI);
token3.addEmotionalComponent('love', 0.5, 0);
token3.emotionalSpin = -1;

console.log('Token emotional states:');
console.log(`  "mother": emotional=${token1.dimensions.emotional.toFixed(2)}, spin=${token1.emotionalSpin}`);
console.log(`  "embrace": emotional=${token2.dimensions.emotional.toFixed(2)}, spin=${token2.emotionalSpin}`);
console.log(`  "goodbye": emotional=${token3.dimensions.emotional.toFixed(2)}, spin=${token3.emotionalSpin}`);

console.log('\nEmotional skip scores:');
console.log(`  mother → embrace: ${EmotionalSkipTraceEngine.emotionalSkipScore(token1, token2).toFixed(3)}`);
console.log(`  embrace → goodbye: ${EmotionalSkipTraceEngine.emotionalSkipScore(token2, token3).toFixed(3)}`);
console.log(`  mother → goodbye: ${EmotionalSkipTraceEngine.emotionalSkipScore(token1, token3).toFixed(3)}`);

console.log(chalk.cyan('\n=== Demo Complete ===\n'));