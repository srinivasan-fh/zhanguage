import { create } from 'zustand';
import { storage } from '@/storage/asyncStorage';
import { LedgerEntry, Wallet } from '@/types/profile';

const KEY = 'wallet:v1';
const DEFAULT_RATE_CENTS_PER_POINT = 10;

type WalletMap = { [profileId: string]: Wallet };

interface WalletState {
  byProfile: WalletMap;
  hydrate: () => Promise<void>;
  ensureWallet: (profileId: string) => Wallet;
  deposit: (profileId: string, amountCents: number, note?: string) => Promise<void>;
  earnFromPoints: (profileId: string, points: number) => Promise<number>;
  setRate: (profileId: string, rateCentsPerPoint: number) => Promise<void>;
}

function emptyWallet(): Wallet {
  return {
    balanceCents: 0,
    rateCentsPerPoint: DEFAULT_RATE_CENTS_PER_POINT,
    ledger: [],
  };
}

function mkEntry(kind: LedgerEntry['kind'], amountCents: number, note?: string): LedgerEntry {
  return {
    id: `l_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    at: Date.now(),
    kind,
    amountCents,
    note,
  };
}

export const useWalletStore = create<WalletState>((set, get) => ({
  byProfile: {},

  hydrate: async () => {
    const data = (await storage.get<WalletMap>(KEY)) ?? {};
    set({ byProfile: data });
  },

  ensureWallet: (profileId) => get().byProfile[profileId] ?? emptyWallet(),

  deposit: async (profileId, amountCents, note) => {
    const byProfile = { ...get().byProfile };
    const wallet = { ...(byProfile[profileId] ?? emptyWallet()) };
    wallet.balanceCents += amountCents;
    wallet.ledger = [...wallet.ledger, mkEntry('deposit', amountCents, note ?? 'Parent top-up')];
    byProfile[profileId] = wallet;
    await storage.set(KEY, byProfile);
    set({ byProfile });
  },

  earnFromPoints: async (profileId, points) => {
    const byProfile = { ...get().byProfile };
    const wallet = { ...(byProfile[profileId] ?? emptyWallet()) };
    const rate = wallet.rateCentsPerPoint > 0 ? wallet.rateCentsPerPoint : DEFAULT_RATE_CENTS_PER_POINT;
    const earned = Math.min(points * rate, wallet.balanceCents);
    wallet.balanceCents -= earned;
    wallet.ledger = [...wallet.ledger, mkEntry('earn', earned, `Earned ${points} pts`)];
    byProfile[profileId] = wallet;
    await storage.set(KEY, byProfile);
    set({ byProfile });
    return earned;
  },

  setRate: async (profileId, rateCentsPerPoint) => {
    const byProfile = { ...get().byProfile };
    const wallet = { ...(byProfile[profileId] ?? emptyWallet()) };
    wallet.rateCentsPerPoint = Math.max(1, Math.floor(rateCentsPerPoint));
    byProfile[profileId] = wallet;
    await storage.set(KEY, byProfile);
    set({ byProfile });
  },
}));
