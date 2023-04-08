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