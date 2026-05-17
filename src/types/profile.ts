export interface Profile {
  id: string;
  name: string;
  age?: number;
  avatar: string;
  createdAt: number;
}

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'emerald';

export interface LessonResult {
  lessonId: string;
  scorePct: number;
  medal: MedalTier;
  points: number;
  attempts: number;
  lastAt: number;
}

export interface LedgerEntry {
  id: string;
  at: number;
  kind: 'deposit' | 'earn';
  amountCents: number;
  note?: string;
}

export interface Wallet {
  balanceCents: number;
  rateCentsPerPoint: number;
  ledger: LedgerEntry[];
}

export interface Streak {
  count: number;
  lastDayISO: string | null;
}
