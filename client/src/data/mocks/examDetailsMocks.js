// Real exam data for various exams
export const exams = {
  upsc: {
    id: 'upsc',
    name: 'UPSC Civil Services Examination',
    description: 'The Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the Union Public Service Commission for recruitment to various Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Foreign Service (IFS), and Indian Police Service (IPS).',
    pattern: {
      stages: [
        { name: 'Preliminary Examination', description: 'Objective Type (MCQ)' },
        { name: 'Main Examination', description: 'Descriptive Type' },
        { name: 'Interview/Personality Test', description: 'Personality Assessment' },
      ],
      prelims: {
        subjects: [
          { name: 'General Studies Paper I', questions: 100, marks: 200, time: 120 },
          { name: 'General Studies Paper II (CSAT)', questions: 80, marks: 200, time: 120 },
        ],
        markingScheme: {
          correct: 2,
          incorrect: -0.66,
          unattempted: 0,
        },
      },
      mains: {
        subjects: [
          { name: 'Essay', marks: 250 },
          { name: 'General Studies I', marks: 250 },
          { name: 'General Studies II', marks: 250 },
          { name: 'General Studies III', marks: 250 },
          { name: 'General Studies IV', marks: 250 },
          { name: 'Optional Subject Paper I', marks: 250 },
          { name: 'Optional Subject Paper II', marks: 250 },
        ],
        totalMarks: 1750,
      },
      interview: {
        marks: 275,
        totalMarks: 2025,
      },
    },
    syllabus: [
      'Current events of national and international importance',
      'History of India and Indian National Movement',
      'Indian and World Geography',
      'Indian Polity and Governance',
      'Economic and Social Development',
      'General issues on Environmental Ecology, Bio-diversity and Climate Change',
      'General Science',
    ],
    mockTests: 20,
    difficultyLevel: 'Advanced',
  },
  cuet: {
    id: 'cuet',
    name: 'CUET (Common University Entrance Test)',
    description: 'CUET is a national-level entrance examination conducted by NTA for admission to UG and PG courses in Central Universities and other participating institutions.',
    pattern: {
      sections: [
        { name: 'Section IA', description: 'Language Test', questions: 50, marks: 50, time: 45 },
        { name: 'Section IB', description: 'Language Test', questions: 50, marks: 50, time: 45 },
        { name: 'Section II', description: 'Domain Specific Test', questions: 100, marks: 100, time: 45 },
        { name: 'Section III', description: 'General Test', questions: 60, marks: 60, time: 45 },
      ],
      markingScheme: {
        correct: 1,
        incorrect: -0.25,
        unattempted: 0,
      },
    },
    syllabus: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biology',
      'Commerce',
      'Computer Science',
      'Economics',
      'English',
    ],
    mockTests: 15,
    difficultyLevel: 'Moderate',
  },
  jee: {
    id: 'jee',
    name: 'JEE (Joint Entrance Examination)',
    description: 'JEE is an all India common engineering entrance examination conducted for admission to various engineering colleges and institutes in India.',
    pattern: {
      papers: [
        { name: 'Paper 1 (B.E./B.Tech.)', description: 'Objective Type (MCQ)', questions: 90, marks: 300, time: 180 },
        { name: 'Paper 2 (B.Arch.)', description: 'Mathematics + Aptitude + Drawing', questions: 82, marks: 400, time: 180 },
      ],
      markingScheme: {
        correct: 4,
        incorrect: -1,
        unattempted: 0,
      },
    },
    syllabus: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Drawing (for B.Arch.)',
    ],
    mockTests: 25,
    difficultyLevel: 'Advanced',
  },
};
