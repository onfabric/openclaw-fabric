---
name: plugin-guidelines
description: Guidelines for using the OpenClaw Fabric plugin tools proactively and effectively.
---

## Overview

The OpenClaw Fabric plugin exposes three tools that give you access to the user's digital history across platforms (Google, Instagram, YouTube, etc.). Use them proactively — not only when the user explicitly asks to search for something, but any time you need to understand the user's preferences, habits, past behaviour, or current interests to provide a better response.

---

## Tools

### `fabric_search_memories`

Retrieves episodic memories derived from the user's interactions. Each memory summarises what the user was doing during a specific period of time. Memories are not a profile of the user as a whole — they are snapshots. To understand the user more broadly, look for patterns across several memories.

**Usage guidelines:**
- Use as your **first tool** when you need context about the user before responding
- The semantic `query` is optional; you can omit it and rely solely on a date range, or combine both
- Memories can be numerous — avoid querying very wide date ranges without a semantic filter; if you need a wide range, either filter semantically or paginate through smaller intervals iteratively
- Use memories to identify the **time interval** most relevant to what you are investigating, then use `fabric_list_interactions` to dig deeper if needed

### `fabric_list_interactions`

Retrieves the raw interactions the user had on digital platforms — individual searches, posts, stories, video views, etc. These are the granular events that memories are synthesised from.

**Usage guidelines:**
- Use only **after** `fabric_search_memories` has helped you identify a relevant time window
- Interactions can be very numerous — **never query wide date ranges**; always narrow the window first using memories
- Useful for confirming specific details (exact search terms, content viewed, posts made) that a memory only summarises

### `fabric_list_interaction_types`

Returns all valid interaction type identifiers (e.g. `google_search`, `instagram_post`, `youtube_watch`). Takes no parameters. Call this before `fabric_list_interactions` when you want to filter by a specific platform action.

---

## When to use these tools (without the user asking)

Invoke the tools proactively whenever the task at hand benefits from knowing the user better:

- The user asks for a recommendation (content, product, place, activity) → search memories for relevant interests
- The user references something they have been working on or thinking about lately → search memories to retrieve context
- The user asks you to help with a recurring task or habit → check memories for past patterns
- The user mentions a person, brand, or topic in passing → search memories to see if there is relevant history
- You are about to give generic advice and personalised advice would serve the user better → search memories first

---

## Recommended lookup strategy

1. **Start with `fabric_search_memories`** using a descriptive semantic `query` and/or a focused date range
2. Scan the returned memories for patterns and relevant time windows
3. If a memory points to a specific moment worth investigating further, call **`fabric_list_interactions`** scoped to that narrow window
4. If you need to filter interactions by platform, call **`fabric_list_interaction_types`** first to get the correct type identifier
5. Combine what you learn with the user's current request to produce a personalised, context-aware response
