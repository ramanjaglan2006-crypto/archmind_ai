-- DANGER: This will delete existing patterns to reset dimensions.
-- Run this if you are seeing "expected 768 dimensions, not 3072" errors.

-- 1. Drop the matching function
drop function if exists match_architecture_patterns(vector(768), float, int);
drop function if exists match_architecture_patterns(vector(3072), float, int);

-- 2. Drop the table (this deletes existing patterns)
drop table if exists architecture_patterns;

-- 3. Re-create the table with 3072 dimensions
create table architecture_patterns (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  embedding vector(3072),
  created_at timestamptz default now()
);

-- 4. Skip index (HNSW/IVFFlat have a 2000-dim limit on some Supabase versions).
-- With 9 rows, a sequential scan is extremely fast.
-- create index on architecture_patterns using hnsw (embedding vector_cosine_ops);

-- 5. Create the matching function
create or replace function match_architecture_patterns(
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  description text,
  similarity float
)
language sql stable
as $$
  select
    architecture_patterns.id,
    architecture_patterns.title,
    architecture_patterns.description,
    1 - (architecture_patterns.embedding <=> query_embedding) as similarity
  from architecture_patterns
  where 1 - (architecture_patterns.embedding <=> query_embedding) > match_threshold
  order by (architecture_patterns.embedding <=> query_embedding) asc
  limit match_count;
$$;
