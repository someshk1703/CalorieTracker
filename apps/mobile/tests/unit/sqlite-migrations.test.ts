import { migrations } from "../../src/data/migrations";

describe("sqlite migrations", () => {
  it("creates all local-first feature tables", () => {
    const sql = migrations.map((migration) => migration.sql).join("\n");

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS user_profiles");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS meal_entries");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS daily_summaries");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS streak_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS progress_points");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS community_posts");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS transformation_pairs");
  });

  it("keeps meal image storage local-first", () => {
    const mealMigration = migrations.find((migration) => migration.name === "create_meal_entries");

    expect(mealMigration?.sql).toContain("local_image_uri");
    expect(mealMigration?.sql).toContain("cloud_media_id");
  });
});