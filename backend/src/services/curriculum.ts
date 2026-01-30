export interface Concept {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  gradeLevel: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  concepts: Concept[];
}

// K-12 Math Curriculum
const mathConcepts: Concept[] = [
  // Kindergarten - Grade 2
  { id: 'math-counting', name: 'Counting Numbers', description: 'Learn to count from 1 to 100', prerequisites: [], gradeLevel: 0 },
  { id: 'math-addition-basic', name: 'Basic Addition', description: 'Adding single-digit numbers', prerequisites: ['math-counting'], gradeLevel: 1 },
  { id: 'math-subtraction-basic', name: 'Basic Subtraction', description: 'Subtracting single-digit numbers', prerequisites: ['math-counting'], gradeLevel: 1 },
  { id: 'math-place-value', name: 'Place Value', description: 'Understanding ones, tens, and hundreds', prerequisites: ['math-counting'], gradeLevel: 2 },

  // Grades 3-5
  { id: 'math-multiplication', name: 'Multiplication', description: 'Multiplying numbers and times tables', prerequisites: ['math-addition-basic'], gradeLevel: 3 },
  { id: 'math-division', name: 'Division', description: 'Dividing numbers and understanding remainders', prerequisites: ['math-multiplication'], gradeLevel: 3 },
  { id: 'math-fractions-intro', name: 'Introduction to Fractions', description: 'Understanding parts of a whole', prerequisites: ['math-division'], gradeLevel: 4 },
  { id: 'math-decimals', name: 'Decimals', description: 'Understanding decimal numbers and place value', prerequisites: ['math-fractions-intro'], gradeLevel: 5 },

  // Grades 6-8
  { id: 'math-ratios', name: 'Ratios and Proportions', description: 'Understanding relationships between numbers', prerequisites: ['math-fractions-intro'], gradeLevel: 6 },
  { id: 'math-integers', name: 'Integers and Operations', description: 'Working with positive and negative numbers', prerequisites: ['math-decimals'], gradeLevel: 6 },
  { id: 'math-expressions', name: 'Algebraic Expressions', description: 'Using variables and simplifying expressions', prerequisites: ['math-integers'], gradeLevel: 7 },
  { id: 'math-equations', name: 'Solving Equations', description: 'Finding unknown values in equations', prerequisites: ['math-expressions'], gradeLevel: 7 },
  { id: 'math-linear-functions', name: 'Linear Functions', description: 'Understanding and graphing linear relationships', prerequisites: ['math-equations'], gradeLevel: 8 },

  // Grades 9-12
  { id: 'math-quadratics', name: 'Quadratic Equations', description: 'Solving and graphing quadratic functions', prerequisites: ['math-linear-functions'], gradeLevel: 9 },
  { id: 'math-geometry', name: 'Geometry Fundamentals', description: 'Shapes, angles, and proofs', prerequisites: ['math-equations'], gradeLevel: 10 },
  { id: 'math-trigonometry', name: 'Trigonometry', description: 'Sine, cosine, tangent and their applications', prerequisites: ['math-geometry'], gradeLevel: 11 },
  { id: 'math-precalculus', name: 'Pre-Calculus', description: 'Functions, limits, and preparation for calculus', prerequisites: ['math-trigonometry', 'math-quadratics'], gradeLevel: 12 },
];

// K-12 Reading Curriculum
const readingConcepts: Concept[] = [
  // Kindergarten - Grade 2
  { id: 'read-alphabet', name: 'Alphabet Recognition', description: 'Learning letters and their sounds', prerequisites: [], gradeLevel: 0 },
  { id: 'read-phonics', name: 'Basic Phonics', description: 'Sounding out simple words', prerequisites: ['read-alphabet'], gradeLevel: 1 },
  { id: 'read-sight-words', name: 'Sight Words', description: 'Recognizing common words by sight', prerequisites: ['read-alphabet'], gradeLevel: 1 },
  { id: 'read-simple-sentences', name: 'Reading Simple Sentences', description: 'Understanding basic sentence structure', prerequisites: ['read-phonics', 'read-sight-words'], gradeLevel: 2 },

  // Grades 3-5
  { id: 'read-fluency', name: 'Reading Fluency', description: 'Reading smoothly and with expression', prerequisites: ['read-simple-sentences'], gradeLevel: 3 },
  { id: 'read-comprehension-basic', name: 'Basic Comprehension', description: 'Understanding what you read', prerequisites: ['read-fluency'], gradeLevel: 3 },
  { id: 'read-vocabulary', name: 'Vocabulary Building', description: 'Learning new words and their meanings', prerequisites: ['read-comprehension-basic'], gradeLevel: 4 },
  { id: 'read-main-idea', name: 'Finding Main Ideas', description: 'Identifying the central message of a text', prerequisites: ['read-comprehension-basic'], gradeLevel: 5 },

  // Grades 6-8
  { id: 'read-inference', name: 'Making Inferences', description: 'Reading between the lines', prerequisites: ['read-main-idea'], gradeLevel: 6 },
  { id: 'read-text-structure', name: 'Text Structure', description: 'Understanding how texts are organized', prerequisites: ['read-main-idea'], gradeLevel: 6 },
  { id: 'read-literary-elements', name: 'Literary Elements', description: 'Plot, character, setting, and theme', prerequisites: ['read-inference'], gradeLevel: 7 },
  { id: 'read-analysis', name: 'Text Analysis', description: 'Analyzing author\'s purpose and techniques', prerequisites: ['read-literary-elements'], gradeLevel: 8 },

  // Grades 9-12
  { id: 'read-rhetoric', name: 'Rhetorical Analysis', description: 'Understanding persuasion techniques', prerequisites: ['read-analysis'], gradeLevel: 9 },
  { id: 'read-critical-reading', name: 'Critical Reading', description: 'Evaluating arguments and sources', prerequisites: ['read-rhetoric'], gradeLevel: 10 },
  { id: 'read-literary-criticism', name: 'Literary Criticism', description: 'Different approaches to interpreting literature', prerequisites: ['read-critical-reading'], gradeLevel: 11 },
  { id: 'read-synthesis', name: 'Synthesis and Research', description: 'Combining multiple sources to form conclusions', prerequisites: ['read-literary-criticism'], gradeLevel: 12 },
];

// K-12 Science Curriculum
const scienceConcepts: Concept[] = [
  // Kindergarten - Grade 2
  { id: 'sci-senses', name: 'Five Senses', description: 'Exploring the world through our senses', prerequisites: [], gradeLevel: 0 },
  { id: 'sci-living-nonliving', name: 'Living vs Non-Living', description: 'What makes something alive?', prerequisites: [], gradeLevel: 1 },
  { id: 'sci-weather', name: 'Weather Basics', description: 'Understanding rain, sun, wind, and seasons', prerequisites: [], gradeLevel: 1 },
  { id: 'sci-habitats', name: 'Animal Habitats', description: 'Where animals live and why', prerequisites: ['sci-living-nonliving'], gradeLevel: 2 },

  // Grades 3-5
  { id: 'sci-life-cycles', name: 'Life Cycles', description: 'How living things grow and change', prerequisites: ['sci-habitats'], gradeLevel: 3 },
  { id: 'sci-ecosystems', name: 'Ecosystems', description: 'How living things interact with their environment', prerequisites: ['sci-life-cycles'], gradeLevel: 4 },
  { id: 'sci-matter', name: 'States of Matter', description: 'Solids, liquids, and gases', prerequisites: [], gradeLevel: 4 },
  { id: 'sci-energy', name: 'Forms of Energy', description: 'Light, heat, sound, and electricity', prerequisites: ['sci-matter'], gradeLevel: 5 },

  // Grades 6-8
  { id: 'sci-cells', name: 'Cell Biology', description: 'The building blocks of life', prerequisites: ['sci-life-cycles'], gradeLevel: 6 },
  { id: 'sci-atoms', name: 'Atoms and Molecules', description: 'The building blocks of matter', prerequisites: ['sci-matter'], gradeLevel: 6 },
  { id: 'sci-forces', name: 'Forces and Motion', description: 'How things move and why', prerequisites: ['sci-energy'], gradeLevel: 7 },
  { id: 'sci-genetics', name: 'Basic Genetics', description: 'How traits are inherited', prerequisites: ['sci-cells'], gradeLevel: 8 },
  { id: 'sci-chemical-reactions', name: 'Chemical Reactions', description: 'How substances change and interact', prerequisites: ['sci-atoms'], gradeLevel: 8 },

  // Grades 9-12
  { id: 'sci-biology', name: 'Biology Foundations', description: 'Comprehensive study of living systems', prerequisites: ['sci-genetics', 'sci-cells'], gradeLevel: 9 },
  { id: 'sci-chemistry', name: 'Chemistry Foundations', description: 'Comprehensive study of matter and reactions', prerequisites: ['sci-chemical-reactions'], gradeLevel: 10 },
  { id: 'sci-physics', name: 'Physics Foundations', description: 'Comprehensive study of energy and forces', prerequisites: ['sci-forces'], gradeLevel: 11 },
  { id: 'sci-earth-science', name: 'Earth and Space Science', description: 'Geology, astronomy, and environmental science', prerequisites: ['sci-chemistry', 'sci-physics'], gradeLevel: 12 },
];

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Build strong mathematical foundations from counting to calculus',
    concepts: mathConcepts,
  },
  {
    id: 'reading',
    name: 'Reading & Language Arts',
    description: 'Develop reading comprehension and analytical skills',
    concepts: readingConcepts,
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Explore the natural world through scientific inquiry',
    concepts: scienceConcepts,
  },
];

export function getSubject(subjectId: string): Subject | undefined {
  return subjects.find(s => s.id === subjectId);
}

export function getConcept(subjectId: string, conceptId: string): Concept | undefined {
  const subject = getSubject(subjectId);
  return subject?.concepts.find(c => c.id === conceptId);
}

export function getConceptsForGrade(subjectId: string, gradeLevel: number): Concept[] {
  const subject = getSubject(subjectId);
  if (!subject) return [];

  // Return concepts at or below the student's grade level
  return subject.concepts.filter(c => c.gradeLevel <= gradeLevel);
}

export function getNextConcept(
  subjectId: string,
  completedConceptIds: string[],
  gradeLevel: number
): Concept | undefined {
  const availableConcepts = getConceptsForGrade(subjectId, gradeLevel);

  // Find concepts where all prerequisites are completed
  return availableConcepts.find(concept => {
    if (completedConceptIds.includes(concept.id)) return false;
    return concept.prerequisites.every(prereq => completedConceptIds.includes(prereq));
  });
}

export default {
  subjects,
  getSubject,
  getConcept,
  getConceptsForGrade,
  getNextConcept,
};
