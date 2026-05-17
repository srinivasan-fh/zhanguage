import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useProfileStore } from '@/store/profileStore';
import { ProfileSelectScreen } from '@/screens/ProfileSelectScreen';
import { CreateProfileScreen } from '@/screens/CreateProfileScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { PhaseListScreen } from '@/screens/PhaseListScreen';
import { LessonListScreen } from '@/screens/LessonListScreen';
import { LessonScreen } from '@/screens/LessonScreen';
import { LessonCompleteScreen } from '@/screens/LessonCompleteScreen';
import { RewardsScreen } from '@/screens/RewardsScreen';
import { ParentGateScreen } from '@/screens/ParentGateScreen';
import { ParentDashboardScreen } from '@/screens/ParentDashboardScreen';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.cream },
      }}
      initialRouteName={activeProfileId ? 'Home' : 'ProfileSelect'}
    >
      <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} options={{ title: 'New Player' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pick a Language' }} />
      <Stack.Screen name="PhaseList" component={PhaseListScreen} options={{ title: 'Phases' }} />
      <Stack.Screen name="LessonList" component={LessonListScreen} options={{ title: 'Lessons' }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
      <Stack.Screen
        name="LessonComplete"
        component={LessonCompleteScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'My Rewards' }} />
      <Stack.Screen name="ParentGate" component={ParentGateScreen} options={{ title: 'Parents Only' }} />
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: 'Parent Dashboard' }} />
    </Stack.Navigator>
  );
}
