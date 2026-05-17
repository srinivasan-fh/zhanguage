import { useProfileStore } from './profileStore';
import { useProgressStore } from './progressStore';
import { useWalletStore } from './walletStore';

export async function hydrateStores(): Promise<void> {
  await Promise.all([
    useProfileStore.getState().hydrate(),
    useProgressStore.getState().hydrate(),
    useWalletStore.getState().hydrate(),
  ]);
}
