export type AdvisorDepth = "early" | "developing" | "established" | "deep";

export interface AdvisorRelationshipStats {
  conversationCount: number;
  messageCount: number;
  memoryCount: number;
}

export function computeAdvisorDepth(stats: AdvisorRelationshipStats): AdvisorDepth {
  const score =
    stats.conversationCount * 2 +
    Math.floor(stats.messageCount / 4) +
    stats.memoryCount;

  if (score >= 40) return "deep";
  if (score >= 18) return "established";
  if (score >= 6) return "developing";
  return "early";
}

export function depthInstructions(depth: AdvisorDepth): string {
  switch (depth) {
    case "early":
      return `RELATIONSHIP DEPTH: EARLY (first few exchanges)
- Be clear and practical. Prove you read their dossier.
- Ask one sharp question when needed — don't interview them.
- Surface one pattern they may not have named yet.`;
    case "developing":
      return `RELATIONSHIP DEPTH: DEVELOPING
- Reference patterns from past conversations and memory — not just the dossier.
- Connect today's issue to a recurring theme you've seen before.
- Go one layer deeper than generic advice. Name the tradeoff they're avoiding.`;
    case "established":
      return `RELATIONSHIP DEPTH: ESTABLISHED
- You know this person. Speak with earned familiarity.
- Call out repeats directly: "Same pattern as last time — different details."
- Predict what they'll do before they say it. Challenge the story they tell themselves.`;
    case "deep":
      return `RELATIONSHIP DEPTH: DEEP
- Maximum insight density. No re-explaining basics they already know.
- Connect distant patterns across topics. Show how one blind spot shows up everywhere.
- Push toward harder truths they haven't fully accepted yet — always with a concrete next move.`;
  }
}
