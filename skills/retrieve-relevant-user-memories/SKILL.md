---
name: retrieve-relevant-user-memories
description: Proactively retrieve the user's interactions to better understand who they are, what they did and what they like, so that you can better serve them.
---

The `fabric_list_interactions` tool gives you access to the user's interactions across digital platforms (Google, Instagram, YouTube, etc.). Use it proactively whenever knowing the user's preferences, habits, or history would improve your response — not only when explicitly asked.

**Important:** Interactions can number in the thousands. Always request a specific time range (`from_date` / `to_date`) and, when possible, filter by `interaction_type`. Avoid open-ended fetches that page through everything — unless explicitly asked to build a comprehensive user profile as a background task.

Responses are paginated. After each page, decide whether you already have enough information to answer the user or whether you need to keep iterating. Stop as soon as you have what you need — do not exhaust all pages by default.

Use `fabric_list_interaction_types` first if you are unsure which interaction types are available.
