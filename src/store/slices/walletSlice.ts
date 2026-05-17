import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { LedgerEntry, Wallet } from '@/types/profile';

const DEFAULT_RATE_CENTS_PER_POINT = 10;

interface WalletState {
  byStudent: Record<string, Wallet>;
}

const initialState: WalletState = {
  byStudent: {},
};

function emptyWallet(): Wallet {
  return {
    balanceCents: 0,
    rateCentsPerPoint: DEFAULT_RATE_CENTS_PER_POINT,
    ledger: [],
  };
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    hydrate(_state, action: PayloadAction<WalletState>) {
      return action.payload;
    },
    deposit: {
      reducer(
        state,
        action: PayloadAction<{ studentId: string; entry: LedgerEntry }>,
      ) {
        const { studentId, entry } = action.payload;
        const w = state.byStudent[studentId] ?? emptyWallet();
        w.balanceCents += entry.amountCents;
        w.ledger.push(entry);
        state.byStudent[studentId] = w;
      },
      prepare(input: { studentId: string; amountCents: number; note?: string }) {
        return {
          payload: {
            studentId: input.studentId,
            entry: {
              id: nanoid(),
              at: Date.now(),
              kind: 'deposit' as const,
              amountCents: input.amountCents,
              note: input.note ?? 'Parent top-up',
            },
          },
        };
      },
    },
    earnFromPoints: {
      reducer(
        state,
        action: PayloadAction<{ studentId: string; points: number; entry: LedgerEntry }>,
      ) {
        const { studentId, entry } = action.payload;
        const w = state.byStudent[studentId] ?? emptyWallet();
        const rate = w.rateCentsPerPoint > 0 ? w.rateCentsPerPoint : DEFAULT_RATE_CENTS_PER_POINT;
        const max = action.payload.points * rate;
        const actual = Math.min(max, w.balanceCents);
        w.balanceCents -= actual;
        w.ledger.push({ ...entry, amountCents: actual });
        state.byStudent[studentId] = w;
      },
      prepare(input: { studentId: string; points: number }) {
        return {
          payload: {
            studentId: input.studentId,
            points: input.points,
            entry: {
              id: nanoid(),
              at: Date.now(),
              kind: 'earn' as const,
              amountCents: 0,
              note: `Earned ${input.points} pts`,
            } as LedgerEntry,
          },
        };
      },
    },
    setRate(
      state,
      action: PayloadAction<{ studentId: string; rateCentsPerPoint: number }>,
    ) {
      const { studentId, rateCentsPerPoint } = action.payload;
      const w = state.byStudent[studentId] ?? emptyWallet();
      w.rateCentsPerPoint = Math.max(1, Math.floor(rateCentsPerPoint));
      state.byStudent[studentId] = w;
    },
    clearStudentWallet(state, action: PayloadAction<string>) {
      delete state.byStudent[action.payload];
    },
  },
});

export const {
  hydrate: hydrateWallet,
  deposit,
  earnFromPoints,
  setRate,
  clearStudentWallet,
} = walletSlice.actions;
export default walletSlice.reducer;
