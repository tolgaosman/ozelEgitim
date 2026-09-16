# Rule 01: Anti-Slop, Impeccable Execution & Fine Skills

## The Core Philosophy
Code written in this repository must be treated as high-end craftsmanship. "Slop" refers to lazy, unoptimized, boilerplate-heavy, or thoughtlessly generated code. We reject slop entirely. Every variable, every function, every abstraction must be deliberate, precise, and easily justifiable.

## 1. Naming Conventions (Strict Enforcement)
Never use generic or lazy variable names. Naming must be exact and domain-specific.
- ❌ **SLOP:** `data`, `item`, `val`, `temp`, `obj`, `res`, `e`, `info`, `result`.
- ✅ **ANTI-SLOP:** `userProfile`, `transactionRecord`, `parsedPayload`, `httpResponse`, `clickEvent`, `authResult`.
- **Boolean Variables:** Must be prefixed with `is`, `has`, `should`, or `can`. (e.g., `isModalOpen`, `hasUserAgreed`).
- **Function Names:** Must be verbs describing the exact action. (e.g., `fetchUserProfile`, `calculateInvoiceTotal` instead of `handleUser`, `doInvoice`).

## 2. Algorithmic Optimization & Data Structures
Do not write brute-force code if a better data structure exists.
- ❌ **SLOP (O(n²)):**
  ```typescript
  const userRoles = users.map(user => {
      const role = roles.find(r => r.userId === user.id); // O(n) inside O(n)
      return { ...user, role };
  });
  ```
- ✅ **ANTI-SLOP (O(n)):**
  ```typescript
  const roleMap = new Map(roles.map(r => [r.userId, r])); // O(n)
  const userRoles = users.map(user => ({
      ...user, 
      role: roleMap.get(user.id) 
  })); // O(n)
  ```

## 3. Boilerplate Eradication
- Avoid writing walls of unnecessary `try/catch` blocks if a global error handler or a higher-order wrapper can manage it.
- Use early returns to prevent "arrow code" (deeply nested conditionals).
- ❌ **SLOP:**
  ```typescript
  function process(user: User) {
      if (user) {
          if (user.isActive) {
              // do something
          }
      }
  }
  ```
- ✅ **ANTI-SLOP:**
  ```typescript
  function process(user: User) {
      if (!user || !user.isActive) return;
      // do something
  }
  ```

## 4. Impeccable Delivery & Code Review
Before finalizing any code, you must self-review against this checklist:
- [ ] Are all edge cases and null states explicitly handled?
- [ ] Are there zero TypeScript `any` types? (Use `unknown` or precise generics).
- [ ] Are there zero linter warnings and console errors?
- [ ] Is there zero leftover debugging code (`console.log`, `debugger`)?
- [ ] Does the implementation elegantly handle network failures or timeout states?

Code must be production-ready the moment it is written. We do not do "rough drafts" for core logic.
