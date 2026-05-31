create table if not exists public.profiles (
  id text primary key,
  display_name text not null,
  email text,
  calorie_target integer not null,
  macro_targets_json jsonb not null default '{}'::jsonb,
  privacy_preferences_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meal_entries (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  logged_at timestamptz not null,
  diary_date date not null,
  meal_name text not null,
  source_method text not null check (source_method in ('camera', 'photo_import', 'manual_correction')),
  local_image_uri text,
  cloud_media_id text,
  servings numeric not null default 1,
  calories numeric not null default 0,
  protein_grams numeric not null default 0,
  carb_grams numeric not null default 0,
  fat_grams numeric not null default 0,
  analysis_result_id text,
  confirmation_state text not null check (confirmation_state in ('pending_review', 'confirmed', 'corrected')),
  sync_state text not null check (sync_state in ('local_only', 'pending_sync', 'synced', 'share_pending', 'shared', 'failed')),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.meal_ingredients (
  id text primary key,
  meal_entry_id text not null references public.meal_entries(id) on delete cascade,
  label text not null,
  calories numeric not null default 0,
  protein_grams numeric not null default 0,
  carb_grams numeric not null default 0,
  fat_grams numeric not null default 0,
  source text not null check (source in ('database', 'ai_fallback', 'user_corrected')),
  database_provider_id text
);

create table if not exists public.daily_summaries (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  diary_date date not null,
  calories_consumed numeric not null default 0,
  protein_consumed_grams numeric not null default 0,
  carb_consumed_grams numeric not null default 0,
  fat_consumed_grams numeric not null default 0,
  calorie_target integer not null,
  macro_targets_snapshot_json jsonb not null default '{}'::jsonb,
  meal_count integer not null default 0,
  goal_status text not null,
  updated_at timestamptz not null,
  unique (user_id, diary_date)
);

create table if not exists public.progress_points (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  recorded_at timestamptz not null,
  type text not null,
  weight_value numeric,
  calorie_average numeric,
  macro_averages_json jsonb,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id text not null references public.groups(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  streak_count integer not null default 0,
  primary key (group_id, user_id)
);

create table if not exists public.community_posts (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  group_id text not null references public.groups(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  caption text,
  nutrition_summary_json jsonb,
  media_id text,
  visibility_state text not null,
  reaction_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.media_objects (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  content_type text not null,
  backup_consent boolean not null default false,
  share_consent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.meal_entries enable row level security;
alter table public.meal_ingredients enable row level security;
alter table public.daily_summaries enable row level security;
alter table public.progress_points enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.community_posts enable row level security;
alter table public.media_objects enable row level security;