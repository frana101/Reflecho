/** @deprecated Internal scoring only — not shown in the report. */
export type PerceptionQuadrant =
  | "elite"
  | "pattern_seer"
  | "misses_manipulation"
  | "paranoid_interpreter";

export interface DossierArchetype {
  name: string;
  description?: string;
  strength: string;
  weakness: string;
}

export interface MechanismMapItem {
  driver: string;
  threat: string;
  response: string;
  result: string;
}

export interface BlindSpotItem {
  pattern: string;
  cost: string;
}

export interface SelfDeceptionItem {
  belief: string;
  why_it_feels_true: string;
  what_may_be_happening: string;
}

export interface PredictionItem {
  situation: string;
  prediction: string;
}

export interface MemorySeed {
  memory_type:
    | "theme"
    | "fear"
    | "goal"
    | "contradiction"
    | "behavioral_pattern"
    | "emotional_state"
    | "recurring_phrase"
    | "motivation"
    | "identity"
    | "trigger";
  content: string;
  evidence?: string;
}

export interface CognitiveDossier {
  core_diagnosis: string;
  one_sentence_truth: string;
  archetype: DossierArchetype;
  drivers: string[];
  threats: string[];
  constraints: string[];
  mechanism_map: MechanismMapItem[];
  blind_spots: BlindSpotItem[];
  self_deception: SelfDeceptionItem[];
  predictions: PredictionItem[];
  action_plan: string[];
  opening_message: string;
  memory_seeds: MemorySeed[];
}

export const ARCHETYPE_NAMES = [
  "The Sovereign",
  "The Architect",
  "The Strategist",
  "The Builder",
  "The Competitor",
  "The Explorer",
  "The Commander",
  "The Analyst",
  "The Operator",
  "The Scholar",
  "The Catalyst",
  "The Connector",
] as const;

/** Legacy V2 shape — used only when loading old dossiers. */
interface LegacyDossierV2 {
  core_diagnosis?: string;
  summary?: string;
  archetypes?: {
    primary?: { name?: string; core_drive?: string; blind_spot?: string; weapon?: string };
  };
  hierarchy?: {
    core_drivers?: { label?: string; explanation?: string }[];
    core_threats?: { label?: string; explanation?: string }[];
    core_constraints?: { label?: string; explanation?: string }[];
  };
  mechanism_map?: { driver?: string; threat?: string; coping_strategy?: string; behavior?: string }[];
  blind_spot_architecture?: { items?: { pattern?: string; likely_cost?: string }[] };
  self_deception_detector?: {
    claim?: string;
    evidence_for?: string[];
    inference?: string;
  }[];
  behavioral_predictions?: { situation?: string; prediction?: string }[];
  strategic_adaptations?: string[];
  memory_seeds?: MemorySeed[];
}

function migrateLegacyV2(v2: LegacyDossierV2): CognitiveDossier {
  const primary = v2.archetypes?.primary;
  const name = primary?.name
    ? primary.name.startsWith("The ")
      ? primary.name
      : `The ${primary.name}`
    : "The Strategist";

  return {
    core_diagnosis: v2.core_diagnosis ?? v2.summary ?? "",
    one_sentence_truth: "",
    archetype: {
      name,
      description: primary?.core_drive ?? "",
      strength: primary?.weapon ?? "",
      weakness: primary?.blind_spot ?? "",
    },
    drivers:
      v2.hierarchy?.core_drivers?.slice(0, 3).map((d) => d.label ?? d.explanation ?? "") ??
      [],
    threats:
      v2.hierarchy?.core_threats?.slice(0, 3).map((t) => t.label ?? t.explanation ?? "") ??
      [],
    constraints:
      v2.hierarchy?.core_constraints
        ?.slice(0, 3)
        .map((c) => c.label ?? c.explanation ?? "") ?? [],
    mechanism_map:
      v2.mechanism_map?.map((m) => ({
        driver: m.driver ?? "",
        threat: m.threat ?? "",
        response: m.coping_strategy ?? "",
        result: m.behavior ?? "",
      })) ?? [],
    blind_spots:
      v2.blind_spot_architecture?.items?.map((b) => ({
        pattern: b.pattern ?? "",
        cost: b.likely_cost ?? "",
      })) ?? [],
    self_deception:
      v2.self_deception_detector?.slice(0, 3).map((s) => ({
        belief: s.claim ?? "",
        why_it_feels_true: s.evidence_for?.join(". ") ?? "",
        what_may_be_happening: s.inference ?? "",
      })) ?? [],
    predictions:
      v2.behavioral_predictions?.slice(0, 5).map((p) => ({
        situation: p.situation ?? "",
        prediction: p.prediction ?? "",
      })) ?? [],
    action_plan: v2.strategic_adaptations?.slice(0, 5) ?? [],
    opening_message: "",
    memory_seeds: v2.memory_seeds ?? [],
  };
}

export function dossierToDbRow(d: CognitiveDossier) {
  return {
    summary: `${d.archetype.name}\n\n${d.core_diagnosis}`,
    cognitive_profile: null,
    motivational_engine: null,
    identity_structure: null,
    emotional_architecture: null,
    execution_architecture: null,
    social_dynamics: null,
    blind_spots: { items: d.blind_spots },
    trajectory_analysis: { analysis_v3: d },
    radar_scores: null,
  };
}

export function dbRowToDossier(row: {
  summary?: string | null;
  trajectory_analysis?: {
    analysis_v3?: CognitiveDossier;
    analysis_v2?: LegacyDossierV2;
  } | null;
}): CognitiveDossier {
  const v3 = row.trajectory_analysis?.analysis_v3;
  if (v3) {
    return {
      ...v3,
      one_sentence_truth: v3.one_sentence_truth ?? "",
      opening_message: v3.opening_message ?? "",
      memory_seeds: v3.memory_seeds ?? [],
    };
  }

  const v2 = row.trajectory_analysis?.analysis_v2;
  if (v2) {
    return migrateLegacyV2(v2);
  }

  return {
    core_diagnosis: row.summary ?? "",
    one_sentence_truth: "",
    archetype: {
      name: "The Strategist",
      description: "",
      strength: "",
      weakness: "",
    },
    drivers: [],
    threats: [],
    constraints: [],
    mechanism_map: [],
    blind_spots: [],
    self_deception: [],
    predictions: [],
    action_plan: [],
    opening_message: "",
    memory_seeds: [],
  };
}
