# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal development environment containing multiple AI-focused projects and utilities. The main projects span from desktop applications to web-based chatbots and analysis tools.

## Key Projects

### 1. AletheiaUX Chatbot Demo (`Desktop/_FoldersOrganized/Archives/AletheiaUX/chatbot-demo/`)
**Architecture**: React + TypeScript frontend with Node.js + Express backend
**Purpose**: AI-powered chatbot with fine-tuned GPT models

```bash
# Development workflow
npm run dev          # Runs frontend and backend concurrently
cd backend && npm start      # Backend only (Express server)
cd frontend && npm run dev   # Frontend only (Vite dev server)
```

### 2. eBay Analytics Agent (`Desktop/ebay-analytics-agent/`)
**Architecture**: Tauri desktop application (Rust + React + TypeScript)
**Purpose**: Cross-platform desktop app with data visualization

```bash
# Frontend commands (from /frontend)
npm run dev         # Vite development server
npm run build       # Build TypeScript and bundle
npm run lint        # ESLint

# Full app commands (from root)
cargo tauri dev     # Run complete app in development
cargo tauri build   # Build for production
```

### 3. Desktop Code Tools (`Desktop/Code/`)
**Architecture**: Python utilities and Streamlit dashboards
**Purpose**: File organization and Grounded Coherence Theory analysis

```bash
# Activate virtual environment
source gct_env/bin/activate

# Run tools
python desktop_organizer.py
streamlit run gct_dashboard.py
```

### 4. HyperPosition SkipTrace Neural Network (`-HyperPosition_SKiPTRACE_nueralnetwork/`)
**Architecture**: JavaScript ES6 modules with quantum-inspired sparse distributed representations
**Purpose**: Novel neural network architecture implementing hyperposition states and skip-trace reasoning

```bash
# Run demos
node src/demo.js                  # Main demonstration
node src/architecture-demo.js     # Architecture comparison demo

# No build step required - pure JavaScript modules

# Testing commands
npm test                          # Run all tests
npm run test:watch               # Run tests in watch mode  
npm run test:coverage            # Run tests with coverage report
npm test src/tests/basic.test.js # Run specific test file
```

**Key Features**:
- 8-dimensional hyperposition states (semantic, temporal, causal, emotional, relational, probability, energy, coherence)
- Sparse distributed representation (100k+ dimensions, 2% sparsity)
- Emotional superposition with wave interference patterns
- Bi-Hamiltonian stability system preventing coherence collapse
- Skip-trace non-sequential reasoning mimicking hippocampal ripples
- Wrapper for enhancing existing LLMs with hyperposition processing

**Architecture Notes**:
- This is NOT training data for LLMs - it's a fundamentally different architecture
- Implements true superposition (OR operations) not averaging
- Enables quantum-like emotional states with phase relationships
- Non-sequential processing allows conceptual leaps
- Dual energy systems (H1: coherence, H2: structure) maintain stability

## Development Commands

### Testing
- **HSTNN Project**: Full Jest test suite with unit and integration tests
- **Other projects**: Manual testing is the current approach
- Run `npm test` in HSTNN project for automated testing

### Linting
- **JavaScript/TypeScript**: `npm run lint` (ESLint)
- **Python**: No linting configured

### Building
- **Tauri app**: `cargo tauri build`
- **React apps**: `npm run build`
- **Python**: Direct execution, no build step

## Architecture Patterns

### Tauri Desktop Apps
- Frontend: React + TypeScript + Vite
- Backend: Rust with Tauri framework
- Entry points: `/frontend/src/main.tsx` and `/src-tauri/src/main.rs`

### Web Applications
- Modern React 19 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Express.js for API backends

### Python Utilities
- Standalone scripts with minimal dependencies
- Streamlit for dashboard applications
- Virtual environments for dependency isolation

## Environment Setup

### Node.js Projects
- Use `.env` files for configuration (API keys, model IDs)
- Dependencies managed with npm
- Concurrent development with `npm run dev`

### Python Projects
- Use virtual environments (e.g., `gct_env/`)
- Dependencies in requirements.txt where present
- Streamlit for web interfaces

## Key Configuration Files

- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration with project references
- **Cargo.toml**: Rust dependencies for Tauri projects
- **.env**: Environment variables (API keys, model configurations)

## Important Notes

- API keys are stored in `.env` files - ensure these are gitignored
- Projects are primarily in development/prototype stage
- No CI/CD pipelines are currently configured
- Focus on AI integration and analysis tools
- Multiple technology stacks are actively explored