import type { MealEntry } from "@calorie-tracker/shared";

export interface MealStoreSaveResult {
  syncState: "synced" | "local_only";
}

export interface MealStore {
  saveMeal(meal: MealEntry): Promise<MealStoreSaveResult>;
}

export class NoopMealStore implements MealStore {
  async saveMeal(): Promise<MealStoreSaveResult> {
    return { syncState: "local_only" };
  }
}

export class SupabaseMealStore implements MealStore {
  constructor(
    private readonly supabaseUrl: string,
    private readonly serviceRoleKey: string
  ) {}

  async saveMeal(meal: MealEntry): Promise<MealStoreSaveResult> {
    await this.insert("profiles", {
      id: meal.userId,
      display_name: "Demo User",
      calorie_target: 2500,
      macro_targets_json: { proteinGrams: 150, carbGrams: 275, fatGrams: 70 },
      privacy_preferences_json: { photoBackupEnabled: false, communitySharingDefault: "private", hideWeightByDefault: true },
      created_at: meal.createdAt,
      updated_at: meal.updatedAt
    });

    await this.insert("meal_entries", {
      id: meal.id,
      user_id: meal.userId,
      logged_at: meal.loggedAt,
      diary_date: meal.diaryDate,
      meal_name: meal.mealName,
      source_method: meal.sourceMethod,
      local_image_uri: meal.localImageUri ?? null,
      cloud_media_id: meal.cloudMediaId ?? null,
      servings: meal.servings,
      calories: meal.calories,
      protein_grams: meal.proteinGrams,
      carb_grams: meal.carbGrams,
      fat_grams: meal.fatGrams,
      analysis_result_id: meal.analysisResultId ?? null,
      confirmation_state: meal.confirmationState,
      sync_state: "synced",
      created_at: meal.createdAt,
      updated_at: meal.updatedAt
    });

    if (meal.ingredients.length > 0) {
      await this.insert(
        "meal_ingredients",
        meal.ingredients.map((ingredient, index) => ({
          id: `${meal.id}_ingredient_${index}`,
          meal_entry_id: meal.id,
          label: ingredient.label,
          calories: ingredient.calories,
          protein_grams: ingredient.proteinGrams,
          carb_grams: ingredient.carbGrams,
          fat_grams: ingredient.fatGrams,
          source: ingredient.source,
          database_provider_id: ingredient.databaseProviderId ?? null
        }))
      );
    }

    return { syncState: "synced" };
  }

  private async insert(table: string, body: unknown): Promise<void> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed for ${table}: ${response.status}`);
    }
  }
}

export function createMealStore(): MealStore {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return supabaseUrl && serviceRoleKey ? new SupabaseMealStore(supabaseUrl, serviceRoleKey) : new NoopMealStore();
}