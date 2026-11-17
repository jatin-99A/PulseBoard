export interface PollOption {
  id?: string;
  optionText: string;
  optionOrder: number;
  votes?: number;
  percentage?: number;
}

export interface PollQuestion {
  id?: string;
  questionText: string;
  isMandatory: boolean;
  questionOrder: number;
  options: PollOption[];
  totalVotes?: number;
}

export interface Poll {
  id: string;
  creatorId?: string;
  title: string;
  description?: string | null;
  publicLink: string;
  expiryDays: number;
  expiresAt: string;
  isActive: boolean;
  isAnonymousAllowed: boolean;
  createdAt: string;
  updatedAt?: string;
  questions?: PollQuestion[];
  totalVotes?: number;
}

export interface CreatePollInput {
  title: string;
  description?: string;
  expiryDays: number;
  isAnonymousAllowed: boolean;
  questions: {
    questionText: string;
    isMandatory: boolean;
    questionOrder: number;
    options: {
      optionText: string;
      optionOrder: number;
    }[];
  }[];
}

export interface PollAnalysisOption {
  id: string;
  optionText: string;
  optionOrder: number;
  votes: number;
  percentage: number;
}

export interface PollAnalysisQuestion {
  id: string;
  questionText: string;
  questionOrder: number;
  totalVotes: number;
  options: PollAnalysisOption[];
}

export interface PollAnalysis {
  pollId: string;
  title: string;
  description?: string | null;
  publicLink: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  totalResponses: number;
  questions: PollAnalysisQuestion[];
}

