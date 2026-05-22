import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types/profile';
import { uuid } from '@/utils/id';

export const MAX_PROFILES = 3;

interface ProfilesState {
  byId: Record<string, Profile>;
  ids: string[];
  activeId: string | null;
}

const initialState: ProfilesState = {
  byId: {},
  ids: [],
  activeId: null,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    hydrate(_state, action: PayloadAction<ProfilesState>) {
      return action.payload;
    },
    addProfile: {
      reducer(state, action: PayloadAction<Profile>) {
        if (state.ids.length >= MAX_PROFILES) return;
        const p = action.payload;
        state.byId[p.id] = p;
        state.ids.push(p.id);
        state.activeId = p.id;
      },
      prepare(input: { name: string; age?: number; avatar: string }) {
        // RFC 4122 v4 UUID. Used as the immutable tracking key across the
        // points, lessons, lettersSeen, streak, and wallet slices.
        return {
          payload: {
            id: uuid(),
            createdAt: Date.now(),
            ...input,
          } as Profile,
        };
      },
    },
    selectProfile(state, action: PayloadAction<string>) {
      if (state.byId[action.payload]) state.activeId = action.payload;
    },
    removeProfile(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.byId[id];
      state.ids = state.ids.filter((x) => x !== id);
      if (state.activeId === id) state.activeId = null;
    },
  },
});

export const { hydrate: hydrateProfiles, addProfile, selectProfile, removeProfile } =
  profilesSlice.actions;
export default profilesSlice.reducer;
