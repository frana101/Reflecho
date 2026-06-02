export type QuestionType = "multiple_choice";

export type AssessmentSection =
  | "Reality Processing"
  | "Decision Architecture"
  | "Identity Architecture"
  | "Execution Architecture";

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
  "Reality Processing",
  "Decision Architecture",
  "Identity Architecture",
  "Execution Architecture",
];

export const QUESTIONS: Question[] = [
  // ── SECTION 1: REALITY PROCESSING (scored) ──
  {
    id: "Q1",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      'A startup CEO repeatedly tells employees: "We\'re building for the long term."\n\nOver the next year:\n• compensation shifts toward short-term sales bonuses\n• customer support headcount shrinks\n• marketing spend doubles\n• quarterly targets become increasingly aggressive\n\nMost accurate conclusion?',
    question_type: "multiple_choice",
    options: [
      "The CEO is lying.",
      "The CEO changed priorities.",
      "Public narrative and operational incentives are diverging.",
      "Long-term thinking is impossible in startups.",
    ],
    correct_option: "Public narrative and operational incentives are diverging.",
    psychological_goal: "Distinguish incentives from intent without assuming deception.",
    measured_dimensions: [
      "incentive_detection",
      "reality_orientation",
      "contradiction_detection",
    ],
    traits_to_track: ["narrative_vs_incentive", "intent_vs_signal"],
  },
  {
    id: "Q2",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "During a negotiation:\n\nPerson A has more money.\nPerson B has more expertise.\nPerson C can walk away most easily.\n\nWho likely has the strongest position?",
    question_type: "multiple_choice",
    options: ["A", "B", "C", "Impossible to determine"],
    correct_option: "Impossible to determine",
    psychological_goal: "Leverage ambiguity — avoid overvaluing one source.",
    measured_dimensions: ["power_detection", "incentive_detection", "uncertainty_tolerance"],
    traits_to_track: ["context_dependent_leverage", "overconfidence_check"],
  },
  {
    id: "Q3",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "A senior executive is widely respected internally.\n\nA newer employee frequently challenges them publicly.\n\nThe executive never responds defensively.\n\nMost likely explanation?",
    question_type: "multiple_choice",
    options: [
      "The executive is weak.",
      "The executive doesn't notice.",
      "The executive's status is not threatened.",
      "The executive secretly agrees.",
    ],
    correct_option: "The executive's status is not threatened.",
    psychological_goal: "Status detection — challenge vs threat calibration.",
    measured_dimensions: ["status_detection", "social_reasoning", "power_detection"],
    traits_to_track: ["status_security", "threat_calibration"],
  },
  {
    id: "Q4",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      'A founder says: "I hire only the best people."\n\nYou discover:\n• several senior hires are mediocre\n• almost all senior hires are extremely loyal\n\nMost accurate conclusion?',
    question_type: "multiple_choice",
    options: [
      "The founder cannot judge talent.",
      'Loyalty is part of the founder\'s definition of "best."',
      "The founder is dishonest.",
      "Hiring mistakes happen.",
    ],
    correct_option: 'Loyalty is part of the founder\'s definition of "best."',
    psychological_goal: "Infer hidden definition from behavior cluster.",
    measured_dimensions: ["incentive_detection", "reality_orientation"],
    traits_to_track: ["stated_vs_revealed_priority", "loyalty_signal"],
  },
  {
    id: "Q5",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "Two people have identical job titles.\n\nPerson A receives more respect.\nPerson B receives more compliance.\n\nWho has more power?",
    question_type: "multiple_choice",
    options: ["A", "B", "Equal", "Cannot determine"],
    correct_option: "Cannot determine",
    psychological_goal: "Respect vs compliance as distinct power forms.",
    measured_dimensions: ["power_detection", "status_detection"],
    traits_to_track: ["respect_vs_compliance", "power_type_literacy"],
  },
  {
    id: "Q6",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "Someone consistently gives excellent advice.\n\nTheir own life is poorly managed.\n\nMost accurate interpretation?",
    question_type: "multiple_choice",
    options: [
      "Their advice is invalid.",
      "Knowledge and execution are separate capabilities.",
      "They are hypocritical.",
      "They are unintelligent.",
    ],
    correct_option: "Knowledge and execution are separate capabilities.",
    psychological_goal: "Separate insight capacity from execution capacity.",
    measured_dimensions: ["reality_orientation", "contradiction_detection"],
    traits_to_track: ["knowledge_execution_split", "hypocrisy_avoidance"],
  },
  {
    id: "Q7",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "A company promotes a highly competent employee.\n\nProductivity falls afterward.\n\nMost accurate explanation?",
    question_type: "multiple_choice",
    options: [
      "The promotion was a mistake.",
      "Management incompetence.",
      "Success in one role does not guarantee success in another.",
      "The employee became lazy.",
    ],
    correct_option: "Success in one role does not guarantee success in another.",
    psychological_goal: "Role transfer failure — avoid attribution error.",
    measured_dimensions: ["reality_orientation", "social_reasoning"],
    traits_to_track: ["role_competence_transfer", "attribution_discipline"],
  },
  {
    id: "Q8",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "You meet someone who:\n• asks thoughtful questions\n• remembers details\n• creates strong rapport\n\nAfterward you feel unusually understood.\n\nMost accurate first conclusion?",
    question_type: "multiple_choice",
    options: [
      "They genuinely care.",
      "They are highly socially skilled.",
      "They are manipulating you.",
      "Insufficient information.",
    ],
    correct_option: "Insufficient information.",
    psychological_goal: "Resist cynical over-attribution from rapport signals.",
    measured_dimensions: ["manipulation_detection", "reality_orientation", "uncertainty_tolerance"],
    traits_to_track: ["cynicism_check", "evidence_before_inference"],
  },
  {
    id: "Q9",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "An influential person frequently changes opinions.\n\nDespite this, followers trust them more over time.\n\nMost likely reason?",
    question_type: "multiple_choice",
    options: [
      "Followers are irrational.",
      "Consistency matters less than perceived competence.",
      "Followers don't notice contradictions.",
      "The person is charismatic.",
    ],
    correct_option: "Consistency matters less than perceived competence.",
    psychological_goal: "Status dynamics — competence vs consistency.",
    measured_dimensions: ["status_detection", "social_reasoning", "incentive_detection"],
    traits_to_track: ["competence_over_consistency", "follower_incentive_read"],
  },
  {
    id: "Q10",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "A manager receives strong results.\n\nEmployee turnover remains extremely high.\n\nMost accurate interpretation?",
    question_type: "multiple_choice",
    options: [
      "Good manager.",
      "Bad manager.",
      "Results and leadership quality may be measuring different things.",
      "Employees are weak.",
    ],
    correct_option: "Results and leadership quality may be measuring different things.",
    psychological_goal: "Separate outcome metrics from leadership quality.",
    measured_dimensions: ["reality_orientation", "incentive_detection"],
    traits_to_track: ["metric_vs_mechanism", "leadership_read"],
  },
  {
    id: "Q11",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      'A person says: "I value honesty above everything."\n\nYou observe them avoiding uncomfortable truths that threaten relationships.\n\nMost accurate conclusion?',
    question_type: "multiple_choice",
    options: [
      "They lied.",
      "Their values are fake.",
      "Their behavior reveals competing priorities.",
      "Honesty is impossible.",
    ],
    correct_option: "Their behavior reveals competing priorities.",
    psychological_goal: "Competing priorities without moral judgment.",
    measured_dimensions: ["contradiction_detection", "reality_orientation"],
    traits_to_track: ["stated_vs_revealed", "priority_conflict"],
  },
  {
    id: "Q12",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "Three people are discussing a decision.\n\nPerson A speaks most.\nPerson B makes the final recommendation.\nPerson C says very little.\n\nThe decision ends up matching what Person C privately wanted.\n\nWho likely held the most influence?",
    question_type: "multiple_choice",
    options: ["A", "B", "C", "Unknown"],
    correct_option: "Unknown",
    psychological_goal: "Resist overconfidence in influence attribution.",
    measured_dimensions: ["power_detection", "uncertainty_tolerance", "coalition_dynamics"],
    traits_to_track: ["influence_attribution_discipline", "overconfidence_check"],
  },
  {
    id: "Q13",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "A competitor publicly criticizes your strategy.\n\nPrivately they begin copying parts of it.\n\nMost accurate interpretation?",
    question_type: "multiple_choice",
    options: [
      "They were wrong.",
      "They are hypocrites.",
      "Public positioning and private incentives differ.",
      "They changed their mind.",
    ],
    correct_option: "Public positioning and private incentives differ.",
    psychological_goal: "Public vs private incentive divergence.",
    measured_dimensions: ["incentive_detection", "reality_orientation", "status_detection"],
    traits_to_track: ["public_private_gap", "reputation_management_read"],
  },
  {
    id: "Q14",
    section: "Reality Processing",
    category: "Reality Processing",
    question: "Which behavior is the strongest signal of a person's priorities?",
    question_type: "multiple_choice",
    options: [
      "What they say repeatedly.",
      "What they spend money on.",
      "What they spend time on.",
      "What they consistently sacrifice for.",
    ],
    correct_option: "What they consistently sacrifice for.",
    psychological_goal: "Sacrifice as revealed preference over stated intent.",
    measured_dimensions: ["reality_orientation", "incentive_detection"],
    traits_to_track: ["sacrifice_signal", "revealed_preference"],
  },
  {
    id: "Q15",
    section: "Reality Processing",
    category: "Reality Processing",
    question:
      "You observe a leader making several decisions that appear irrational.\n\nWhich is usually the safest assumption?",
    question_type: "multiple_choice",
    options: [
      "The leader is incompetent.",
      "Important information is missing.",
      "The leader has hidden motives.",
      "The leader is emotional.",
    ],
    correct_option: "Important information is missing.",
    psychological_goal: "Elite perception starts with missing information, not certainty.",
    measured_dimensions: ["reality_orientation", "uncertainty_tolerance", "incentive_detection"],
    traits_to_track: ["missing_info_first", "overconfidence_avoidance"],
  },

  // ── SECTION 2: DECISION ARCHITECTURE ──
  {
    id: "Q16",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question:
      "A major opportunity appears. You have 70% of the information you want. What feels most natural?",
    question_type: "multiple_choice",
    options: [
      "Move immediately.",
      "Gather more information.",
      "Test on a small scale.",
      "Wait for certainty.",
    ],
    psychological_goal: "Certainty requirements, exploration vs exploitation.",
    measured_dimensions: [
      "certainty_requirement",
      "exploration_exploitation",
      "uncertainty_tolerance",
    ],
    traits_to_track: ["decision_speed", "information_hunger"],
  },
  {
    id: "Q17",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question:
      "A project is 80% complete. Energy is gone. You usually:",
    question_type: "multiple_choice",
    options: [
      "Finish immediately.",
      "Drift to something more exciting.",
      "Force completion.",
      "Delegate or avoid.",
    ],
    psychological_goal: "Follow-through vs novelty under decay.",
    measured_dimensions: ["execution_reliability", "delay_discounting"],
    traits_to_track: ["completion_bias", "novelty_escape"],
  },
  {
    id: "Q18",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "You must choose between:",
    question_type: "multiple_choice",
    options: [
      "High upside / high uncertainty",
      "Moderate upside / moderate certainty",
      "Low upside / high certainty",
      "No decision yet",
    ],
    psychological_goal: "Risk calibration under forced tradeoff.",
    measured_dimensions: ["risk_calibration", "optimisation_satisficing"],
    traits_to_track: ["risk_appetite", "decision_avoidance"],
  },
  {
    id: "Q19",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "Someone challenges your idea publicly. First instinct?",
    question_type: "multiple_choice",
    options: [
      "Defend.",
      "Examine if they're right.",
      "Stay quiet.",
      "Counterattack.",
    ],
    psychological_goal: "Conflict style under public evaluation.",
    measured_dimensions: ["conflict_style", "competence_protection"],
    traits_to_track: ["public_challenge", "epistemic_vs_ego"],
    contradiction_targets: ["Q33", "Q26"],
  },
  {
    id: "Q20",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question:
      "You receive conflicting advice from two successful people. You:",
    question_type: "multiple_choice",
    options: [
      "Follow one.",
      "Build your own conclusion.",
      "Gather more perspectives.",
      "Delay action.",
    ],
    psychological_goal: "Autonomy vs belonging in decision-making.",
    measured_dimensions: ["autonomy_vs_belonging", "certainty_requirement"],
    traits_to_track: ["independent_synthesis", "analysis_loop"],
  },
  {
    id: "Q21",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "When entering a new field:",
    question_type: "multiple_choice",
    options: [
      "Learn fundamentals.",
      "Find shortcuts.",
      "Learn from operators.",
      "Experiment immediately.",
    ],
    psychological_goal: "Learning style, exploration bias.",
    measured_dimensions: ["exploration_exploitation", "learning_style"],
    traits_to_track: ["fundamentals_vs_shortcuts"],
  },
  {
    id: "Q22",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "Your biggest mistakes usually come from:",
    question_type: "multiple_choice",
    options: [
      "Moving too quickly.",
      "Waiting too long.",
      "Trusting people.",
      "Overcomplicating.",
    ],
    psychological_goal: "Self-attributed failure mode — cross-check behavior.",
    measured_dimensions: ["risk_calibration", "execution_reliability"],
    traits_to_track: ["stated_failure_mode"],
  },
  {
    id: "Q23",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "When a decision becomes emotionally important:",
    question_type: "multiple_choice",
    options: [
      "Act faster.",
      "Analyse more.",
      "Seek opinions.",
      "Avoid deciding.",
    ],
    psychological_goal: "Emotional load on decision architecture.",
    measured_dimensions: ["certainty_requirement", "threat_response"],
    traits_to_track: ["affect_decision_shift"],
  },
  {
    id: "Q24",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "You would rather be:",
    question_type: "multiple_choice",
    options: [
      "Highly respected.",
      "Extremely free.",
      "Financially secure.",
      "Deeply understood.",
    ],
    psychological_goal: "Forced hierarchy — status, freedom, security, belonging.",
    measured_dimensions: [
      "status_priority",
      "freedom_priority",
      "security_priority",
      "belonging_priority",
    ],
    traits_to_track: ["value_hierarchy"],
  },
  {
    id: "Q25",
    section: "Decision Architecture",
    category: "Decision Architecture",
    question: "When uncertainty rises:",
    question_type: "multiple_choice",
    options: [
      "Energy increases.",
      "Energy stays stable.",
      "Energy drops.",
      "Depends on context.",
    ],
    psychological_goal: "Uncertainty tolerance — energy response.",
    measured_dimensions: ["uncertainty_tolerance", "threat_response"],
    traits_to_track: ["uncertainty_energy"],
  },

  // ── SECTION 3: IDENTITY ARCHITECTURE ──
  {
    id: "Q26",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "Which outcome would bother you most?",
    question_type: "multiple_choice",
    options: [
      "Being seen as incompetent",
      "Being ignored",
      "Losing your freedom",
      "Letting people down",
    ],
    psychological_goal: "Competence vs significance vs freedom vs belonging threat.",
    measured_dimensions: [
      "competence_identity",
      "significance",
      "freedom",
      "belonging",
    ],
    traits_to_track: ["primary_threat"],
  },
  {
    id: "Q27",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "You succeed at something important. Which part feels best?",
    question_type: "multiple_choice",
    options: [
      "Knowing you earned it",
      "Being recognised for it",
      "The options it creates",
      "Proving doubters wrong",
    ],
    psychological_goal: "What success reinforces in identity.",
    measured_dimensions: ["competence", "status", "freedom", "significance"],
    traits_to_track: ["success_salience"],
  },
  {
    id: "Q28",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "A project fails. What hurts most?",
    question_type: "multiple_choice",
    options: [
      "Wasted effort",
      "Public embarrassment",
      "Lost opportunity",
      "Disappointing people",
    ],
    psychological_goal: "Failure threat — humiliation vs relevance vs belonging.",
    measured_dimensions: ["humiliation", "irrelevance", "belonging", "competence"],
    traits_to_track: ["failure_wound"],
  },
  {
    id: "Q29",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question:
      "You enter a room full of highly successful people. Your attention naturally goes to:",
    question_type: "multiple_choice",
    options: [
      "Who is most respected",
      "Who has most influence",
      "Who seems most competent",
      "Who seems most authentic",
    ],
    psychological_goal: "Status vs power vs competence vs authenticity scan.",
    measured_dimensions: ["status_orientation", "power_awareness", "competence"],
    traits_to_track: ["room_scan_priority"],
  },
  {
    id: "Q30",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "Someone misunderstands you. What bothers you most?",
    question_type: "multiple_choice",
    options: [
      "They think you're less intelligent than you are",
      "They think you're a bad person",
      "They don't understand your intentions",
      "It doesn't bother you much",
    ],
    psychological_goal: "Competence vs moral identity vs intent vs detachment.",
    measured_dimensions: ["competence", "moral_identity", "significance"],
    traits_to_track: ["misrecognition_wound"],
  },
  {
    id: "Q31",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "You must choose one life:",
    question_type: "multiple_choice",
    options: [
      "Highly respected but limited freedom",
      "Completely free but largely unknown",
      "Financially secure but unremarkable",
      "Deeply loved but average achievement",
    ],
    psychological_goal: "Long-horizon identity hierarchy under constraint.",
    measured_dimensions: ["status", "freedom", "security", "belonging"],
    traits_to_track: ["life_tradeoff"],
  },
  {
    id: "Q32",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "You are excluded from an opportunity. What creates the strongest reaction?",
    question_type: "multiple_choice",
    options: [
      "It was unfair",
      "Someone less capable got it",
      "You wanted the experience",
      "Others will notice",
    ],
    psychological_goal: "Rejection, status, experience, visibility threat.",
    measured_dimensions: ["rejection", "status", "humiliation", "significance"],
    traits_to_track: ["exclusion_response"],
  },
  {
    id: "Q33",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "Which criticism would sting most?",
    question_type: "multiple_choice",
    options: [
      "You're not as capable as you think.",
      "Nobody really notices you.",
      "You're unreliable.",
      "People don't trust you.",
    ],
    psychological_goal: "Competence inflation vs irrelevance vs execution vs moral.",
    measured_dimensions: [
      "competence",
      "significance",
      "execution",
      "moral_identity",
    ],
    traits_to_track: ["criticism_wound"],
    contradiction_targets: ["Q19"],
  },
  {
    id: "Q34",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question:
      "If nobody could ever know you did it, which would still motivate you most?",
    question_type: "multiple_choice",
    options: [
      "Building something impressive",
      "Helping people",
      "Solving difficult problems",
      "Gaining freedom",
    ],
    psychological_goal: "Private vs public motivation — status vs mastery vs care.",
    measured_dimensions: ["status", "competence", "belonging", "freedom"],
    traits_to_track: ["private_motive"],
  },
  {
    id: "Q35",
    section: "Identity Architecture",
    category: "Identity Architecture",
    question: "You discover somebody secretly dislikes you. First reaction?",
    question_type: "multiple_choice",
    options: ["Curiosity", "Irritation", "Self-reflection", "Indifference"],
    psychological_goal: "Rejection threat response style.",
    measured_dimensions: ["rejection", "self_deception", "conflict_style"],
    traits_to_track: ["hidden_dislike_response"],
  },

  // ── SECTION 4: EXECUTION ARCHITECTURE ──
  {
    id: "Q36",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "A project becomes repetitive. What usually happens?",
    question_type: "multiple_choice",
    options: [
      "I keep going.",
      "Motivation drops significantly.",
      "I look for ways to optimise it.",
      "I become distracted by new opportunities.",
    ],
    psychological_goal: "Consistency vs friction tolerance vs novelty.",
    measured_dimensions: ["consistency", "friction_tolerance", "delay_discounting"],
    traits_to_track: ["repetition_response"],
  },
  {
    id: "Q37",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "You have a full day with no obligations. Most likely outcome?",
    question_type: "multiple_choice",
    options: [
      "Productive structure emerges naturally.",
      "I work in bursts.",
      "I drift between interests.",
      "Very little gets done.",
    ],
    psychological_goal: "Self-regulation without external structure.",
    measured_dimensions: ["self_regulation", "consistency", "execution_reliability"],
    traits_to_track: ["unstructured_default"],
  },
  {
    id: "Q38",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "Which causes more problems in your life?",
    question_type: "multiple_choice",
    options: [
      "Acting too quickly",
      "Waiting too long",
      "Starting too much",
      "Finishing too little",
    ],
    psychological_goal: "Self-attributed execution bottleneck.",
    measured_dimensions: ["follow_through", "delay_discounting", "risk_calibration"],
    traits_to_track: ["stated_execution_limit"],
  },
  {
    id: "Q39",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "When motivation disappears:",
    question_type: "multiple_choice",
    options: [
      "I continue anyway.",
      "Progress slows.",
      "I seek external pressure.",
      "I usually stop.",
    ],
    psychological_goal: "Follow-through under motivational collapse.",
    measured_dimensions: ["follow_through", "self_regulation", "consistency"],
    traits_to_track: ["motivation_collapse"],
  },
  {
    id: "Q40",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question:
      "You have three important tasks. You can realistically complete only one today. You choose:",
    question_type: "multiple_choice",
    options: ["Most impactful", "Fastest", "Most difficult", "Most urgent"],
    psychological_goal: "Priority algorithm under constraint.",
    measured_dimensions: ["optimisation_satisficing", "execution_reliability"],
    traits_to_track: ["task_selection"],
  },
  {
    id: "Q41",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "How do you usually prepare for important opportunities?",
    question_type: "multiple_choice",
    options: [
      "Act quickly and adapt.",
      "Prepare extensively first.",
      "Test cautiously.",
      "Delay until confidence increases.",
    ],
    psychological_goal: "Action vs preparation vs avoidance.",
    measured_dimensions: ["certainty_requirement", "execution_reliability"],
    traits_to_track: ["prep_style"],
  },
  {
    id: "Q42",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "You learn a new skill. The biggest risk is:",
    question_type: "multiple_choice",
    options: [
      "Losing interest.",
      "Becoming overwhelmed.",
      "Jumping between methods.",
      "Not practicing enough.",
    ],
    psychological_goal: "Learning execution failure mode.",
    measured_dimensions: ["consistency", "friction_tolerance", "learning_style"],
    traits_to_track: ["skill_acquisition_risk"],
  },
  {
    id: "Q43",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "When a goal matters deeply:",
    question_type: "multiple_choice",
    options: [
      "Effort increases.",
      "Analysis increases.",
      "Anxiety increases.",
      "Avoidance increases.",
    ],
    psychological_goal: "High-stakes execution response.",
    measured_dimensions: ["self_regulation", "threat_response", "follow_through"],
    traits_to_track: ["high_stakes_mode"],
  },
  {
    id: "Q44",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "You miss a self-imposed deadline. Your first instinct?",
    question_type: "multiple_choice",
    options: [
      "Adjust and continue.",
      "Criticise yourself.",
      "Re-plan everything.",
      "Disengage temporarily.",
    ],
    psychological_goal: "Self-regulation after failure.",
    measured_dimensions: ["self_regulation", "competence_protection"],
    traits_to_track: ["deadline_miss_response"],
  },
  {
    id: "Q45",
    section: "Execution Architecture",
    category: "Execution Architecture",
    question: "Which statement feels most true?",
    question_type: "multiple_choice",
    options: [
      "I struggle more with action than understanding.",
      "I struggle more with consistency than effort.",
      "I struggle more with focus than motivation.",
      "I struggle more with finishing than starting.",
    ],
    psychological_goal: "Self-reported execution bottleneck — cross-check Q36–Q44.",
    measured_dimensions: ["execution_reliability", "self_deception"],
    traits_to_track: ["admitted_execution_limit"],
    contradiction_targets: ["Q36", "Q39", "Q38"],
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
