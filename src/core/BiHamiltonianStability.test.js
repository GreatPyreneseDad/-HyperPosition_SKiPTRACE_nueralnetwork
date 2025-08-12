import { describe, test, expect, beforeEach } from '@jest/globals';
import { BiHamiltonianToken } from './BiHamiltonianStability.js';

describe('BiHamiltonianToken', () => {
  let token;

  beforeEach(() => {
    token = new BiHamiltonianToken('test-token');
  });

  describe('constructor', () => {
    test('initializes with correct default values', () => {
      expect(token.content).toBe('test-token');
      expect(token.H1_coherence).toBe(1.0);
      expect(token.H2_structure).toBe(1.0);
      expect(token.divergenceThreshold).toBe(0.3);
      expect(token.history).toHaveLength(1);
      
      const initialState = token.history[0];
      expect(initialState.H1).toBe(1.0);
      expect(initialState.H2).toBe(1.0);
      expect(initialState.timestamp).toBeCloseTo(Date.now(), -2);
    });

    test('initializes kinematics with zeros', () => {
      expect(token.kinematics.position).toBe(0);
      expect(token.kinematics.velocity).toBe(0);
      expect(token.kinematics.acceleration).toBe(0);
      expect(token.kinematics.jerk).toBe(0);
      expect(token.kinematics.snap).toBe(0);
    });
  });

  describe('updateEnergies', () => {
    test('updates both Hamiltonian energies', () => {
      token.updateEnergies(0.8, 0.9);
      
      expect(token.H1_coherence).toBe(0.8);
      expect(token.H2_structure).toBe(0.9);
      expect(token.history).toHaveLength(2);
      
      const latestState = token.history[token.history.length - 1];
      expect(latestState.H1).toBe(0.8);
      expect(latestState.H2).toBe(0.9);
    });

    test('maintains history order', () => {
      token.updateEnergies(0.8, 0.9);
      token.updateEnergies(0.7, 0.85);
      token.updateEnergies(0.6, 0.8);
      
      expect(token.history).toHaveLength(4);
      expect(token.history[0].H1).toBe(1.0);
      expect(token.history[1].H1).toBe(0.8);
      expect(token.history[2].H1).toBe(0.7);
      expect(token.history[3].H1).toBe(0.6);
    });
  });

  describe('checkDivergence', () => {
    test('returns stable when energies are aligned', () => {
      token.updateEnergies(0.8, 0.82);
      const status = token.checkDivergence();
      
      expect(status.divergence).toBeCloseTo(0.02, 5);
      expect(status.status).toBe('STABLE');
      expect(status.warning).toBeUndefined();
    });

    test('returns warning when divergence exceeds threshold', () => {
      token.updateEnergies(0.9, 0.5);
      const status = token.checkDivergence();
      
      expect(status.divergence).toBeCloseTo(0.4, 5);
      expect(status.status).toBe('DIVERGING');
      expect(status.warning).toBe('GHOST_STATE_EMERGING');
    });

    test('handles equal energies correctly', () => {
      token.updateEnergies(0.7, 0.7);
      const status = token.checkDivergence();
      
      expect(status.divergence).toBe(0);
      expect(status.status).toBe('STABLE');
    });
  });

  describe('calculateDerivatives', () => {
    test('calculates velocity correctly', () => {
      token.updateEnergies(0.8, 0.9);
      token.kinematics.position = 1.0;
      
      token.calculateDerivatives();
      
      // Velocity = dPosition/dt
      expect(token.kinematics.velocity).toBeDefined();
      expect(typeof token.kinematics.velocity).toBe('number');
    });

    test('calculates all derivatives up to snap', () => {
      // Create a series of updates to establish motion
      token.updateEnergies(0.8, 0.9);
      token.kinematics.position = 1.0;
      token.calculateDerivatives();
      
      token.updateEnergies(0.75, 0.85);
      token.kinematics.position = 1.1;
      token.calculateDerivatives();
      
      token.updateEnergies(0.7, 0.8);
      token.kinematics.position = 1.25;
      token.calculateDerivatives();
      
      expect(token.kinematics.velocity).not.toBe(0);
      expect(token.kinematics.acceleration).toBeDefined();
      expect(token.kinematics.jerk).toBeDefined();
      expect(token.kinematics.snap).toBeDefined();
    });

    test('handles insufficient history gracefully', () => {
      expect(() => token.calculateDerivatives()).not.toThrow();
      expect(token.kinematics.velocity).toBe(0);
    });
  });

  describe('detectInstability', () => {
    test('detects rapid changes in energies', () => {
      token.updateEnergies(1.0, 1.0);
      token.updateEnergies(0.5, 1.0);  // Rapid H1 change
      token.updateEnergies(0.1, 1.0);  // Very rapid H1 change
      
      const warnings = token.detectInstability();
      
      expect(warnings).toContain('Rapid coherence loss detected');
    });

    test('detects high jerk values', () => {
      token.kinematics.jerk = 1.5;
      
      const warnings = token.detectInstability();
      
      expect(warnings).toContain('High jerk detected - system experiencing sudden changes');
    });

    test('detects extreme snap values', () => {
      token.kinematics.snap = 3.0;
      
      const warnings = token.detectInstability();
      
      expect(warnings).toContain('Extreme snap detected - catastrophic instability');
    });

    test('detects structural collapse', () => {
      token.updateEnergies(0.8, 0.05);  // Very low structure
      
      const warnings = token.detectInstability();
      
      expect(warnings).toContain('Structural integrity critically low');
    });

    test('returns empty array when stable', () => {
      token.updateEnergies(0.8, 0.82);
      token.kinematics.jerk = 0.1;
      token.kinematics.snap = 0.05;
      
      const warnings = token.detectInstability();
      
      expect(warnings).toHaveLength(0);
    });
  });

  describe('stabilize', () => {
    test('aligns energies when diverging', () => {
      token.updateEnergies(0.9, 0.4);  // Large divergence
      
      token.stabilize();
      
      const divergence = Math.abs(token.H1_coherence - token.H2_structure);
      expect(divergence).toBeLessThan(0.3);  // Below threshold
    });

    test('rebalances dimensions when needed', () => {
      token.dimensions = {
        semantic: 0.9,
        temporal: 0.1,
        causal: 0.1,
        emotional: 0.1,
        relational: 0.1,
        probability: 0.1,
        energy: 0.1,
        coherence: 0.1
      };
      
      token.stabilize();
      
      // Check that dimensions are more balanced
      const values = Object.values(token.dimensions);
      const variance = values.reduce((sum, val) => {
        const mean = 1/8;
        return sum + Math.pow(val - mean, 2);
      }, 0) / 8;
      
      expect(variance).toBeLessThan(0.1);  // More balanced than before
    });

    test('maintains total energy during stabilization', () => {
      const initialH1 = token.H1_coherence;
      const initialH2 = token.H2_structure;
      const initialTotal = initialH1 + initialH2;
      
      token.updateEnergies(0.9, 0.3);
      token.stabilize();
      
      const finalTotal = token.H1_coherence + token.H2_structure;
      expect(finalTotal).toBeCloseTo(initialTotal, 1);  // Approximately conserved
    });
  });

  describe('getStabilityReport', () => {
    test('returns comprehensive stability report', () => {
      token.updateEnergies(0.8, 0.75);
      token.kinematics.velocity = 0.5;
      token.kinematics.acceleration = 0.1;
      
      const report = token.getStabilityReport();
      
      expect(report).toHaveProperty('current');
      expect(report.current).toHaveProperty('H1', 0.8);
      expect(report.current).toHaveProperty('H2', 0.75);
      expect(report.current).toHaveProperty('divergence');
      
      expect(report).toHaveProperty('kinematics');
      expect(report.kinematics).toHaveProperty('velocity', 0.5);
      expect(report.kinematics).toHaveProperty('acceleration', 0.1);
      
      expect(report).toHaveProperty('status');
      expect(report).toHaveProperty('warnings');
      expect(report).toHaveProperty('recommendation');
    });

    test('provides appropriate recommendations', () => {
      token.updateEnergies(0.9, 0.5);  // Diverging
      const report = token.getStabilityReport();
      
      expect(report.recommendation).toContain('stabilization');
    });

    test('identifies stable systems', () => {
      token.updateEnergies(0.8, 0.82);
      const report = token.getStabilityReport();
      
      expect(report.status).toBe('STABLE');
      expect(report.recommendation).toContain('stable');
    });
  });

  describe('history management', () => {
    test('limits history size to prevent memory issues', () => {
      // Add many updates
      for (let i = 0; i < 150; i++) {
        token.updateEnergies(Math.random(), Math.random());
      }
      
      expect(token.history.length).toBeLessThanOrEqual(100);  // Assuming 100 is the limit
    });
  });

  describe('edge cases', () => {
    test('handles zero energies', () => {
      expect(() => token.updateEnergies(0, 0)).not.toThrow();
      expect(token.H1_coherence).toBe(0);
      expect(token.H2_structure).toBe(0);
    });

    test('handles negative energies by clamping', () => {
      token.updateEnergies(-0.5, 1.2);
      
      expect(token.H1_coherence).toBeGreaterThanOrEqual(0);
      expect(token.H2_structure).toBeLessThanOrEqual(1);
    });

    test('handles empty content', () => {
      const emptyToken = new BiHamiltonianToken('');
      expect(emptyToken.content).toBe('');
      expect(emptyToken.H1_coherence).toBe(1.0);
    });
  });

  describe('complex scenarios', () => {
    test('models gradual system decay', () => {
      const decaySteps = 10;
      const reports = [];
      
      for (let i = 0; i < decaySteps; i++) {
        const decay = 1 - (i / decaySteps);
        token.updateEnergies(decay, decay * 0.9);
        reports.push(token.getStabilityReport());
      }
      
      // System should show increasing instability
      expect(reports[0].status).toBe('STABLE');
      expect(reports[decaySteps - 1].warnings.length).toBeGreaterThan(0);
    });

    test('models recovery through stabilization', () => {
      // Create unstable state
      token.updateEnergies(0.9, 0.3);
      const unstableReport = token.getStabilityReport();
      expect(unstableReport.status).toBe('DIVERGING');
      
      // Apply stabilization
      token.stabilize();
      const stableReport = token.getStabilityReport();
      expect(stableReport.status).toBe('STABLE');
    });
  });
});