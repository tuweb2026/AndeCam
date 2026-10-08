# Configuración de Supabase para ANDECAM

1. Crea un proyecto en https://supabase.com
2. Abre SQL Editor y ejecuta:

```sql
create table if not exists public.catalog (
  id text primary key,
  data jsonb not null default '[]'::jsonb
);

alter table public.catalog enable row level security;

create policy "catalog_read_public"
on public.catalog
for select
using (true);

create policy "catalog_write_public"
on public.catalog
for insert
with check (true);

create policy "catalog_update_public"
on public.catalog
for update
using (true)
with check (true);
```

3. En index.html cambia estos valores:

```html
window.SUPABASE_URL = "https://TU_PROYECTO.supabase.co";
window.SUPABASE_ANON_KEY = "TU_CLAVE_ANON_SUPABASE";
```

4. Guarda y publica el sitio.

> Este ejemplo usa la clave anónima para que todos los usuarios puedan leer el catálogo público. Para producción puedes protegerlo con autenticación y reglas de RLS más estrictas.
