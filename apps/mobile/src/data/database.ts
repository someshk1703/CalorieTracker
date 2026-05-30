import * as SQLite from "expo-sqlite";
import { migrations } from "./migrations";

export type CalorieTrackerDatabase = SQLite.SQLiteDatabase;

export async function openCalorieTrackerDatabase(): Promise<CalorieTrackerDatabase> {
  const database = await SQLite.openDatabaseAsync("calorie-tracker.db");
  await runMigrations(database);
  return database;
}

export async function runMigrations(database: CalorieTrackerDatabase): Promise<void> {
  await database.execAsync(
    "CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);"
  );

  for (const migration of migrations) {
    const existing = await database.getFirstAsync<{ id: number }>(
      "SELECT id FROM schema_migrations WHERE id = ?",
      migration.id
    );

    if (!existing) {
      await database.execAsync(migration.sql);
      await database.runAsync(
        "INSERT INTO schema_migrations (id, name) VALUES (?, ?)",
        migration.id,
        migration.name
      );
    }
  }
}