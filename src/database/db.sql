create table projects (
    id uuid PRIMARY KEY not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    name text not null,
    description text not null,
    user_id uuid not null,
    image text null,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

create table drawings (
    id uuid PRIMARY KEY,
    updated_at timestamp with time zone null default now(),
    tile_dims_x float not null default 25,
    tile_dims_y float not null default 25,
    tile_offset_x float not null default 0,
    tile_offset_y float not null default 0,
    tile_mode text not null default 'Interlaced',
    mesh jsonb not null default '{
        "vertices": [],
        "edges": []
    }',
    FOREIGN KEY (id) REFERENCES projects (id) ON DELETE CASCADE
);

create table demos (
    id uuid PRIMARY KEY,
    updated_at timestamp with time zone null default now(),
    tile_dims_x float not null default 25,
    tile_dims_y float not null default 25,
    tile_offset_x float not null default 0,
    tile_offset_y float not null default 0,
    tile_mode text not null default 'Interlaced',
    mesh jsonb not null default '{
        "vertices": [],
        "edges": []
    }',
    image text not null
);

-- insert demo projects when a user is added
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    demoId uuid := gen_random_uuid();
begin
    insert into projects (id, name, description, user_id)
        values (demoId, 'Demo Project', 'This is a demo project to show the capabilities of the application. Feel free to delete or modify it.', new.id);
    insert into drawings (id, tile_dims_x, tile_dims_y, tile_offset_x, tile_offset_y, tile_mode, mesh)
        select demoId, tile_dims_x, tile_dims_y, tile_offset_x, tile_offset_y, tile_mode, mesh from demos where id = 'fbbb2b3f-3f96-4e80-a24e-0eb3cfde8e06';
    update projects set image = (select image from demos where id = 'fbbb2b3f-3f96-4e80-a24e-0eb3cfde8e06') where id = demoId;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

alter table demos enable row level security;