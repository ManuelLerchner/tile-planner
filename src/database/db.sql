create table projects (
    id uuid PRIMARY KEY not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    name text not null,
    description text not null,
    user_id uuid not null,
    initial_thumbnail text null,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

create table drawings (
    id uuid PRIMARY KEY,
    updated_at timestamp with time zone null default now(),
    tile_dims_x float not null default 25,
    tile_dims_y float not null default 25,
    tile_offset_x float not null default 0,
    tile_offset_y float not null default 0,
    tile_mode text not null default 'Interlaced 1',
    mesh jsonb not null default '{
        "vertices": [],
        "edges": []
    }',
    FOREIGN KEY (id) REFERENCES projects (id) ON DELETE CASCADE
);

-- create thumbnail bucket
insert into storage.buckets (id, name)
values
  ('thumbnails', 'thumbnails');

-- row level security
alter table projects enable row level security;

create policy "projects can only be accessed by their owner"
  on projects
  using (auth.uid() = user_id);

alter table drawings enable row level security;

create policy "drawings can only be accessed by their owner"
  on drawings
  using (
    auth.uid() = (select user_id from projects where id = drawings.id)
  );

-- bucket
alter table storage.buckets enable row level security;

create policy "thumbnails can only be accessed by their owner"
  on storage.objects
  using (
    (bucket_id = 'thumbnails'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
  );