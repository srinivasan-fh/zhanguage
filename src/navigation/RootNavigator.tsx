import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
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
import { AlphabetScreen } from '@/screens/AlphabetScreen';
import { LetterScreen } from '@/screens/LetterScreen';
import { QuizScreen } from '@/screens/QuizScreen';
import { TraceScreen } from '@/screens/TraceScreen';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const activeProfileId = useAppSelector(selectActiveProfileId);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '800', letterSpacing: 0.3 },
        contentStyle: { backgroundColor: colors.bg },
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
      <Stack.Screen name="Alphabet" component={AlphabetScreen} options={{ title: 'Alphabet' }} />
      <Stack.Screen name="Letter" component={LetterScreen} options={{ title: 'Letter', headerTransparent: true }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
      <Stack.Screen name="Trace" component={TraceScreen} options={{ title: 'Trace', headerTransparent: true }} />
    </Stack.Navigator>
  );
}
