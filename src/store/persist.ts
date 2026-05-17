import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState } from './index';
import { hydrateProfiles } from './slices/profilesSlice';
import { hydratePoints } from './slices/pointsSlice';
import { hydrateWallet } from './slices/walletSlice';

const KEY_PROFILES = 'redux:profiles:v1';
const KEY_POINTS   = 'redux:points:v1';
const KEY_WALLET   = 'redux:wallet:v1';

export const persistMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    AsyncStorage.multiSet([
      [KEY_PROFILES, JSON.stringify(state.profiles)],
      [KEY_POINTS,   JSON.stringify(state.points)],
      [KEY_WALLET,   JSON.stringify(state.wallet)],
    ]).catch(() => {});
    return result;
  };

export async function loadPersisted(dispatch: (a: any) => void): Promise<void> {
  const [pPair, ptPair, wPair] = await AsyncStorage.multiGet([
    KEY_PROFILES,
    KEY_POINTS,
    KEY_WALLET,
  ]);
  if (pPair[1])  dispatch(hydrateProfiles(JSON.parse(pPair[1])));
  if (ptPair[1]) dispatch(hydratePoints(JSON.parse(ptPair[1])));
  if (wPair[1])  dispatch(hydrateWallet(JSON.parse(wPair[1])));
}
