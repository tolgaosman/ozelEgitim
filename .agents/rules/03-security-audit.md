# Rule 03: Anthropic Security Audit & Security Guidance

## The Core Philosophy
Security cannot be an afterthought. The Next.js frontend and Laravel backend must be treated as hostile environments. Assume all user input is malicious. Assume all tokens can be stolen. Build impenetrable boundaries.

## 1. Zero-Trust Input Handling (Next.js & Laravel)
- **Laravel Backend:**
  - ALWAYS use Form Requests for validation. Never use `$request->all()` directly.
  - ALWAYS use Eloquent ORM. Raw SQL queries are strictly banned unless reviewed, and even then, must use parameterized bindings `DB::select('...', [$param])`.
  - Mass assignment must be strictly controlled via `$fillable` or `$guarded`.
- **Next.js Frontend:**
  - Never render unescaped raw HTML. If rendering markdown or rich text, you MUST use `DOMPurify.sanitize()` before passing to `dangerouslySetInnerHTML`.
  - Validate all incoming data from the backend using Zod or a similar schema validator to prevent prototype pollution and unexpected states.

## 2. Authentication & Authorization (Strict)
- **No IDOR (Insecure Direct Object Reference):**
  - Just because a user is authenticated does not mean they own the resource. 
  - ❌ **SLOP:** `Order::find($id)` -> returns order to user.
  - ✅ **ANTI-SLOP:** `$request->user()->orders()->findOrFail($id)` -> guarantees ownership.
- **Role-Based Access Control (RBAC):** Use Laravel Policies and Gates exclusively. Do not scatter `if ($user->role === 'admin')` throughout controllers.

## 3. Session & State Security
- **JWT / Session Tokens:** Never store authentication tokens in `localStorage`. Use `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Laravel Sanctum is configured for this; do not break its configuration.
- **CSRF Protection:** All Next.js mutations (POST, PUT, DELETE) to the Laravel backend must include the CSRF token. The backend must have the `VerifyCsrfToken` middleware active.
- **Rate Limiting:** Protect all login, registration, and sensitive mutation endpoints with strict rate limiting (`throttle:6,1` in Laravel).

## 4. Threat Modeling (Continuous)
For every new feature, mentally model the attack:
1. What happens if a user submits a 10MB payload?
2. What happens if they send an array instead of a string?
3. What happens if they spam the endpoint 1000 times a second?
Code must preemptively defend against these vectors via max payload limits, strict type validation, and rate limiting.
