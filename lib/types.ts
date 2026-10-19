export type ReadingBlock = {
  type:
    | 'paragraph'
    | 'heading'
    | 'quote'
    | 'source'
    | 'score'
    | 'utilization'
    | 'spotlight'
    | 'transition'
    | 'artwork'
    | 'cards'
    | 'filecards'
    | 'glasspanel'
    | 'myths'
    | 'ordered'
    | 'chips'
    | 'accordions'
    | 'carousel'
    | 'ledger'
    | 'conversion'
    | 'paydays'
    | 'loancost'
    | 'interestscan'
    | 'payoff'
    | 'waterfall'
    | 'lists'
    | 'split'
    | 'story'
    | 'takeaway'
    | 'glossary'
    | 'checkin';
  text?: string;
  detail?: string;
  extra?: string;
  url?: string;
  /** story: optional background photo (site-relative, under /images). */
  image?: string;
  /** story: index of the paragraph after which the items timeline is inserted. */
  at?: number;
  paragraphs?: string[];
  /** image: optional site-relative photo under /images, used by artwork slides. */
  /** carousel: icon is one of calendar, bank, files, book, search. lists: icon is check or alert; list holds the bullets. */
  items?: {
    title: string;
    text: string;
    detail?: string;
    image?: string;
    icon?: string;
    /** ledger: the row's dollar figure, e.g. "$2,250". */
    amount?: string;
    list?: string[];
  }[];
};
export type Tier = 0 | 1 | 2 | 3 | 4 | 5;
export type Section = {
  id: string;
  title: string;
  paragraphs: string[];
  blocks?: ReadingBlock[];
  kind?: 'spotlight' | 'myth' | 'action';
};
export type LessonContent = {
  title: string;
  summary: string;
  subtitle?: string;
  checkIn?: {
    questions: string[];
    /** Optional example answer per question, shown as the answer field's placeholder. */
    samples?: string[];
    rewardLabel: string;
    acknowledgment: string;
  };
  minutes: number;
  published: boolean;
  sections: Section[];
  quiz: { question: string; choices: string[]; answer: number };
  sources: { label: string; url: string }[];
};
export type Lesson = { id: string; number: number; title: string; tier: Tier };
export type Course = {
  id: string;
  title: string;
  short: string;
  description: string;
  category: string;
  total: number;
  ready: boolean;
  lessons: Lesson[];
  outcomes: string[];
  segmentNames: string[];
  segmentDescriptions: string[];
};
export type Enrollment = {
  courseId: string;
  tier: Tier;
  completed: string[];
  reflections: Record<string, string>;
  startedAt: string;
  deadline: string | null;
  segmentResults?: Record<string, { completedAt: string; deadline: string | null }>;
  saved: string[];
  checkIns?: Record<string, { answers: string[]; submittedAt: string }>;
};
export type Offer = {
  id: string;
  courseId: string;
  segment: Tier;
  status: 'pending' | 'approved' | 'not-yet' | 'declined';
  createdAt: string;
  approvalReference?: string;
  reviewedAt?: string;
  reviewer?: string;
  note?: string;
};
export type MemberState = {
  activeCourse: string | null;
  approvedTier: Tier;
  enrollments: Record<string, Enrollment>;
  offers: Offer[];
  onboardingComplete: boolean;
};
export type Account = {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  passwordHash: string;
  state: MemberState;
  createdAt: string;
};
export type Settings = {
  segmentDays: number | null;
  bonusCopy: string;
  savingsCopy: string;
  helpEmail: string;
};
export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  date: string;
};
