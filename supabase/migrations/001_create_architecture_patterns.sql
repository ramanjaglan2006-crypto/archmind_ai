-- Enable pgvector extension (run this in Supabase SQL Editor)
create extension if not exists vector;

-- Create architecture_patterns table
create table if not exists architecture_patterns (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  embedding vector(3072),
  created_at timestamptz default now()
);

-- Create index for fast similarity search (Optional - disabled for 3072-dim compatibility on older PG versions)
-- create index if not exists architecture_patterns_embedding_idx
--   on architecture_patterns
--   using hnsw (embedding vector_cosine_ops);

-- Create the matching function for vector search
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

-- Create prompts table (if not already created)
create table if not exists prompts (
  id uuid default gen_random_uuid() primary key,
  prompt text not null,
  result jsonb not null,
  created_at timestamptz default now()
);
