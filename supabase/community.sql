-- Community persistence upgrade for the existing MedVade project.
-- Keeps the legacy medweg_* table names and preserves existing rows.
-- Safe to run more than once. Apply through Supabase SQL Editor or Supabase CLI.

create table if not exists public.medweg_community_posts (
  id text primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default 'Community member',
  title text,
  body text not null,
  topic text not null,
  country_id text,
  post_type text not null default 'discussion',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);

create table if not exists public.medweg_community_comments (
  id text primary key,
  post_id text not null references public.medweg_community_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default 'Community member',
  parent_comment_id text references public.medweg_community_comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);

create table if not exists public.medweg_community_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.medweg_community_reports (
  id bigint generated always as identity primary key,
  post_id text not null references public.medweg_community_posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'community report',
  created_at timestamptz not null default now()
);

-- Additive upgrades for installations created from the older community.sql.
alter table public.medweg_community_posts
  add column if not exists author_name text not null default 'Community member',
  add column if not exists title text,
  add column if not exists post_type text not null default 'discussion',
  add column if not exists tags text[] not null default '{}';

alter table public.medweg_community_comments
  add column if not exists author_name text not null default 'Community member',
  add column if not exists parent_comment_id text;

alter table public.medweg_community_comments
  drop constraint if exists medweg_community_comments_parent_comment_id_fkey;
alter table public.medweg_community_comments
  add constraint medweg_community_comments_parent_comment_id_fkey
  foreign key (parent_comment_id) references public.medweg_community_comments(id) on delete cascade;

-- The legacy limits (600/300) did not match the current UI (1200/500).
-- Existing valid data remains untouched; limits are widened to match the app.
alter table public.medweg_community_posts
  drop constraint if exists medweg_community_posts_body_check;
alter table public.medweg_community_posts
  drop constraint if exists medweg_community_posts_body_length_check;
alter table public.medweg_community_posts
  add constraint medweg_community_posts_body_length_check
  check (char_length(body) between 1 and 1200);

alter table public.medweg_community_comments
  drop constraint if exists medweg_community_comments_body_check;
alter table public.medweg_community_comments
  drop constraint if exists medweg_community_comments_body_length_check;
alter table public.medweg_community_comments
  add constraint medweg_community_comments_body_length_check
  check (char_length(body) between 1 and 500);

alter table public.medweg_community_posts
  drop constraint if exists medweg_community_posts_title_length_check;
alter table public.medweg_community_posts
  add constraint medweg_community_posts_title_length_check
  check (title is null or char_length(title) <= 140);

alter table public.medweg_community_posts
  drop constraint if exists medweg_community_posts_post_type_check;
alter table public.medweg_community_posts
  add constraint medweg_community_posts_post_type_check
  check (post_type in ('discussion', 'question', 'case', 'resource', 'poll'));

alter table public.medweg_community_posts
  drop constraint if exists medweg_community_posts_tags_count_check;
alter table public.medweg_community_posts
  add constraint medweg_community_posts_tags_count_check
  check (cardinality(tags) <= 5);

create or replace function public.medweg_set_community_author()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required to publish community content' using errcode = '42501';
  end if;
  new.author_id := auth.uid();
  -- Derive a stable display label from the authenticated UUID rather than
  -- accepting a client-supplied name that could impersonate another member.
  new.author_name := 'Member ' || left(auth.uid()::text, 8);
  return new;
end;
$$;

revoke all on function public.medweg_set_community_author() from public, anon, authenticated;

drop trigger if exists medweg_set_community_post_author on public.medweg_community_posts;
create trigger medweg_set_community_post_author
before insert on public.medweg_community_posts
for each row execute function public.medweg_set_community_author();

drop trigger if exists medweg_set_community_comment_author on public.medweg_community_comments;
create trigger medweg_set_community_comment_author
before insert on public.medweg_community_comments
for each row execute function public.medweg_set_community_author();

create index if not exists medweg_community_posts_created_idx
  on public.medweg_community_posts(created_at desc);
create index if not exists medweg_community_posts_author_idx
  on public.medweg_community_posts(author_id, created_at desc);
create index if not exists medweg_community_comments_post_idx
  on public.medweg_community_comments(post_id, created_at);
create index if not exists medweg_community_comments_parent_idx
  on public.medweg_community_comments(parent_comment_id, created_at);
create index if not exists medweg_community_reports_post_idx
  on public.medweg_community_reports(post_id, created_at desc);

alter table public.medweg_community_posts enable row level security;
alter table public.medweg_community_comments enable row level security;
alter table public.medweg_community_follows enable row level security;
alter table public.medweg_community_reports enable row level security;

grant select on public.medweg_community_posts, public.medweg_community_comments to anon, authenticated;
grant insert on public.medweg_community_posts, public.medweg_community_comments to authenticated;
grant select, insert, delete on public.medweg_community_follows to authenticated;
grant insert on public.medweg_community_reports to authenticated;

drop policy if exists "published posts are readable" on public.medweg_community_posts;
create policy "published posts are readable"
  on public.medweg_community_posts for select to anon, authenticated
  using (hidden = false);

drop policy if exists "signed in users can create posts" on public.medweg_community_posts;
create policy "signed in users can create posts"
  on public.medweg_community_posts for insert to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "comments on visible posts are readable" on public.medweg_community_comments;
create policy "comments on visible posts are readable"
  on public.medweg_community_comments for select to anon, authenticated
  using (
    hidden = false
    and exists (
      select 1 from public.medweg_community_posts p
      where p.id = medweg_community_comments.post_id and p.hidden = false
    )
  );

drop policy if exists "signed in users can create comments" on public.medweg_community_comments;
create policy "signed in users can create comments"
  on public.medweg_community_comments for insert to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.medweg_community_posts p
      where p.id = medweg_community_comments.post_id and p.hidden = false
    )
    and (
      parent_comment_id is null
      or exists (
        select 1 from public.medweg_community_comments parent
        where parent.id = parent_comment_id
          and parent.post_id = medweg_community_comments.post_id
          and parent.hidden = false
      )
    )
  );

drop policy if exists "users can read their follows" on public.medweg_community_follows;
create policy "users can read their follows"
  on public.medweg_community_follows for select to authenticated
  using (auth.uid() = follower_id or auth.uid() = following_id);

drop policy if exists "users can follow" on public.medweg_community_follows;
create policy "users can follow"
  on public.medweg_community_follows for insert to authenticated
  with check (auth.uid() = follower_id);

drop policy if exists "users can unfollow" on public.medweg_community_follows;
create policy "users can unfollow"
  on public.medweg_community_follows for delete to authenticated
  using (auth.uid() = follower_id);

drop policy if exists "users can submit reports" on public.medweg_community_reports;
create policy "users can submit reports"
  on public.medweg_community_reports for insert to authenticated
  with check (auth.uid() = reporter_id);

-- Ensure PostgREST sees the newly-created relation and reply foreign key.
notify pgrst, 'reload schema';
