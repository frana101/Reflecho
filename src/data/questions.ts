export type QuestionType = "multiple_choice";

export type AssessmentSection =
  | "Reality Reading"
  | "Decision Style"
  | "Execution"
  | "Drivers & Pressure";

export interface Question {
  id: string;
  section: AssessmentSection;
  category: AssessmentSection;
  question: string;
  question_type: QuestionType;
  options: string[];
  psychological_goal: string;
  measured_dimensions: string[];
  traits_to_track: string[];
  /** Internal scoring only — never shown to the user during the test */
  correct_option?: string;
  contradiction_targets?: string[];
}

export const CATEGORIES: AssessmentSection[] = [
  "Reality Reading",
  "Decision Style",
  "Execution",
  "Drivers & Pressure",
];

export const QUESTIONS: Question[] = [
  {
    id: "Q1",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      'A company says:\n\n"We reward innovation."\n\nEmployees who openly challenge leadership rarely get promoted.\n\nWhat\'s the strongest conclusion?',
    question_type: "multiple_choice",
    options: [
      "Leadership values innovation but employees challenge poorly",
      "Innovation is encouraged only within accepted boundaries",
      "Promotions are unrelated",
      "Not enough information",
    ],
    correct_option: "Innovation is encouraged only within accepted boundaries",
    psychological_goal: "Read incentives behind stated values.",
    measured_dimensions: ["incentive_detection", "narrative_vs_behavior"],
    traits_to_track: ["stated_vs_actual", "boundary_reading"],
  },
  {
    id: "Q2",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      'A founder says:\n\n"I only care about results."\n\nYet repeatedly keeps mediocre employees who are personally loyal.\n\nWhat\'s the strongest signal?',
    question_type: "multiple_choice",
    options: [
      "The founder is irrational",
      "Loyalty is part of how they define value",
      "Results don't matter",
      "The employees have hidden skills",
    ],
    correct_option: "Loyalty is part of how they define value",
    psychological_goal: "Infer hidden definitions from behavior.",
    measured_dimensions: ["incentive_detection", "behavior_clustering"],
    traits_to_track: ["loyalty_vs_performance", "hidden_values"],
  },
  {
    id: "Q3",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "Two people enter the same industry.\n\nOne talks constantly about strategy.\n\nThe other quietly builds relationships.\n\nFive years later, the second person has more influence.\n\nWhat's the most likely reason?",
    question_type: "multiple_choice",
    options: [
      "Better luck",
      "Relationships create leverage most people underestimate",
      "The first person wasn't smart",
      "Strategy doesn't matter",
    ],
    correct_option: "Relationships create leverage most people underestimate",
    psychological_goal: "Weigh quiet leverage vs visible strategy.",
    measured_dimensions: ["leverage_detection", "social_capital"],
    traits_to_track: ["relationship_leverage", "strategy_bias"],
  },
  {
    id: "Q4",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      'A manager says:\n\n"You can always be honest with me."\n\nEmployees rarely disagree with them in meetings.\n\nWhat\'s the most useful question?',
    question_type: "multiple_choice",
    options: [
      "Are employees dishonest?",
      "What happens when someone disagrees?",
      "Are meetings productive?",
      "Does the manager realize it?",
    ],
    correct_option: "What happens when someone disagrees?",
    psychological_goal: "Test stated openness against real consequences.",
    measured_dimensions: ["power_dynamics", "signal_vs_claim"],
    traits_to_track: ["disagreement_cost", "psychological_safety_read"],
  },
  {
    id: "Q5",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "Someone publicly criticizes a competitor while privately copying their strategy.\n\nWhat's the strongest explanation?",
    question_type: "multiple_choice",
    options: [
      "They genuinely disagree",
      "Public positioning and private incentives differ",
      "They're confused",
      "The strategy doesn't work",
    ],
    correct_option: "Public positioning and private incentives differ",
    psychological_goal: "Separate public narrative from private action.",
    measured_dimensions: ["incentive_detection", "positioning_vs_action"],
    traits_to_track: ["public_private_gap", "strategic_posturing"],
  },
  {
    id: "Q6",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "You have roughly 70% of the information needed for an important decision.\n\nYou usually:",
    question_type: "multiple_choice",
    options: ["Decide", "Gather a little more", "Keep researching", "Ask others first"],
    psychological_goal: "Measure decision threshold under uncertainty.",
    measured_dimensions: ["decision_speed", "uncertainty_tolerance"],
    traits_to_track: ["information_threshold", "analysis_vs_action"],
  },
  {
    id: "Q7",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "Two respected people give completely opposite advice.\n\nYou usually:",
    question_type: "multiple_choice",
    options: [
      "Follow the more successful one",
      "Follow the one you trust more",
      "Build your own conclusion",
      "Delay the decision",
    ],
    psychological_goal: "Map authority vs independent judgment.",
    measured_dimensions: ["authority_deference", "independent_judgment"],
    traits_to_track: ["advice_processing", "self_sourced_decisions"],
  },
  {
    id: "Q8",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "A high-upside opportunity appears with significant uncertainty.\n\nYour first reaction is:",
    question_type: "multiple_choice",
    options: ["Excitement", "Caution", "Analysis", "Avoidance"],
    psychological_goal: "Capture first response to asymmetric upside.",
    measured_dimensions: ["risk_orientation", "opportunity_response"],
    traits_to_track: ["upside_reaction", "uncertainty_first_move"],
  },
  {
    id: "Q9",
    section: "Decision Style",
    category: "Decision Style",
    question: "What's caused more problems in your life?",
    question_type: "multiple_choice",
    options: [
      "Moving too fast",
      "Waiting too long",
      "Trusting others",
      "Taking the wrong advice",
    ],
    psychological_goal: "Identify dominant decision regret pattern.",
    measured_dimensions: ["speed_vs_delay", "regret_pattern"],
    traits_to_track: ["action_regret", "patience_regret"],
  },
  {
    id: "Q10",
    section: "Decision Style",
    category: "Decision Style",
    question: "When making an important decision, what bothers you most?",
    question_type: "multiple_choice",
    options: [
      "Missing an opportunity",
      "Looking foolish",
      "Losing control",
      "Making the wrong choice",
    ],
    psychological_goal: "Surface core decision fear.",
    measured_dimensions: ["decision_fear", "loss_aversion_type"],
    traits_to_track: ["fomo", "status_risk", "control_need", "error_aversion"],
  },
  {
    id: "Q11",
    section: "Execution",
    category: "Execution",
    question:
      "A project is 80% finished, but the exciting part is done.\n\nWhat usually happens?",
    question_type: "multiple_choice",
    options: [
      "I finish immediately",
      "I finish eventually",
      "I get distracted by something new",
      "I stop",
    ],
    psychological_goal: "Measure finish-line discipline.",
    measured_dimensions: ["completion_drive", "novelty_bias"],
    traits_to_track: ["last_mile", "shiny_object"],
  },
  {
    id: "Q12",
    section: "Execution",
    category: "Execution",
    question: "You have a completely free day.\n\nWhat happens most often?",
    question_type: "multiple_choice",
    options: [
      "I execute my priorities",
      "I work but jump between things",
      "I explore random interests",
      "I waste most of it",
    ],
    psychological_goal: "Measure unstructured time use.",
    measured_dimensions: ["self_direction", "focus_under_freedom"],
    traits_to_track: ["priority_execution", "scatter"],
  },
  {
    id: "Q13",
    section: "Execution",
    category: "Execution",
    question: "When motivation disappears, what happens?",
    question_type: "multiple_choice",
    options: [
      "Progress stays mostly the same",
      "Progress slows slightly",
      "Progress slows significantly",
      "Progress stops",
    ],
    psychological_goal: "Measure motivation dependence.",
    measured_dimensions: ["motivation_dependence", "consistency"],
    traits_to_track: ["motivation_coupling", "discipline_floor"],
  },
  {
    id: "Q14",
    section: "Execution",
    category: "Execution",
    question: "When learning a new skill, your biggest risk is:",
    question_type: "multiple_choice",
    options: [
      "Starting too late",
      "Getting overwhelmed",
      "Losing interest",
      "Choosing the wrong thing",
    ],
    psychological_goal: "Identify primary execution bottleneck in learning.",
    measured_dimensions: ["learning_blocker", "commitment_pattern"],
    traits_to_track: ["start_delay", "interest_decay", "choice_paralysis"],
  },
  {
    id: "Q15",
    section: "Execution",
    category: "Execution",
    question: "After missing a self-imposed deadline, you usually:",
    question_type: "multiple_choice",
    options: [
      "Continue immediately",
      "Adjust the plan",
      "Feel frustrated but continue",
      "Pull back for a while",
    ],
    psychological_goal: "Map recovery after self-imposed failure.",
    measured_dimensions: ["failure_recovery", "deadline_response"],
    traits_to_track: ["bounce_back", "withdrawal_pattern"],
  },
  {
    id: "Q16",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question: "Which outcome would bother you most?",
    question_type: "multiple_choice",
    options: [
      "Losing money",
      "Losing freedom",
      "Losing status",
      "Losing certainty",
    ],
    psychological_goal: "Rank core loss sensitivity.",
    measured_dimensions: ["core_driver", "loss_priority"],
    traits_to_track: ["freedom_drive", "status_drive", "certainty_drive"],
  },
  {
    id: "Q17",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question: "Success feels best when:",
    question_type: "multiple_choice",
    options: [
      "It gives me freedom",
      "Other people recognize it",
      "I know I earned it",
      "It proves I was right",
    ],
    psychological_goal: "Identify success reward source.",
    measured_dimensions: ["success_motivation", "recognition_need"],
    traits_to_track: ["autonomy_reward", "validation_reward", "mastery_reward"],
  },
  {
    id: "Q18",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question:
      "If nobody could ever know about your achievement, what would still motivate you most?",
    question_type: "multiple_choice",
    options: ["Money", "Freedom", "Mastery", "Impact"],
    psychological_goal: "Strip public recognition from motivation.",
    measured_dimensions: ["intrinsic_motivation", "private_drive"],
    traits_to_track: ["hidden_motivation", "public_private_reward"],
  },
  {
    id: "Q19",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question: "Someone publicly challenges your idea.\n\nYour first reaction is:",
    question_type: "multiple_choice",
    options: ["Defend it", "Check if they're right", "Explain yourself", "Feel annoyed"],
    psychological_goal: "Capture ego vs truth response under challenge.",
    measured_dimensions: ["ego_response", "feedback_receptivity"],
    traits_to_track: ["defensive_reflex", "truth_seeking"],
  },
  {
    id: "Q20",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question: "A goal becomes extremely important to your future.\n\nWhat usually happens?",
    question_type: "multiple_choice",
    options: [
      "I act faster",
      "I become more focused",
      "I prepare more",
      "I hesitate more",
    ],
    psychological_goal: "Map pressure response when stakes rise.",
    measured_dimensions: ["stakes_response", "pressure_pattern"],
    traits_to_track: ["high_stakes_action", "high_stakes_paralysis"],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export const REALITY_PROCESSING_QUESTIONS = QUESTIONS.filter(
  (q) => q.correct_option !== undefined,
);

export interface RealityProcessingScore {
  correct: number;
  total: number;
  accuracy_pct: number;
  by_question: { id: string; chosen: string; correct: boolean }[];
}

/** Score Section 1 internally — never expose correct answers to the user UI. */
export function scoreRealityProcessing(
  answers: Record<string, { choices?: string[] }>,
): RealityProcessingScore {
  const by_question: RealityProcessingScore["by_question"] = [];
  let correct = 0;

  for (const q of REALITY_PROCESSING_QUESTIONS) {
    const chosen = answers[q.id]?.choices?.[0] ?? "";
    const isCorrect = chosen === q.correct_option;
    if (isCorrect) correct += 1;
    by_question.push({ id: q.id, chosen, correct: isCorrect });
  }

  const total = REALITY_PROCESSING_QUESTIONS.length;
  return {
    correct,
    total,
    accuracy_pct: total ? Math.round((correct / total) * 100) : 0,
    by_question,
  };
}
