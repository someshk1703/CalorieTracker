export interface Migration {
  id: number;
  name: string;
  sql: string;
}

export const migrations: Migration[] = [
  {
    id: 1,
    name: "create_user_profiles",
    sql: `CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY NOT NULL,
      display_name TEXT NOT NULL,
      email TEXT,
      profile_inputs_json TEXT NOT NULL,
      calorie_target REAL NOT NULL,
      macro_targets_json TEXT NOT NULL,
      streak_settings_json TEXT NOT NULL,
      privacy_preferences_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  },
  {
    id: 2,
    name: "create_meal_entries",
    sql: `CREATE TABLE IF NOT EXISTS meal_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      logged_at TEXT NOT NULL,
      diary_date TEXT NOT NULL,
      meal_name TEXT NOT NULL,
      source_method TEXT NOT NULL,
      local_image_uri TEXT,
      cloud_media_id TEXT,
      servings REAL NOT NULL,
      calories REAL NOT NULL,
      protein_grams REAL NOT NULL,
      carb_grams REAL NOT NULL,
      fat_grams REAL NOT NULL,
      ingredients_json TEXT NOT NULL,
      analysis_result_id TEXT,
      confirmation_state TEXT NOT NULL,
      sync_state TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  },
  {
    id: 3,
    name: "create_daily_summaries",
    sql: `CREATE TABLE IF NOT EXISTS daily_summaries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      diary_date TEXT NOT NULL,
      calories_consumed REAL NOT NULL,
      protein_consumed_grams REAL NOT NULL,
      carb_consumed_grams REAL NOT NULL,
      fat_consumed_grams REAL NOT NULL,
      calorie_target REAL NOT NULL,
      macro_targets_snapshot_json TEXT NOT NULL,
      meal_count INTEGER NOT NULL,
      goal_status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  },
  {
    id: 4,
    name: "create_streak_records",
    sql: `CREATE TABLE IF NOT EXISTS streak_records (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      current_streak_days INTEGER NOT NULL,
      longest_streak_days INTEGER NOT NULL,
      last_qualified_date TEXT,
      qualification_rule TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  },
  {
    id: 5,
    name: "create_progress_points",
    sql: `CREATE TABLE IF NOT EXISTS progress_points (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      recorded_at TEXT NOT NULL,
      type TEXT NOT NULL,
      weight_value REAL,
      calorie_average REAL,
      macro_averages_json TEXT,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`
  },
  {
    id: 6,
    name: "create_community_posts",
    sql: `CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_id TEXT NOT NULL,
      caption TEXT,
      nutrition_summary_json TEXT,
      media_id TEXT,
      visibility_state TEXT NOT NULL,
      reaction_count INTEGER NOT NULL,
      comment_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  },
  {
    id: 7,
    name: "create_transformation_pairs",
    sql: `CREATE TABLE IF NOT EXISTS transformation_pairs (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      before_image_uri TEXT NOT NULL,
      after_image_uri TEXT NOT NULL,
      before_date TEXT NOT NULL,
      after_date TEXT NOT NULL,
      before_weight REAL,
      after_weight REAL,
      hide_weight INTEGER NOT NULL,
      share_state TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`
  }
];