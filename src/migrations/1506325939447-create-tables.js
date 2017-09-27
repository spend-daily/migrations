export function up(knex) {
  return knex.raw(`
    create extension if not exists "uuid-ossp";
    create extension if not exists "postgis";
    create table transactions (
      id uuid default uuid_generate_v4(),
      user_id uuid not null,
      memo text,
      time timestamp with time zone,
      location geography(point, 4326),
      primary key ("id")
    );
  `)
}

export function down() {
  return Promise.resolve()
}
