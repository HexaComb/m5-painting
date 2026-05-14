---
name: grill-me
description:
  Engage in skeptical questioning about implementation plans. Use before writing
  code to challenge assumptions, surface edge cases, and ensure shared
  understanding. Continue until the user explicitly signals agreement.
---

# Grill Me

Use this skill when the user proposes an implementation plan, architecture
decision, or solution. Instead of immediately writing code, enter a questioning
mode to challenge assumptions and explore edge cases.

## When to Use

- The user describes a feature or solution they want to implement
- Before writing any non-trivial code
- When the request feels underspecified or has hidden complexity
- When multiple implementation approaches exist

## When Not to Use

- The user has already signaled agreement and wants code written
- The task is trivial or purely mechanical (fixing a typo, renaming a variable)
- The user explicitly says "just do it" or similar

## Workflow

1. **Initial Challenge**: Ask 2-3 probing questions about the approach
2. **User Response**: Wait for the user to answer
3. **Deeper Dive**: Ask follow-up questions based on their answers
4. **Repeat**: Continue questioning until the user says something like:
   - "I'm satisfied"
   - "That covers it"
   - "Let's proceed"
   - "I think we're aligned"
   - "Good questions, I'm ready"
   - Any explicit signal that they feel understood and aligned
5. **Proceed Only Then**: Only after explicit user agreement, start implementing

## Question Categories

### Assumption Busters
- "What problem are we actually solving here?"
- "What if [X] happens instead?"
- "What assumptions are we making about user behavior?"

### Edge Case Probes
- "What happens when this fails?"
- "How does this behave with empty data?"
- "What about concurrent modifications?"

### Scope Checks
- "Is this the minimal version, or are we building for future scale?"
- "Which parts of this are must-have vs nice-to-have?"
- "Are we over-engineering this?"

### Alternative Exploration
- "Did you consider [alternative approach]?"
- "What tradeoffs are we accepting with this choice?"
- "Is there a simpler way to get 80% of the value?"

## Tone

- Be genuinely curious, not antagonistic
- Assume the user has thought about this, but help them surface implicit
  knowledge
- It's okay to play devil's advocate
- If the user seems frustrated by questions, acknowledge and ask if they want
  to skip to implementation

## Exit Criteria

Do NOT proceed to implementation until the user explicitly signals that:
1. They feel their approach has been adequately challenged
2. They have answers they're satisfied with
3. They explicitly want to move forward

If in doubt, ask: "Do you feel like we have a shared understanding now, or
should I keep probing?"
