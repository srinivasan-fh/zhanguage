import { create } from 'zustand';
import { storage } from '@/storage/asyncStorage';
import { Profile } from '@/types/profile';

const KEY = 'profiles:v1';
const ACTIVE_KEY = 'profiles:active';
const MAX_PROFILES = 3;

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
  hydrate: () => Promise<void>;
  createProfile: (input: Omit<Profile, 'id' | 'createdAt'>) => Promise<Profile>;
  switchProfile: (id: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  canAddProfile: () => boolean;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  activeProfileId: null,

  hydrate: async () => {
    const profiles = (await storage.get<Profile[]>(KEY)) ?? [];
    const active = await storage.get<string>(ACTIVE_KEY);
    set({ profiles, activeProfileId: active });
  },

  createProfile: async (input) => {
    if (get().profiles.length >= MAX_PROFILES) {
      throw new Error('Profile limit reached');
    }
    const profile: Profile = {
      ...input,
      id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };
    const profiles = [...get().profiles, profile];
    await storage.set(KEY, profiles);
    await storage.set(ACTIVE_KEY, profile.id);
    set({ profiles, activeProfileId: profile.id });
    return profile;
  },

  switchProfile: async (id) => {
    await storage.set(ACTIVE_KEY, id);
    set({ activeProfileId: id });
  },

  deleteProfile: async (id) => {
    const profiles = get().profiles.filter((p) => p.id !== id);
    await storage.set(KEY, profiles);
    const active = get().activeProfileId === id ? null : get().activeProfileId;
    if (active === null) await storage.remove(ACTIVE_KEY);
    set({ profiles, activeProfileId: active });
  },

  canAddProfile: () => get().profiles.length < MAX_PROFILES,
}));

export const MAX_PROFILE_COUNT = MAX_PROFILES;
