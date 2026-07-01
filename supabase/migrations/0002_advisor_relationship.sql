-- Advisor relationship memory: evolving user model + cross-session summaries

create table if not exists public.advisor_evolution (
  user_id uuid primary key references auth.users(id) on delete cascade,
  evolving_summary text not null default '',
  shift_notes text not null default '',
  progress_notes text not null default '',
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_summaries (
  conversation_id uuid primary key references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text not null default '',
  open_threads text[] not null default '{}',
  message_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists conversation_summaries_user_idx
  on public.conversation_summaries(user_id, updated_at desc);

alter table public.cognitive_memory
  drop constraint if exists cognitive_memory_memory_type_check;

alter table public.cognitive_memory
  add constraint cognitive_memory_memory_type_check check (
    memory_type in (
      'theme', 'fear', 'goal', 'contradiction', 'behavioral_pattern',
      'emotional_state', 'recurring_phrase', 'motivation', 'identity', 'trigger',
      'commitment', 'decision', 'outcome', 'progress', 'shift'
    )
  );

alter table public.advisor_evolution enable row level security;
alter table public.conversation_summaries enable row level security;

drop policy if exists "advisor_evolution_owner_all" on public.advisor_evolution;
create policy "advisor_evolution_owner_all" on public.advisor_evolution
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "conversation_summaries_owner_all" on public.conversation_summaries;
create policy "conversation_summaries_owner_all" on public.conversation_summaries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
