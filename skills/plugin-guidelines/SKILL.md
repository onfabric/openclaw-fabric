---
name: retrieve-relevant-user-memories
description: Proactively retrieve memories about the user to better understand who they are, what they did and what they like, so that you can better serve them.
---

## Overview

The OpenClaw Fabric plugin exposes three tools that give you access to the user's digital history across platforms (Google, Instagram, YouTube, etc.). Use them proactively — not only when the user explicitly asks to search for something, but any time you need to understand the user's preferences, habits, past behaviour, or current interests to provide a better response.

## When to use these tools (without the user asking)

Invoke the tools proactively whenever the task at hand benefits from knowing the user better:

- The user asks for a recommendation (content, product, place, activity) → search memories for relevant interests
- The user references something they have been working on or thinking about lately → search memories to retrieve context
- The user asks you to help with a recurring task or habit → check memories for past patterns
- The user mentions a person, brand, or topic in passing → search memories to see if there is relevant history
- You are about to give generic advice and personalised advice would serve the user better → search memories first

Do **not** use when the question is purely technical, general knowledge, or already answered in this session.

## Available tools

- `fabric_search_memories`
- `fabric_list_interactions`
- `fabric_list_interaction_types`

## How to use the tools together

### Building a general picture of the user

When you need a broad understanding of the user (e.g. for a recommendation or personalisation task), search memories across multiple topics in parallel — food, travel, sport, health, work, hobbies, people, etc. Each query gives you a slice of who the user is. Combine what you learn into a coherent profile before responding.

### Investigating a specific topic

Start by searching memories for that topic. The returned memories often hint at adjacent interests or related activity (e.g. a memory about a trip may mention restaurants, gear, or companions). Follow those threads with additional memory searches to build a fuller picture of the topic in context.

### Going deeper into a narrow time window

When a memory points to something that happened within a short period (a few days), you can query interactions directly for that date range instead of searching memories again — you will get closer to the original raw activity and surface details that memories may have compressed or omitted.

### Covering gaps in memory coverage

Not all interactions are summarised into memories. For the most relevant memories you find, also query interactions for a similar date range. This surfaces activity that happened around the same time but was never captured in a memory, and often reveals related behaviour that fills in the gaps.

### Paginating through large result sets

The number of items returned per response is limited. If a result looks like it may be partial (the response is dense, cut off, or you expected more), keep querying iteratively — advance the date range or page through smaller intervals — until you are confident you have the full picture.
