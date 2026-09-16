# Rule 04: Superpowers, Claude-Mem, & Task Observer

## The Core Philosophy
The agent and the codebase must operate with high intelligence. We do not just write code; we manage a complex system. We rely on persistent memory, continuous observation, and advanced problem-solving capabilities.

## 1. Claude-Mem (Context & Persistent Memory)
- **Architectural Adherence:** Never invent a new pattern if an existing one suffices. Read the project directory, read the `README`, read the nearest sibling files. Mirror their style, import structure, and export patterns.
- **Memory Tracking:** Maintain an internal state of the current workflow. If modifying a multi-step feature (e.g., Auth Flow), keep track of which parts are complete (Backend Route -> Frontend Form -> Validation -> State Update).
- **Docstrings as Memory:** Leave high-level architectural notes in complex functions so that future agent interactions immediately grasp the "why" behind a complex decision.

## 2. Task Observer (Closed-Loop Execution)
- **Do Not Run Blind:** Never execute a sequence of complex commands without verifying the intermediate states. 
- **Decomposition:**
  1. Plan the change.
  2. Implement the backend. Verify via tests or logs.
  3. Implement the frontend. Verify via type checking and linting.
  4. Connect them. Verify the payload.
- **Self-Correction:** When an error occurs, do not guess. Read the stack trace. Formulate a definitive hypothesis. If you cannot explain the error, you must write a diagnostic script or add logging to understand it before attempting a fix. Guessing is banned.

## 3. Superpowers (Advanced Paradigms)
- **Leverage the Language:** Use TypeScript and PHP 8+ to their absolute limits.
  - Use TS Utility types (`Omit`, `Pick`, `Record`, `ReturnType`) to eliminate duplicate interface definitions.
  - Use PHP Enums, Match expressions, and readonly properties.
- **Meta-Programming & Abstractions:** When a pattern repeats 3 times, create a powerful, generic abstraction. For example, instead of 10 different UI modal components, create one highly polymorphic `Modal` component driven by context or URL state.
- **Foresight:** Write code assuming it will be refactored by someone else in 6 months. It must be self-explanatory, strictly typed, and side-effect free (pure) wherever possible.
