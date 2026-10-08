(function () {
    const url = window.SUPABASE_URL || "";
    const key = window.SUPABASE_ANON_KEY || "";

    window.supabaseClient = null;

    if (window.supabase && url && key) {
        const isPlaceholder =
            url.includes("TU_PROYECTO") ||
            key.includes("TU_") ||
            key.includes("TU_CLAVE");

        if (!isPlaceholder) {
            window.supabaseClient = window.supabase.createClient(url, key);
        }
    }

    if (!window.supabaseClient) {
        console.warn("Supabase no está configurado. La app usará localStorage como respaldo.");
    }
})();
