import AsyncStorage from '@react-native-async-storage/async-storage';
import { Climb } from '@/types/climb';

const CLIMBS_KEY = '@boulder_notebook:climbs';

export async function getAllClimbs(): Promise<Climb[]> {
  const raw = await AsyncStorage.getItem(CLIMBS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Climb[];
}

export async function saveClimb(climb: Climb): Promise<void> {
  const climbs = await getAllClimbs();
  climbs.unshift(climb);
  await AsyncStorage.setItem(CLIMBS_KEY, JSON.stringify(climbs));
}

export async function deleteClimb(id: string): Promise<void> {
  const climbs = await getAllClimbs();
  const updated = climbs.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CLIMBS_KEY, JSON.stringify(updated));
}
