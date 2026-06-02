export type RadarKey =
  | "reality_processing"
  | "decision_architecture"
  | "identity_architecture"
  | "threat_architecture"
  | "social_operating_system"
  | "execution_system"
  | "self_deception_architecture";

export type ConfidenceLevel = "weak" | "moderate" | "strong";

export type PerceptionQuadrant =
  | "elite"
  | "pattern_seer"
  | "misses_manipulation"
  | "paranoid_interpreter";

export interface DossierSection {
  summary: string;
  bullets: string[];
  confidence?: ConfidenceLevel;
  confidence_pct?: number;
}

export interface RankedHierarchyItem {
  rank: number;
  label: string;
  score_pct: number;
  explanation: string;
  evidence: string[];
  confidence: ConfidenceLevel;
  confidence_pct: number;
}

export interface EvidenceChain {
  claim: string;
  chain: { question_id: string; signal: string }[];
  inference: string;
  confidence_pct: number;
  evidence_count: number;
  counter_evidence: string[];
  counter_evidence_count: number;
}

export interface ArchetypeAssignment {
  name: string;
  score_pct: number;
  core_drive: string;
  weapon: string;
  blind_spot: string;
}

export interface MechanismLink {
  driver: string;
  threat: string;
  coping_strategy: string;
  behavior: string;
}

export interface RootCause {
  rank: number;
  mechanism: string;
  explains: string[];
  coverage_pct: number;
  confidence_pct: number;
  evidence: string[];
}

export interface BehavioralPrediction {
  situation: string;
  prediction: string;
  mechanism: string;
  confidence_pct: number;
}

export interface SelfDeceptionItem {
  claim: string;
  evidence_for: string[];
  evidence_against: string[];
  inference: string;
  confidence_pct: number;
}

export interface PerceptionCalibration {
  accuracy_pct: number;
  bias_level: "low" | "moderate" | "high";
  quadrant: PerceptionQuadrant;
  summary: string;
}

export interface CognitiveDossier {
  core_diagnosis: string;
  summary: string;
  hierarchy: {
    core_drivers: RankedHierarchyItem[];
    core_threats: RankedHierarchyItem[];
    core_constraints: RankedHierarchyItem[];
  };
  perception_calibration: PerceptionCalibration;
  reality_processing_score: {
    correct: number;
    total: number;
    accuracy_pct: number;
    summary: string;
  };
  archetypes: {
    primary: ArchetypeAssignment;
    secondary: ArchetypeAssignment;
    shadow: ArchetypeAssignment;
  };
  evidence_chains: EvidenceChain[];
  mechanism_map: MechanismLink[];
  root_causes: RootCause[];
  self_deception_detector: SelfDeceptionItem[];
  behavioral_predictions: BehavioralPrediction[];
  strategic_adaptations: string[];
  reality_processing: DossierSection;
  decision_architecture: DossierSection;
  identity_architecture: DossierSection;
  threat_architecture: DossierSection;
  social_operating_system: DossierSection;
  execution_system: DossierSection;
  self_deception_architecture: DossierSection;
  blind_spot_architecture: {
    summary: string;
    items: {
      pattern: string;
      evidence: string;
      likely_cost: string;
      confidence_pct: number;
      evidence_count: number;
      counter_evidence: string[];
    }[];
  };
  radar_scores: Record<RadarKey, number>;
  memory_seeds: {
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
  }[];
}

export const RADAR_LABELS: Record<RadarKey, string> = {
  reality_processing: "Reality",
  decision_architecture: "Decisions",
  identity_architecture: "Identity",
  threat_architecture: "Threats",
  social_operating_system: "Social",
  execution_system: "Execution",
  self_deception_architecture: "Self-deception",
};

export const ARCHETYPE_FRAMEWORK = [
  "Strategist",
  "Builder",
  "Sovereign",
  "Operator",
  "Scholar",
  "Commander",
  "Architect",
  "Catalyst",
  "Connector",
  "Competitor",
] as const;

/** Store V2 analysis in trajectory_analysis.analysis_v2 for full round-trip. */
export function dossierToDbRow(d: CognitiveDossier) {
  const archetypeLine = `${d.archetypes.primary.name} ${d.archetypes.primary.score_pct}% · ${d.archetypes.secondary.name} ${d.archetypes.secondary.score_pct}%`;
  return {
    summary: `${d.core_diagnosis}\n\n${archetypeLine}\n\n${d.summary}`,
    cognitive_profile: d.reality_processing,
    motivational_engine: d.decision_architecture,
    identity_structure: d.identity_architecture,
    emotional_architecture: d.threat_architecture,
    execution_architecture: d.execution_system,
    social_dynamics: d.social_operating_system,
    blind_spots: d.blind_spot_architecture,
    trajectory_analysis: {
      analysis_v2: d,
      reality_processing_score: d.reality_processing_score,
      perception_calibration: d.perception_calibration,
      behavioral_predictions: d.behavioral_predictions,
      strategic_adaptations: d.strategic_adaptations,
    },
    radar_scores: d.radar_scores,
  };
}

export function dbRowToDossier(row: {
  summary?: string | null;
  cognitive_profile?: DossierSection | null;
  motivational_engine?: DossierSection | null;
  identity_structure?: DossierSection | null;
  emotional_architecture?: DossierSection | null;
  execution_architecture?: DossierSection | null;
  social_dynamics?: DossierSection | null;
  blind_spots?: CognitiveDossier["blind_spot_architecture"] | null;
  trajectory_analysis?: { analysis_v2?: CognitiveDossier } | null;
  radar_scores?: Record<string, number> | null;
}): CognitiveDossier {
  const v2 = row.trajectory_analysis?.analysis_v2;
  if (v2) {
    return { ...v2, memory_seeds: v2.memory_seeds ?? [] };
  }

  const defaultRadar: Record<RadarKey, number> = {
    reality_processing: 50,
    decision_architecture: 50,
    identity_architecture: 50,
    threat_architecture: 50,
    social_operating_system: 50,
    execution_system: 50,
    self_deception_architecture: 50,
  };

  const rawSummary = row.summary ?? "";
  const lines = rawSummary.split("\n\n");
  return {
    core_diagnosis: lines[0] ?? rawSummary,
    summary: lines.slice(2).join("\n\n") || lines[1] || "",
    hierarchy: { core_drivers: [], core_threats: [], core_constraints: [] },
    perception_calibration: {
      accuracy_pct: 0,
      bias_level: "moderate",
      quadrant: "misses_manipulation",
      summary: "",
    },
    reality_processing_score: {
      correct: 0,
      total: 15,
      accuracy_pct: 0,
      summary: "",
    },
    archetypes: {
      primary: {
        name: "Strategist",
        score_pct: 0,
        core_drive: "",
        weapon: "",
        blind_spot: "",
      },
      secondary: {
        name: "Builder",
        score_pct: 0,
        core_drive: "",
        weapon: "",
        blind_spot: "",
      },
      shadow: {
        name: "Operator",
        score_pct: 0,
        core_drive: "",
        weapon: "",
        blind_spot: "",
      },
    },
    evidence_chains: [],
    mechanism_map: [],
    root_causes: [],
    self_deception_detector: [],
    behavioral_predictions: [],
    strategic_adaptations: [],
    reality_processing: row.cognitive_profile ?? { summary: "", bullets: [] },
    decision_architecture: row.motivational_engine ?? { summary: "", bullets: [] },
    identity_architecture: row.identity_structure ?? { summary: "", bullets: [] },
    threat_architecture: row.emotional_architecture ?? { summary: "", bullets: [] },
    social_operating_system: row.social_dynamics ?? { summary: "", bullets: [] },
    execution_system: row.execution_architecture ?? { summary: "", bullets: [] },
    self_deception_architecture: { summary: "", bullets: [] },
    blind_spot_architecture: row.blind_spots ?? {
      summary: "",
      items: [],
    },
    radar_scores: { ...defaultRadar, ...(row.radar_scores as Record<RadarKey, number>) },
    memory_seeds: [],
  };
}
