export type RelationshipMemoryType =
  | "theme"
  | "fear"
  | "goal"
  | "contradiction"
  | "behavioral_pattern"
  | "emotional_state"
  | "recurring_phrase"
  | "motivation"
  | "identity"
  | "trigger"
  | "commitment"
  | "decision"
  | "outcome"
  | "progress"
  | "shift";

export interface AdvisorEvolution {
  evolving_summary: string;
  shift_notes: string;
  progress_notes: string;
  version: number;
  updated_at: string;
}

export interface ConversationSummaryRow {
  conversation_id: string;
  summary: string;
  open_threads: string[];
  message_count: number;
  updated_at: string;
}

export interface CrossSessionSnippet {
  conversation_id: string;
  title: string | null;
  updated_at: string;
  lines: { role: "user" | "assistant"; content: string }[];
}

export interface RelationshipMemoryRow {
  memory_type: string;
  content: string;
  evidence?: string | null;
  observation_count?: number;
  last_observed_at?: string | null;
  weight?: number;
}

export interface AdvisorRelationshipContext {
  evolution: AdvisorEvolution | null;
  currentConversationSummary: ConversationSummaryRow | null;
  conversationSummaries: ConversationSummaryRow[];
  crossSessionSnippets: CrossSessionSnippet[];
  memories: RelationshipMemoryRow[];
  stats: {
    conversationCount: number;
    messageCount: number;
    memoryCount: number;
  };
}

export interface ExtractedRelationshipItem {
  memory_type: RelationshipMemoryType;
  content: string;
  evidence: string;
}

export interface RelationshipExtraction {
  items: ExtractedRelationshipItem[];
}
