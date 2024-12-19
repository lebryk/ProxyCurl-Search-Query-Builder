import { SurveyQuestion } from "@/components/features/survey/SurveyQuestionCard";

interface GeneratorInput {
  companyValues: string;
  jobRole: string;
}

// Cultural dimensions based on established frameworks
const culturalDimensions = [
  "Power Distance",
  "Individualism vs. Collectivism",
  "Uncertainty Avoidance",
  "Long-term vs. Short-term Orientation",
  "Work-Life Balance",
  "Communication Style",
  "Decision Making",
  "Innovation and Risk-taking"
];

// Sample questions for each question type
const questionTemplates = {
  likert: [
    "I prefer working in a structured environment with clear hierarchies.",
    "I enjoy taking initiative without waiting for explicit directions.",
    "I am comfortable with ambiguity and uncertain situations.",
    "I value maintaining work-life boundaries.",
  ],
  multiple_choice: [
    {
      question: "When faced with a challenge, I typically:",
      options: [
        "Seek consensus from the team",
        "Take immediate action independently",
        "Analyze all possible outcomes before deciding",
        "Look for innovative, unconventional solutions"
      ]
    }
  ],
  scenario: [
    "Describe how you would handle a situation where your team's consensus conflicts with your personal judgment.",
    "How would you approach a project that requires significant changes to established processes?",
  ],
  open_ended: [
    "What aspects of company culture matter most to you?",
    "How do you prefer to receive feedback on your work?",
  ]
};

// Mock AI generation - In production, this would integrate with an AI service
export async function generateSurveyQuestions({ companyValues, jobRole }: GeneratorInput): Promise<SurveyQuestion[]> {
  // This is a placeholder implementation
  // In production, we would send the input to an AI service to generate contextually relevant questions
  
  const questions: SurveyQuestion[] = [];
  let id = 1;

  // Generate one question of each type for demonstration
  questions.push({
    id: `q${id++}`,
    type: 'likert',
    question: questionTemplates.likert[Math.floor(Math.random() * questionTemplates.likert.length)],
    category: culturalDimensions[Math.floor(Math.random() * culturalDimensions.length)],
  });

  const multiChoice = questionTemplates.multiple_choice[0];
  questions.push({
    id: `q${id++}`,
    type: 'multiple_choice',
    question: multiChoice.question,
    options: multiChoice.options,
    category: culturalDimensions[Math.floor(Math.random() * culturalDimensions.length)],
  });

  questions.push({
    id: `q${id++}`,
    type: 'scenario',
    question: questionTemplates.scenario[Math.floor(Math.random() * questionTemplates.scenario.length)],
    category: culturalDimensions[Math.floor(Math.random() * culturalDimensions.length)],
  });

  questions.push({
    id: `q${id++}`,
    type: 'open_ended',
    question: questionTemplates.open_ended[Math.floor(Math.random() * questionTemplates.open_ended.length)],
    category: culturalDimensions[Math.floor(Math.random() * culturalDimensions.length)],
  });

  return questions;
}

export function analyzeSurveyCompleteness(questions: SurveyQuestion[]): {
  coveredDimensions: string[];
  missingDimensions: string[];
  questionTypeDistribution: Record<string, number>;
} {
  const coveredDimensions = new Set(questions.map(q => q.category));
  const missingDimensions = culturalDimensions.filter(d => !coveredDimensions.has(d));
  
  const questionTypeDistribution = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    coveredDimensions: Array.from(coveredDimensions),
    missingDimensions,
    questionTypeDistribution,
  };
}
