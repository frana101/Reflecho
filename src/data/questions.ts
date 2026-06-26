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
      "Two people are trying to get the same thing from someone powerful.\n\nPerson A makes a strong, well-reasoned case.\nPerson B asks fewer questions, listens more, and makes the powerful person feel understood.\n\nSix months later, Person B has what they wanted. Person A is still waiting.\n\nWhat's the most accurate explanation?",
    question_type: "multiple_choice",
    options: [
      "Person B got lucky with timing",
      "The powerful person valued feeling heard more than being impressed",
      "Person A's case wasn't actually that strong",
      "Person B had a prior relationship that made the difference",
    ],
    correct_option: "The powerful person valued feeling heard more than being impressed",
    psychological_goal: "Influence through emotion and ego, not just logic.",
    measured_dimensions: ["influence_reading", "ego_awareness"],
    traits_to_track: ["logic_vs_relationship_leverage"],
  },
  {
    id: "Q2",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "Someone in your life — a friend, a collaborator, someone you respect — starts giving you more attention than usual. More check-ins, more compliments, more interest in what you're doing.\n\nNothing has been asked of you yet.\n\nWhat's your honest first read?",
    question_type: "multiple_choice",
    options: [
      "They're going through something and reaching out more",
      "Something is coming — people don't suddenly change behaviour for no reason",
      "The relationship has just naturally gotten closer",
      "I'd appreciate it and not read much into it",
    ],
    correct_option: "Something is coming — people don't suddenly change behaviour for no reason",
    psychological_goal: "Social pattern detection and behavioural shift tracking.",
    measured_dimensions: ["pattern_detection", "threat_calibration"],
    traits_to_track: ["behavioural_shift_read", "openness_vs_suspicion"],
  },
  {
    id: "Q3",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "A person publicly says they don't care about status or recognition — they just want to do good work.\n\nIn the same week, they post about an award they received, mention a well-known person they met, and correct someone who got their job title slightly wrong.\n\nWhat's the most useful read?",
    question_type: "multiple_choice",
    options: [
      "They genuinely don't care about status but share things they're proud of",
      "Their stated values and their actual behaviour are pointing in different directions",
      "There's nothing unusual here — most people do this",
      "Context matters too much to draw a conclusion",
    ],
    correct_option: "Their stated values and their actual behaviour are pointing in different directions",
    psychological_goal: "Behavioural evidence over stated self-concept.",
    measured_dimensions: ["hypocrisy_detection", "status_signals"],
    traits_to_track: ["stated_vs_actual", "status_awareness"],
  },
  {
    id: "Q4",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "Two people give you advice about a big decision.\n\nOne has done exactly what you're considering and succeeded. Their advice is confident and specific.\nThe other has never done it but asks questions that make you realise you haven't thought something through.\n\nWhose input actually moves the needle more?",
    question_type: "multiple_choice",
    options: [
      "The person who succeeded — they have proof",
      "The person asking questions — the gaps they exposed matter more than the confidence",
      "Both equally — you need experience and challenge",
      "Neither — ultimately you have to figure it out yourself",
    ],
    correct_option: "The person asking questions — the gaps they exposed matter more than the confidence",
    psychological_goal: "Authority vs insight. Confidence vs usefulness.",
    measured_dimensions: ["authority_weighting", "insight_receptivity"],
    traits_to_track: ["proof_vs_questions", "confidence_bias"],
  },
  {
    id: "Q5",
    section: "Reality Reading",
    category: "Reality Reading",
    question:
      "A group is deciding on a direction. The most vocal person in the room is pushing hard for one option.\n\nMost people are going along with it — not because they agree, but because it's easier than pushing back.\n\nYou think they're wrong.\n\nWhat's the thing that most determines whether you say something?",
    question_type: "multiple_choice",
    options: [
      "How confident I am that I'm actually right",
      "Whether speaking up will change the outcome or just create friction",
      "What it will cost me socially if I push back",
      "Whether anyone else in the room seems to feel the same way",
    ],
    psychological_goal: "What governs willingness to go against the group.",
    measured_dimensions: ["social_cost", "conviction", "group_dynamics"],
    traits_to_track: ["pushback_threshold", "friction_vs_outcome"],
  },
  {
    id: "Q6",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "You have two options.\n\nOption A: A path you're 80% sure about. Solid upside. Limited ceiling.\nOption B: A path you're 40% sure about. Most likely it doesn't work. But if it does, the outcome is 10x bigger.\n\nYou have to choose one. You can't gather more information first.",
    question_type: "multiple_choice",
    options: [
      "Option A — I'd rather move with confidence than gamble on 40%",
      "Option B — the ceiling matters more than the certainty",
      "I'd find a way to test Option B at small scale before committing",
      "I'd keep looking for a third option",
    ],
    psychological_goal: "Real risk tolerance under forced conditions.",
    measured_dimensions: ["risk_tolerance", "asymmetric_upside"],
    traits_to_track: ["certainty_vs_ceiling", "option_creativity"],
  },
  {
    id: "Q7",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "You're about to make a significant decision — something with real consequences either way.\n\nTwo people you both respect give you completely opposite advice. You've heard both out. Neither is obviously wrong.\n\nWhat actually happens?",
    question_type: "multiple_choice",
    options: [
      "I go with whoever I trust more as a person, regardless of their argument",
      "I go with whoever made the stronger case, even if I like the other person more",
      "I use the disagreement as a signal to dig deeper myself before deciding",
      "I find the conflict uncomfortable enough that I delay the decision",
    ],
    psychological_goal: "Authority under uncertainty. Self-trust vs borrowed judgment.",
    measured_dimensions: ["decision_authority", "conflict_response"],
    traits_to_track: ["trust_vs_argument", "decision_delay"],
  },
  {
    id: "Q8",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "You made a call. You committed publicly. Two weeks in, real evidence appears that it was the wrong move — not catastrophic, but clearly not working.\n\nWhat's the hardest part of what comes next?",
    question_type: "multiple_choice",
    options: [
      "Figuring out the right alternative — I don't like moving without a clear next step",
      "Telling the people who knew about my original decision",
      "Accepting that I moved too fast without enough information",
      "Letting go of the time and energy I already put in",
    ],
    psychological_goal: "Psychological cost of being wrong.",
    measured_dimensions: ["ego_cost", "sunk_cost", "reversal_friction"],
    traits_to_track: ["wrong_move_response", "public_commitment"],
  },
  {
    id: "Q9",
    section: "Decision Style",
    category: "Decision Style",
    question: "Two scenarios. Pick the one that would bother you more:",
    question_type: "multiple_choice",
    options: [
      "You made a bold move. It failed publicly. Everyone knows.",
      "You didn't make the move. Five years later, someone else did — and it worked.",
    ],
    psychological_goal: "Fear of failure vs fear of regret.",
    measured_dimensions: ["failure_aversion", "regret_aversion"],
    traits_to_track: ["public_failure", "missed_opportunity"],
  },
  {
    id: "Q10",
    section: "Decision Style",
    category: "Decision Style",
    question:
      "You're in a conversation with someone who clearly knows more than you about the topic being discussed.\n\nThey're not hostile — but they're direct, and they make a point that exposes a gap in your thinking.\n\nWhat's your honest internal reaction before you decide how to respond?",
    question_type: "multiple_choice",
    options: [
      "Curiosity — I want to understand what I was missing",
      "Defensiveness — my first instinct is to find the flaw in their point",
      "Recalibration — I quietly update my view and move on",
      "Discomfort — I don't mind being wrong but I don't love it happening in front of someone",
    ],
    psychological_goal: "Ego involvement in being right.",
    measured_dimensions: ["ego_threat", "intellectual_humility"],
    traits_to_track: ["defensive_reflex", "status_in_intellectual_context"],
  },
  {
    id: "Q11",
    section: "Execution",
    category: "Execution",
    question:
      "You're working on something that matters to you. Halfway through, you get a genuinely interesting opportunity to start something new — unrelated, but compelling.\n\nThe first thing isn't finished. The new thing won't wait long.\n\nWhat most honestly describes what happens?",
    question_type: "multiple_choice",
    options: [
      "I finish the first thing before touching the new one — that's just how I operate",
      "I find a way to move both forward at once, even if neither gets full attention",
      "I jump to the new one and tell myself I'll come back — and sometimes I do",
      "I feel the pull but stay on the first thing, frustrated the whole time",
    ],
    psychological_goal: "Completion drive vs novelty bias under temptation.",
    measured_dimensions: ["completion_drive", "novelty_bias"],
    traits_to_track: ["finish_vs_switch", "parallel_work"],
  },
  {
    id: "Q12",
    section: "Execution",
    category: "Execution",
    question:
      "You have a task you've been avoiding. It's not hard. It's just not interesting.\n\nIt's been sitting on your list for two weeks.\n\nWhat's actually keeping it there?",
    question_type: "multiple_choice",
    options: [
      "I keep prioritising things with more urgency",
      "I need the right conditions — energy, time, headspace — and they haven't lined up",
      "Starting it means confronting something I'd rather not deal with yet",
      "Honestly, I just keep forgetting it",
    ],
    psychological_goal: "Real reason behind avoidance.",
    measured_dimensions: ["avoidance_type", "emotional_avoidance"],
    traits_to_track: ["urgency_vs_interest", "confrontation_avoidance"],
  },
  {
    id: "Q13",
    section: "Execution",
    category: "Execution",
    question:
      "Two people are working toward the same goal.\n\nPerson A works in focused bursts — incredibly productive when motivated, inconsistent when not.\nPerson B works at a steady, moderate pace regardless of how they feel — never brilliant, never absent.\n\nA year later, Person B is further ahead.\n\nWhat's the most honest reaction?",
    question_type: "multiple_choice",
    options: [
      "That makes sense — consistency compounds",
      "That's frustrating — talent and intensity should count for more",
      "It depends on the goal — some things require bursts, not consistency",
      "I'd respect it but I know I operate more like Person A",
    ],
    psychological_goal: "Self-awareness about execution style.",
    measured_dimensions: ["consistency_vs_intensity", "self_placement"],
    traits_to_track: ["burst_operator", "consistency_respect"],
  },
  {
    id: "Q14",
    section: "Execution",
    category: "Execution",
    question:
      "You set yourself a deadline. Nobody else knows about it. It passes without you hitting it.\n\nWhat happens inside you?",
    question_type: "multiple_choice",
    options: [
      "Not much — internal deadlines aren't real pressure for me",
      "Mild frustration, then I reset and keep going",
      "Real friction — I take it seriously even if no one else knows",
      "It starts a spiral — one missed deadline makes the next one harder",
    ],
    psychological_goal: "Internal accountability without external enforcement.",
    measured_dimensions: ["self_imposed_pressure", "deadline_spiral"],
    traits_to_track: ["internal_deadlines", "accountability_structure"],
  },
  {
    id: "Q15",
    section: "Execution",
    category: "Execution",
    question:
      "You're given two projects.\n\nProject A: Clear brief, defined outcome, specific steps. You know exactly what done looks like.\nProject B: Vague goal, undefined path, you'll figure it out as you go.\n\nWhich one do you actually perform better on — not which do you prefer, but which produces better output from you?",
    question_type: "multiple_choice",
    options: [
      "Project A — I work best with structure and clear targets",
      "Project B — I find my own path and the ambiguity pushes me to think differently",
      "Depends on whether I care about the outcome",
      "Project A in the short term, Project B for anything that matters long-term",
    ],
    psychological_goal: "Actual performance conditions vs stated preference.",
    measured_dimensions: ["structure_dependency", "autonomous_drive"],
    traits_to_track: ["clarity_vs_ambiguity", "outcome_care"],
  },
  {
    id: "Q16",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question: "You have to give something up. Only one of these.",
    question_type: "multiple_choice",
    options: [
      "A significant amount of money you were counting on",
      "The ability to make your own decisions about how you spend your time",
      "The respect of people whose opinion matters to you",
      "A clear sense of what comes next",
    ],
    psychological_goal: "Primary loss aversion hierarchy.",
    measured_dimensions: ["loss_priority", "core_driver"],
    traits_to_track: ["money_vs_freedom", "status_vs_certainty"],
  },
  {
    id: "Q17",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question:
      "You did something genuinely difficult and it worked.\n\nTwo things happen afterward:\n\nVersion A: The people you most respect acknowledge it. No tangible reward — just recognition from the right people.\nVersion B: You make significant money from it. Nobody particularly notices or comments.\n\nWhich version feels more like success?",
    question_type: "multiple_choice",
    options: [
      "Version A — recognition from the right people means more to me than money",
      "Version B — the money is real, the recognition is just noise",
      "Neither feels complete without the other",
      "It depends on what I was trying to prove with it",
    ],
    psychological_goal: "Validation vs material reward as success signal.",
    measured_dimensions: ["recognition_drive", "material_drive"],
    traits_to_track: ["status_reward", "money_reward"],
  },
  {
    id: "Q18",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question:
      "You're offered two paths forward.\n\nPath A: High chance of a solid, respectable outcome. The kind of result most people in your position would be happy with.\nPath B: Low chance of an outcome that would genuinely change your life. Most likely you end up with nothing to show for it.\n\nWhat most honestly determines which one you choose?",
    question_type: "multiple_choice",
    options: [
      "How much I can afford to lose if Path B fails",
      "Whether I've already proven I can do the solid thing — I don't need to prove it again",
      "How much I'd regret not trying Path B if someone else took it and it worked",
      "Whether I actually believe in Path B or just find it exciting",
    ],
    psychological_goal: "Risk calculus under real stakes.",
    measured_dimensions: ["bold_vs_safe", "regret_logic"],
    traits_to_track: ["afford_to_lose", "prove_again", "excitement_vs_belief"],
  },
  {
    id: "Q19",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question:
      "Someone you know — same age, similar starting point — is now significantly further ahead than you.\n\nYou find out their success came from a combination of real skill and being in the right place at the right time.\n\nWhat's your honest internal reaction?",
    question_type: "multiple_choice",
    options: [
      "Respect — they made the most of their opportunity",
      "Motivation — it's proof the level I'm aiming for is reachable",
      "Friction — the luck element makes it harder to sit with",
      "Indifference — other people's timelines don't affect how I think about mine",
    ],
    psychological_goal: "Relationship with external comparison and luck.",
    measured_dimensions: ["peer_comparison", "status_sensitivity"],
    traits_to_track: ["comparison_response", "luck_friction"],
  },
  {
    id: "Q20",
    section: "Drivers & Pressure",
    category: "Drivers & Pressure",
    question:
      "Two versions of your next five years.\n\nVersion A: You make real progress — steady, meaningful, compounding. But almost nobody outside your close circle knows about it.\nVersion B: You become genuinely well-known in your space. Respected publicly. But the actual outcomes — money, freedom, impact — are more modest than Version A.\n\nWhich one do you actually want?",
    question_type: "multiple_choice",
    options: [
      "Version A — the outcomes are what matter, not who sees them",
      "Version B — being known and respected in my space is part of what I'm building toward",
      "I want both — I wouldn't accept either trade",
      "Depends on the space. Recognition means more in some fields than others.",
    ],
    psychological_goal: "Internal vs external orientation at deepest level.",
    measured_dimensions: ["private_vs_public_success", "recognition_orientation"],
    traits_to_track: ["outcome_vs_visibility", "status_building"],
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
