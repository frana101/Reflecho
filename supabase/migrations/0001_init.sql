-- Brain Mirror: Cognitive Reconstruction System
-- Schema covers profiles, onboarding responses, cognitive dossier, chat, memory.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles: 1:1 with auth.users
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  age_range text,
  occupation text,
  subscription_tier text not null default 'surface' check (subscription_tier in ('surface', 'mirror')),
  onboarding_status text not null default 'not_started' check (
    onboarding_status in ('not_started', 'in_progress', 'analyzing', 'complete')
  ),
  reconstruction_complete_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Auto-create profile row on user sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- reconstruction_responses: answers to the 40+ onboarding questions
-- ------------------------------------------------------------
create table if not exists public.reconstruction_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  category text not null,
  question_text text not null,
  question_type text not null,
  answer_text text,
  answer_choices text[],
  psychological_goal text,
  traits_to_track text[],
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create index if not exists reconstruction_responses_user_idx
  on public.reconstruction_responses(user_id);

-- ------------------------------------------------------------
-- cognitive_dossiers: the AI-generated 8-layer psychological dossier
-- ------------------------------------------------------------
create table if not exists public.cognitive_dossiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 1,
  summary text,
  cognitive_profile jsonb,
  motivational_engine jsonb,
  identity_structure jsonb,
  emotional_architecture jsonb,
  execution_architecture jsonb,
  social_dynamics jsonb,
  blind_spots jsonb,
  trajectory_analysis jsonb,
  radar_scores jsonb,
  raw_model_output text,
  created_at timestamptz not null default now()
);

create index if not exists cognitive_dossiers_user_idx
  on public.cognitive_dossiers(user_id, created_at desc);

-- ------------------------------------------------------------
-- conversations + messages: the evolving mirror chat
-- ------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute procedure public.set_updated_at();

create index if not exists conversations_user_idx
  on public.conversations(user_id, updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages(conversation_id, created_at);

-- ------------------------------------------------------------
-- cognitive_memory: evolving long-term memory of recurring patterns
-- ------------------------------------------------------------
create table if not exists public.cognitive_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null check (
    memory_type in (
      'theme', 'fear', 'goal', 'contradiction', 'behavioral_pattern',
      'emotional_state', 'recurring_phrase', 'motivation', 'identity', 'trigger'
    )
  ),
  content text not null,
  evidence text,
  weight numeric not null default 1.0,
  first_observed_at timestamptz not null default now(),
  last_observed_at timestamptz not null default now(),
  observation_count integer not null default 1,
  archived boolean not null default false
);

create index if not exists cognitive_memory_user_type_idx
  on public.cognitive_memory(user_id, memory_type);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.reconstruction_responses enable row level security;
alter table public.cognitive_dossiers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.cognitive_memory enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);

-- generic per-user RLS for owned rows
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'reconstruction_responses',
      'cognitive_dossiers',
      'conversations',
      'messages',
      'cognitive_memory'
    ])
  loop
    execute format('drop policy if exists "%I_owner_all" on public.%I', t, t);
    execute format(
      'create policy "%I_owner_all" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t, t
    );
  end loop;
end $$;
