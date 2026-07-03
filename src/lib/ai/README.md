# Faro — AI Prompts (`src/lib/ai/`)

> LLM system prompt templates for all AI-powered features in Faro.

## Files

| File         | Purpose                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| `prompts.ts` | All system prompts for content generation, translation, tutoring, and moderation |

## Prompt Categories

| Prompt             | Used By           | Purpose                                        |
| ------------------ | ----------------- | ---------------------------------------------- |
| Content Generation | `ai-generator.ts` | Generates knowledge feed posts (facts, trivia) |
| Translation        | `translate.ts`    | Contextual word/phrase translation             |
| AI Tutor           | `ai-tutor.ts`     | Interactive language tutoring                  |
| Marco Chat         | `marco-chat.ts`   | Friendly AI assistant conversations            |
| Content Moderation | `create-post.ts`  | Approves/rejects user-generated feed posts     |
| Survival Mode      | `survival.ts`     | Generates survival challenge scenarios         |

## Design Principles

- All prompts enforce **strict JSON output** via explicit schema definitions
- Prompts specify **CEFR level adaptation** (A1-C2) for language learning context
- **No markdown wrapping** in responses — raw JSON only
- Rate limits and retries are handled by the calling module, not the prompt
