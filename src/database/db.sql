create table projects (
    id uuid PRIMARY KEY not null default uuid_generate_v4 (),
    created_at timestamp with time zone null default now(),
    name text not null,
    description text not null,
    user_id uuid FOREIGN KEY REFERENCES auth.users (id) ON DELETE SET NULL,
    image text null,
)

create table drawings (
    id uuid PRIMARY KEY,
    updated_at timestamp with time zone null default now(),
    tile_dims_x float not null,
    tile_dims_y float not null,
    tile_offset_x float not null,
    tile_offset_y float not null,
    tile_mode text not null,
    mesh jsonb not null,
    FOREIGN KEY (id) REFERENCES projects (id) ON DELETE CASCADE
)