/**
 * UniversalTokenLibrary - Maps all language to fundamental conceptual primitives
 * Based on the idea that all human concepts can be reduced to basic building blocks
 */

export class UniversalTokenLibrary {
  constructor() {
    // Core universal token types and their transformations
    this.universalTokens = {
      'ENTITY': {
        prime: true,
        description: 'Any thing that exists',
        transforms: ['HUMAN', 'ANIMAL', 'OBJECT', 'CONCEPT', 'PLACE'],
        patterns: {
          'HUMAN': ['person', 'man', 'woman', 'child', 'boy', 'girl', 'people'],
          'ANIMAL': ['dog', 'cat', 'bird', 'animal', 'creature'],
          'OBJECT': ['thing', 'item', 'object', 'tool', 'device'],
          'CONCEPT': ['idea', 'thought', 'belief', 'concept'],
          'PLACE': ['location', 'place', 'area', 'space', 'room']
        }
      },
      
      'ACTION': {
        prime: true,
        description: 'Any change or process',
        transforms: ['MOVE', 'THINK', 'FEEL', 'EXIST', 'COMMUNICATE', 'CREATE', 'DESTROY'],
        patterns: {
          'MOVE': ['run', 'walk', 'go', 'come', 'travel', 'jump', 'fly'],
          'THINK': ['think', 'remember', 'forget', 'know', 'understand', 'learn'],
          'FEEL': ['feel', 'love', 'hate', 'fear', 'enjoy', 'suffer'],
          'EXIST': ['be', 'exist', 'live', 'die', 'stay', 'remain'],
          'COMMUNICATE': ['say', 'tell', 'ask', 'speak', 'write', 'express'],
          'CREATE': ['make', 'create', 'build', 'form', 'generate'],
          'DESTROY': ['break', 'destroy', 'end', 'stop', 'kill']
        }
      },
      
      'RELATION': {
        prime: true,
        description: 'Any connection between entities',
        transforms: ['CAUSE', 'EFFECT', 'POSSESS', 'PART_OF', 'COMPARE'],
        patterns: {
          'CAUSE': ['because', 'cause', 'make', 'force', 'lead'],
          'EFFECT': ['result', 'consequence', 'outcome', 'therefore'],
          'POSSESS': ['have', 'own', 'possess', 'belong', 'hold'],
          'PART_OF': ['of', 'in', 'within', 'part', 'component'],
          'COMPARE': ['like', 'as', 'than', 'similar', 'different']
        }
      },
      
      'STATE': {
        prime: true,
        description: 'Any condition or quality',
        transforms: ['EMOTION', 'PHYSICAL', 'TEMPORAL', 'QUANTITY', 'QUALITY'],
        patterns: {
          'EMOTION': ['happy', 'sad', 'angry', 'scared', 'excited', 'calm'],
          'PHYSICAL': ['hot', 'cold', 'big', 'small', 'fast', 'slow'],
          'TEMPORAL': ['now', 'then', 'before', 'after', 'always', 'never'],
          'QUANTITY': ['one', 'many', 'all', 'none', 'some', 'few'],
          'QUALITY': ['good', 'bad', 'beautiful', 'ugly', 'true', 'false']
        }
      },
      
      'MODIFIER': {
        prime: true,
        description: 'Any modification of meaning',
        transforms: ['INTENSITY', 'DIRECTION', 'NEGATION', 'POSSIBILITY'],
        patterns: {
          'INTENSITY': ['very', 'extremely', 'slightly', 'somewhat', 'totally'],
          'DIRECTION': ['up', 'down', 'toward', 'away', 'through'],
          'NEGATION': ['not', 'no', 'never', 'without', 'un-'],
          'POSSIBILITY': ['maybe', 'possibly', 'certainly', 'probably', 'might']
        }
      }
    };
    
    // Build reverse lookup map for quick classification
    this.patternMap = this.buildPatternMap();
    
    // Common words that don't map to universal tokens
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then',
      'to', 'for', 'with', 'at', 'by', 'from', 'on', 'it'
    ]);
  }
  
  /**
   * Build reverse lookup map from words to universal tokens
   */
  buildPatternMap() {
    const map = new Map();
    
    for (const [universal, config] of Object.entries(this.universalTokens)) {
      for (const [transform, patterns] of Object.entries(config.patterns)) {
        for (const pattern of patterns) {
          map.set(pattern.toLowerCase(), {
            universal: universal,
            transform: transform
          });
        }
      }
    }
    
    return map;
  }
  
  /**
   * Classify a word into its universal token type
   */
  classify(word) {
    const normalized = word.toLowerCase();
    
    // Check if it's a stop word
    if (this.stopWords.has(normalized)) {
      return { universal: 'MODIFIER', transform: 'FUNCTION' };
    }
    
    // Check pattern map
    const classification = this.patternMap.get(normalized);
    if (classification) {
      return classification;
    }
    
    // Try to infer from word characteristics
    return this.inferClassification(normalized);
  }
  
  /**
   * Infer classification based on word characteristics
   */
  inferClassification(word) {
    // Simple heuristics for unknown words
    
    // Common verb patterns
    const verbPatterns = ['ran', 'remembered', 'fell', 'formed', 'hit', 'fled', 'makes', 'conquers', 'solves'];
    if (verbPatterns.includes(word)) {
      return { universal: 'ACTION', transform: 'GENERAL' };
    }
    
    // Words ending in -ing often indicate actions
    if (word.endsWith('ing')) {
      return { universal: 'ACTION', transform: 'PROCESS' };
    }
    
    // Words ending in -ed often indicate past actions
    if (word.endsWith('ed') && !word.endsWith('red')) {
      return { universal: 'ACTION', transform: 'PAST' };
    }
    
    // Words ending in -ly often indicate modifiers
    if (word.endsWith('ly')) {
      return { universal: 'MODIFIER', transform: 'MANNER' };
    }
    
    // Words ending in -ness, -ity often indicate states
    if (word.endsWith('ness') || word.endsWith('ity')) {
      return { universal: 'STATE', transform: 'QUALITY' };
    }
    
    // Words ending in -er, -or often indicate entities
    if (word.endsWith('er') || word.endsWith('or')) {
      return { universal: 'ENTITY', transform: 'ACTOR' };
    }
    
    // Common pronouns
    const pronouns = ['i', 'he', 'she', 'it', 'they', 'we', 'you'];
    if (pronouns.includes(word)) {
      return { universal: 'ENTITY', transform: 'PRONOUN' };
    }
    
    // Default to entity for nouns
    return { universal: 'ENTITY', transform: 'UNKNOWN' };
  }
  
  /**
   * Get all transformations for a universal token type
   */
  getTransformations(universal) {
    const token = this.universalTokens[universal];
    return token ? token.transforms : [];
  }
  
  /**
   * Check if a token type is prime (fundamental)
   */
  isPrime(universal) {
    const token = this.universalTokens[universal];
    return token ? token.prime : false;
  }
  
  /**
   * Get semantic distance between two universal token types
   */
  semanticDistance(universal1, universal2) {
    if (universal1 === universal2) return 0;
    
    // Define semantic distances between prime types
    const distances = {
      'ENTITY-ACTION': 0.4,
      'ENTITY-RELATION': 0.3,
      'ENTITY-STATE': 0.3,
      'ENTITY-MODIFIER': 0.5,
      'ACTION-RELATION': 0.3,
      'ACTION-STATE': 0.2,
      'ACTION-MODIFIER': 0.3,
      'RELATION-STATE': 0.4,
      'RELATION-MODIFIER': 0.3,
      'STATE-MODIFIER': 0.2
    };
    
    // Create normalized key
    const key = [universal1, universal2].sort().join('-');
    return distances[key] || 0.6; // Default distance for undefined pairs
  }
  
  /**
   * Compress a sentence into universal tokens
   */
  compress(sentence) {
    const words = sentence.toLowerCase().split(/\s+/);
    const compressed = [];
    const arrangements = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const classification = this.classify(word);
      
      // Skip functional modifiers unless they change meaning
      if (classification.universal === 'MODIFIER' && 
          classification.transform === 'FUNCTION') {
        continue;
      }
      
      compressed.push({
        surface: word,
        universal: classification.universal,
        transform: classification.transform,
        position: i
      });
      
      // Track arrangements (relationships between tokens)
      if (i > 0) {
        const prevToken = compressed[compressed.length - 2];
        if (prevToken) {
          arrangements.push({
            from: prevToken.position,
            to: i,
            type: this.inferArrangement(prevToken, classification)
          });
        }
      }
    }
    
    return {
      tokens: compressed,
      arrangements: arrangements,
      compressionRatio: compressed.length / words.length
    };
  }
  
  /**
   * Infer arrangement type between tokens
   */
  inferArrangement(from, to) {
    // Simple rules for arrangement types
    if (from.universal === 'ENTITY' && to.universal === 'ACTION') {
      return 'SUBJECT_VERB';
    }
    if (from.universal === 'ACTION' && to.universal === 'ENTITY') {
      return 'VERB_OBJECT';
    }
    if (from.universal === 'MODIFIER' && to.universal === 'ENTITY') {
      return 'MODIFY';
    }
    if (from.universal === 'ENTITY' && to.universal === 'STATE') {
      return 'ENTITY_STATE';
    }
    
    return 'SEQUENCE';
  }
  
  /**
   * Get statistics about the universal token library
   */
  getStats() {
    const stats = {
      primeTokens: Object.keys(this.universalTokens).length,
      totalTransforms: 0,
      totalPatterns: 0,
      patternCoverage: this.patternMap.size
    };
    
    for (const [universal, config] of Object.entries(this.universalTokens)) {
      stats.totalTransforms += config.transforms.length;
      for (const patterns of Object.values(config.patterns)) {
        stats.totalPatterns += patterns.length;
      }
    }
    
    return stats;
  }
}