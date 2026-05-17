import { configureStore } from '@reduxjs/toolkit';
import profilesReducer from './slices/profilesSlice';
import pointsReducer from './slices/pointsSlice';
import walletReducer from './slices/walletSlice';
import { persistMiddleware } from './persist';

export const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    points: pointsReducer,
    wallet: walletReducer,
  },
  middleware: (getDefault) => getDefault().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
