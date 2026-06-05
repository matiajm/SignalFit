export type MealItem = {
  id: string;
  description: string;
  quantity?: string | null;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type Meal = {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  items: MealItem[];
};

export type WorkoutSet = {
  id: string;
  setNumber: number;
  reps: number;
  weightLb: number;
  rpe?: number | null;
  isWarmup: boolean;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  sets: WorkoutSet[];
};

export type NutritionSnapshot = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  mealsCount: number;
  ateEnoughForGoal?: string | null;
  vitaminDIu: number;
  ironMg: number;
  magnesiumMg: number;
  calciumMg: number;
  vitaminB12Mcg: number;
  vitaminCMg: number;
  potassiumMg: number;
  zincMg: number;
};

export type TrainingSession = {
  trained: boolean;
  type?: string | null;
  durationMin: number;
  muscleGroups: string[];
  intensity?: string | null;
  rpe?: number | null;
  performanceVsUsual?: string | null;
  volumeFeel?: string | null;
  soreness?: number | null;
  sorenessAreas: string[];
  totalSets: number;
  totalReps: number;
  totalVolumeLb: number;
  exercisesSummary?: string | null;
};

export type RecentDay = {
  label: string;
  sleepHours: number;
  calories: number;
  trained: boolean;
  energy?: string;
  stress?: string;
  recoveryScore: number;
};

export type SignalFitData = {
  source: "supabase" | "demo";
  profileName: string;
  goal: string;
  weightLb: number;
  checkinDate: string;
  sleepHours: number;
  sleepQuality?: string | null;
  energy?: string | null;
  mood?: string | null;
  stress?: string | null;
  motivation?: string | null;
  notes?: string | null;
  nutrition: NutritionSnapshot;
  meals: Meal[];
  training: TrainingSession;
  exercises: WorkoutExercise[];
  recentDays: RecentDay[];
  insight: {
    summary: string;
    wins: string[];
    next: string[];
  };
};

export type SignalFitDataState = {
  data: SignalFitData;
  loading: boolean;
  error: string | null;
};
