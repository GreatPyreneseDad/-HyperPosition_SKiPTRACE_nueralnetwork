import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { HyperpositionWrapper } from '../architecture/HyperpositionWrapper.js';

// Mock LLM for testing
class MockLLM {
  async generate(prompt) {
    // Simulate LLM response based on prompt content
    if (prompt.includes('emotional')) {
      return 'I understand you are feeling complex emotions.';
    } else if (prompt.includes('creative')) {
      return 'Here is a creative interpretation of your request.';
    } else if (prompt.includes('error')) {
      throw new Error('LLM generation failed');
    }
    return `Response to: ${prompt.substring(0, 50)}...`;
  }
}

describe('HyperpositionWrapper Integration', () => {
  let wrapper;
  let mockLLM;

  beforeEach(() => {
    mockLLM = new MockLLM();
    wrapper = new HyperpositionWrapper(mockLLM);
  });

  describe('constructor', () => {
    test('initializes with all required components', () => {
      expect(wrapper.baseModel).toBe(mockLLM);
      expect(wrapper.hyperCore).toBeDefined();
      expect(wrapper.skipEngine).toBeDefined();
      expect(wrapper.emotionalProcessor).toBeDefined();
      expect(wrapper.stabilityMonitor).toBeDefined();
    });
  });

  describe('process - basic functionality', () => {
    test('processes simple input through hyperposition pipeline', async () => {
      const result = await wrapper.process('Hello world');
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('traces');
      expect(result).toHaveProperty('emotionalState');
      expect(result).toHaveProperty('stability');
      expect(result.response).toContain('Response to');
    });

    test('handles context in processing', async () => {
      const context = {
        emotionalBias: 0.7,
        creativityLevel: 0.8
      };
      
      const result = await wrapper.process('Tell me a story', context);
      
      expect(result.response).toBeDefined();
      expect(result.traces.length).toBeGreaterThan(0);
    });
  });

  describe('createHyperpositionStates', () => {
    test('creates multiple hyperposition states from input', () => {
      const states = wrapper.createHyperpositionStates('The quick brown fox jumps');
      
      expect(Array.isArray(states)).toBe(true);
      expect(states.length).toBeGreaterThan(0);
      states.forEach(state => {
        expect(state).toHaveProperty('content');
        expect(state).toHaveProperty('dimensions');
      });
    });

    test('handles empty input gracefully', () => {
      const states = wrapper.createHyperpositionStates('');
      
      expect(Array.isArray(states)).toBe(true);
      expect(states.length).toBe(0);
    });
  });

  describe('tracesToPrompts', () => {
    test('converts traces to LLM prompts', () => {
      const mockStates = wrapper.createHyperpositionStates('test input');
      const mockTraces = [
        { path: mockStates, coherence: 0.8 },
        { path: mockStates, coherence: 0.6 }
      ];
      const mockStability = { status: 'STABLE' };
      
      const prompts = wrapper.tracesToPrompts(mockTraces, mockStability);
      
      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBe(2);
      prompts.forEach(prompt => {
        expect(typeof prompt).toBe('string');
        expect(prompt).toContain('Trace');
      });
    });
  });

  describe('collapseResponses', () => {
    test('selects highest coherence response', () => {
      const responses = [
        'Low quality response',
        'High quality response with more detail',
        'Medium quality response'
      ];
      const mockStates = wrapper.createHyperpositionStates('test');
      const context = {};
      
      const collapsed = wrapper.collapseResponses(responses, mockStates, context);
      
      expect(collapsed).toBeDefined();
      expect(typeof collapsed).toBe('string');
      // Should select based on coherence calculation
      expect(responses).toContain(collapsed);
    });

    test('handles single response', () => {
      const responses = ['Only response'];
      const mockStates = wrapper.createHyperpositionStates('test');
      
      const collapsed = wrapper.collapseResponses(responses, mockStates, {});
      
      expect(collapsed).toBe('Only response');
    });
  });

  describe('process - emotional scenarios', () => {
    test('handles emotional content with interference', async () => {
      const input = 'I feel both happy and sad at the same time';
      const result = await wrapper.process(input);
      
      expect(result.emotionalState).toBeDefined();
      expect(result.emotionalState.components.size).toBeGreaterThan(0);
      // Should detect emotional complexity
      if (result.emotionalState.interference) {
        expect(result.emotionalState.interference).toHaveProperty('destructive');
      }
    });

    test('processes trauma-related content carefully', async () => {
      const input = 'Processing difficult memories from the past';
      const context = { therapeutic: true };
      
      const result = await wrapper.process(input, context);
      
      expect(result.stability.status).toBeDefined();
      expect(result.response).toBeDefined();
    });
  });

  describe('process - creative scenarios', () => {
    test('generates multiple creative interpretations', async () => {
      const input = 'Imagine a world where colors have sounds';
      const context = { creativityLevel: 0.9 };
      
      const result = await wrapper.process(input, context);
      
      expect(result.traces.length).toBeGreaterThan(1);
      expect(result.response).toContain('creative');
    });
  });

  describe('error handling', () => {
    test('handles LLM generation errors gracefully', async () => {
      const input = 'This will trigger an error';
      
      // Override process to trigger error
      jest.spyOn(wrapper, 'tracesToPrompts').mockReturnValue(['error prompt']);
      
      await expect(wrapper.process(input)).rejects.toThrow('LLM generation failed');
    });

    test('handles empty responses', async () => {
      // Mock LLM to return empty
      mockLLM.generate = async () => '';
      
      const result = await wrapper.process('test');
      
      expect(result.response).toBeDefined();
    });
  });

  describe('stability monitoring', () => {
    test('monitors stability throughout processing', async () => {
      const input = 'Complex philosophical question about existence';
      const result = await wrapper.process(input);
      
      expect(result.stability).toHaveProperty('H1_coherence');
      expect(result.stability).toHaveProperty('H2_structure');
      expect(result.stability).toHaveProperty('status');
    });

    test('applies stabilization when needed', async () => {
      // Create unstable state
      wrapper.stabilityMonitor.updateEnergies(0.9, 0.3);
      
      const result = await wrapper.process('Help me understand');
      
      // Should have applied stabilization
      const divergence = Math.abs(
        result.stability.H1_coherence - result.stability.H2_structure
      );
      expect(divergence).toBeLessThan(0.3);
    });
  });

  describe('calculateCoherence', () => {
    test('calculates coherence score for responses', () => {
      const response = 'This is a coherent and relevant response to the query';
      const mockStates = wrapper.createHyperpositionStates('query about coherence');
      
      const coherence = wrapper.calculateCoherence(response, mockStates);
      
      expect(coherence).toBeGreaterThan(0);
      expect(coherence).toBeLessThanOrEqual(1);
    });

    test('returns low coherence for unrelated response', () => {
      const response = 'Completely unrelated nonsense text';
      const mockStates = wrapper.createHyperpositionStates('specific technical question');
      
      const coherence = wrapper.calculateCoherence(response, mockStates);
      
      expect(coherence).toBeLessThan(0.5);
    });
  });

  describe('integration with all components', () => {
    test('full pipeline with emotional and stability processing', async () => {
      const input = 'I need help processing conflicting feelings about a major life decision';
      const context = {
        emotionalSupport: true,
        decisionMaking: true
      };
      
      const result = await wrapper.process(input, context);
      
      // Verify all components participated
      expect(result.response).toBeDefined();
      expect(result.traces.length).toBeGreaterThan(0);
      expect(result.emotionalState.components.size).toBeGreaterThan(0);
      expect(result.stability.status).toBe('STABLE');
      
      // Should have emotional understanding
      expect(result.response).toContain('emotion');
    });

    test('handles rapid sequential processing', async () => {
      const inputs = [
        'First question',
        'Second question',
        'Third question'
      ];
      
      const results = await Promise.all(
        inputs.map(input => wrapper.process(input))
      );
      
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.response).toContain('Response to');
        expect(result.stability.status).toBeDefined();
      });
    });
  });

  describe('performance', () => {
    test('processes within reasonable time', async () => {
      const start = Date.now();
      const result = await wrapper.process('Performance test query');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      expect(result.response).toBeDefined();
    });

    test('handles large input efficiently', async () => {
      const largeInput = 'Lorem ipsum '.repeat(100);
      
      const start = Date.now();
      const result = await wrapper.process(largeInput);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(2000); // Even large input under 2 seconds
      expect(result.response).toBeDefined();
    });
  });
});