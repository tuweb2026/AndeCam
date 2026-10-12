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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos',
  'product-photos',
  true,
  10485760,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

create policy "product_photos_read_public"
on storage.objects
for select
to public
using (bucket_id = 'product-photos');

create policy "product_photos_upload_public"
on storage.objects
for insert
to anon
with check (bucket_id = 'product-photos');
```

3. En index.html cambia estos valores:

```html
window.SUPABASE_URL = "https://TU_PROYECTO.supabase.co";
window.SUPABASE_ANON_KEY = "TU_CLAVE_ANON_SUPABASE";
```

4. Guarda y publica el sitio.

Las fotografías se comprimen a un máximo de 1600 px y se guardan en el bucket `product-photos`; el catálogo conserva solo sus URL. El límite de selección no se restringe a 50 imágenes. Si ya tenías fotografías guardadas como Base64, se migrarán automáticamente a Storage la próxima vez que guardes un cambio. Ejecuta el SQL actualizado en un proyecto existente para habilitar la carga.

> Este ejemplo usa la clave anónima para que todos los usuarios puedan leer el catálogo público. Para producción puedes protegerlo con autenticación y reglas de RLS más estrictas.
