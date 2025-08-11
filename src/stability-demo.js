/**
 * Demonstration of Bi-Hamiltonian Stability System
 * Shows how dual energy systems prevent coherence collapse
 */

import chalk from 'chalk';
import { BiHamiltonianToken, GhostStateDetector, TherapeuticStabilizer } from './core/BiHamiltonianStability.js';

console.log(chalk.cyan('\n=== Bi-Hamiltonian Stability Demo ===\n'));

// Demo 1: Stable vs Unstable States
console.log(chalk.yellow('1. Dual System Balance'));
console.log(chalk.gray('Comparing stable and unstable configurations...\n'));

// Create a balanced token
const stableToken = new BiHamiltonianToken('peace', 'STATE');
stableToken.addEmotionalComponent('calm', 0.7, 0);
stableToken.addEmotionalComponent('content', 0.6, 0.2);
stableToken.updateHamiltonians();

console.log('Stable Token:');
console.log(`  H1 (Coherence): ${stableToken.H1_coherence.toFixed(3)}`);
console.log(`  H2 (Structure): ${stableToken.H2_structure.toFixed(3)}`);
console.log(`  Divergence: ${Math.abs(stableToken.H1_coherence - stableToken.H2_structure).toFixed(3)}`);
console.log(`  Stable: ${stableToken.isStable() ? chalk.green('YES') : chalk.red('NO')}\n`);

// Create an unstable token (opposing emotions)
const unstableToken = new BiHamiltonianToken('conflict', 'STATE');
unstableToken.addEmotionalComponent('love', 0.9, 0);
unstableToken.addEmotionalComponent('hate', 0.9, Math.PI); // Opposing phase
unstableToken.updateHamiltonians();

console.log('Unstable Token:');
console.log(`  H1 (Coherence): ${unstableToken.H1_coherence.toFixed(3)}`);
console.log(`  H2 (Structure): ${unstableToken.H2_structure.toFixed(3)}`);
console.log(`  Divergence: ${Math.abs(unstableToken.H1_coherence - unstableToken.H2_structure).toFixed(3)}`);
console.log(`  Stable: ${unstableToken.isStable() ? chalk.green('YES') : chalk.red('NO')}`);

// Demo 2: Ghost State Detection
console.log(chalk.yellow('\n2. Ghost State Detection'));
console.log(chalk.gray('Detecting divergence that predicts collapse...\n'));

const detector = new GhostStateDetector();
const analysis = detector.analyze(unstableToken);

console.log('Ghost State Analysis:');
console.log(`  Divergence: ${analysis.divergence.toFixed(3)}`);
console.log(`  Jerk: ${analysis.jerk.toFixed(3)} (sudden changes)`);
console.log(`  Snap: ${analysis.snap.toFixed(3)} (acceleration of jerk)`);
console.log(`  Risk Level: ${analysis.risk.toFixed(3)}`);
console.log(`  Status: ${
  analysis.status === 'CRITICAL' ? chalk.red(analysis.status) :
  analysis.status === 'WARNING' ? chalk.yellow(analysis.status) :
  chalk.green(analysis.status)
}`);

if (analysis.timeToCollapse !== null) {
  console.log(`  ${chalk.red(`Estimated time to collapse: ${analysis.timeToCollapse.toFixed(2)} units`)}`);
}

// Demo 3: Fourth-Order Dynamics
console.log(chalk.yellow('\n3. Fourth-Order Dynamics Tracking'));
console.log(chalk.gray('Monitoring acceleration and jerk in coherence changes...\n'));

// Simulate rapid emotional changes
const dynamicToken = new BiHamiltonianToken('crisis', 'STATE');

console.log('Simulating rapid emotional shifts:');
const emotions = [
  { name: 'panic', weight: 0.9, phase: 0 },
  { name: 'calm', weight: 0.3, phase: Math.PI/2 },
  { name: 'anger', weight: 0.8, phase: Math.PI }
];

for (let i = 0; i < emotions.length; i++) {
  const emotion = emotions[i];
  dynamicToken.addEmotionalComponent(emotion.name, emotion.weight, emotion.phase);
  dynamicToken.updateHamiltonians();
  
  console.log(`\nAfter adding ${emotion.name}:`);
  console.log(`  Position: ${dynamicToken.derivatives.position.toFixed(3)}`);
  console.log(`  Velocity: ${dynamicToken.derivatives.velocity.toFixed(3)}`);
  console.log(`  Acceleration: ${dynamicToken.derivatives.acceleration.toFixed(3)}`);
  console.log(`  Jerk: ${chalk.yellow(dynamicToken.derivatives.jerk.toFixed(3))}`);
  console.log(`  Snap: ${chalk.red(dynamicToken.derivatives.snap.toFixed(3))}`);
}

// Demo 4: Therapeutic Stabilization
console.log(chalk.yellow('\n4. Therapeutic Stabilization'));
console.log(chalk.gray('Using dual intervention to restore stability...\n'));

const patientToken = new BiHamiltonianToken('recovery', 'STATE');
patientToken.addEmotionalComponent('anxiety', 0.8, 0);
patientToken.addEmotionalComponent('hope', 0.4, Math.PI * 0.8); // Partially opposing
patientToken.updateHamiltonians();

console.log('Before intervention:');
console.log(`  H1: ${patientToken.H1_coherence.toFixed(3)}, H2: ${patientToken.H2_structure.toFixed(3)}`);
console.log(`  Divergence: ${Math.abs(patientToken.H1_coherence - patientToken.H2_structure).toFixed(3)}`);
console.log(`  Stable: ${patientToken.isStable() ? chalk.green('YES') : chalk.red('NO')}`);

const stabilizer = new TherapeuticStabilizer();
const result = stabilizer.applyDualIntervention(patientToken);

console.log('\nAfter intervention:');
console.log(`  H1: ${result.beforeH1.toFixed(3)} → ${result.afterH1.toFixed(3)}`);
console.log(`  H2: ${result.beforeH2.toFixed(3)} → ${result.afterH2.toFixed(3)}`);
console.log(`  Divergence: ${Math.abs(result.afterH1 - result.afterH2).toFixed(3)}`);
console.log(`  Result: ${result.success ? chalk.green('SUCCESS') : chalk.yellow('PARTIAL')}`);
console.log(`  ${result.message}`);

// Demo 5: Preventing Identity Collapse
console.log(chalk.yellow('\n5. Identity Preservation Through Dual Systems'));
console.log(chalk.gray('Showing why single-system approaches fail...\n'));

// Single strong coherence but poor structure
const brittleToken = new BiHamiltonianToken('brittle', 'ENTITY');
// All dimensions high (high coherence)
for (let dim in brittleToken.dimensions) {
  brittleToken.dimensions[dim] = 0.9;
}
brittleToken.updateHamiltonians();

console.log('High Coherence, Poor Structure:');
console.log(`  H1: ${brittleToken.H1_coherence.toFixed(3)} (very high)`);
console.log(`  H2: ${brittleToken.H2_structure.toFixed(3)} (low - no variation)`);
console.log(`  ${chalk.red('Result: Brittle identity, prone to shattering')}\n`);

// Good structure but low coherence
const fragmentedToken = new BiHamiltonianToken('fragmented', 'ENTITY');
// Random dimensions (good structure, poor coherence)
for (let dim in fragmentedToken.dimensions) {
  fragmentedToken.dimensions[dim] = Math.random();
}
fragmentedToken.updateHamiltonians();

console.log('Good Structure, Low Coherence:');
console.log(`  H1: ${fragmentedToken.H1_coherence.toFixed(3)} (low)`);
console.log(`  H2: ${fragmentedToken.H2_structure.toFixed(3)} (high - good variation)`);
console.log(`  ${chalk.red('Result: Fragmented identity, lacks direction')}\n`);

// Balanced dual system
const resilientToken = new BiHamiltonianToken('resilient', 'ENTITY');
resilientToken.dimensions.semantic = 0.8;
resilientToken.dimensions.emotional = 0.7;
resilientToken.dimensions.causal = 0.6;
resilientToken.dimensions.temporal = 0.5;
// Other dimensions get normalized values
resilientToken.normalizeDimensions();
resilientToken.updateHamiltonians();

console.log('Balanced Dual System:');
console.log(`  H1: ${resilientToken.H1_coherence.toFixed(3)}`);
console.log(`  H2: ${resilientToken.H2_structure.toFixed(3)}`);
console.log(`  Divergence: ${Math.abs(resilientToken.H1_coherence - resilientToken.H2_structure).toFixed(3)}`);
console.log(`  ${chalk.green('Result: Resilient identity, stable under stress')}`);

console.log(chalk.cyan('\n=== Key Insight ==='));
console.log('Stability requires TWO systems in harmony:');
console.log('- Coherence (H1): How well things fit together');
console.log('- Structure (H2): Whether the structure itself is sound');
console.log('When they diverge, collapse is imminent.');
console.log('True resilience comes from maintaining both.\n');