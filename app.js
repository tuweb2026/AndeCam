// ==========================================
// ANDECAM — App Logic
// Gestión de productores y productos
// 100% funcional con localStorage
// ==========================================

// ==========================================
// STATE
// ==========================================

let productores = [];

try {
    const datosGuardados =
        localStorage.getItem("productoresBolivia");

    if (datosGuardados) {
        productores = JSON.parse(datosGuardados);

        if (!Array.isArray(productores)) {
            productores = [];
        }
    }
} catch (error) {
    productores = [];
}

let areaActual = "artesanias";
let productorEditando = null;
let productoEditando = null;
let indiceProductoEditando = null;
let productorNuevoProducto = null;


// ==========================================
// DOM REFERENCES
// ==========================================

const admin =
    document.getElementById("ventanaAdmin");

const catalogo =
    document.getElementById("catalogo");

const formularioProductos =
    document.getElementById("productosFormulario");


// ==========================================
// TOAST NOTIFICATIONS (replaces alert)
// ==========================================

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconClass = "fas fa-check-circle";
    let iconColor = "#22c55e";

    if (type === "error") {
        iconClass = "fas fa-exclamation-circle";
        iconColor = "#ef4444";
    } else if (type === "warning") {
        iconClass = "fas fa-exclamation-triangle";
        iconColor = "#f59e0b";
    }

    toast.innerHTML = `
        <span class="toast-icon" style="color: ${iconColor}">
            <i class="${iconClass}"></i>
        </span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3200);
}


// ==========================================
// HEADER SCROLL EFFECT
// ==========================================

(function () {
    const header = document.getElementById("mainHeader");
    if (!header) return;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
})();


// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });

            // Close mobile nav if open
            const nav = document.getElementById("mainNav");
            const toggle = document.getElementById("menuToggle");
            if (nav) nav.classList.remove("open");
            if (toggle) toggle.classList.remove("open");
        }
    });
});


// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================

(function () {
    const sections = document.querySelectorAll("section[id], main[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveLink() {
        let current = "";
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
})();


// ==========================================
// MOBILE MENU TOGGLE
// ==========================================

(function () {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            toggle.classList.toggle("open");
            nav.classList.toggle("open");
        });
    }
})();


// ==========================================
// HERO STATS COUNTER ANIMATION
// ==========================================

function updateHeroStats() {
    const statProductores = document.getElementById("statProductores");
    const statProductos = document.getElementById("statProductos");

    if (!statProductores || !statProductos) return;

    const totalProductores = productores.length;
    let totalProductos = 0;

    productores.forEach(function (p) {
        if (Array.isArray(p.productos)) {
            totalProductos += p.productos.length;
        }
    });

    animateCounter(statProductores, totalProductores);
    animateCounter(statProductos, totalProductos);
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 800;
    const start = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}


// ==========================================
// HERO PARTICLE EFFECT (subtle)
// ==========================================

(function () {
    const container = document.getElementById("heroParticles");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 10 + 10;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05});
            border-radius: 50%;
            left: ${x}%;
            bottom: -10px;
            animation: particleFloat ${duration}s linear ${delay}s infinite;
            pointer-events: none;
        `;

        container.appendChild(particle);
    }

    // Add keyframes
    const style = document.createElement("style");
    style.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 40 - 20}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();


// ==========================================
// BOTÓN ADMINISTRAR
// ==========================================

document.getElementById("btnAdministrar").onclick =
    function () {
        productorEditando = null;
        productoEditando = null;
        indiceProductoEditando = null;
        productorNuevoProducto = null;

        limpiarFormulario();
        habilitarCamposProductor();

        cambiarTituloFormulario(
            '<i class="fas fa-user-plus"></i> Registrar productor'
        );

        cambiarTextoGuardar(
            '<i class="fas fa-save"></i> Guardar productor'
        );

        mostrarBotonAgregarProducto(true);

        admin.classList.remove("oculto");
    };


// ==========================================
// CERRAR VENTANA
// ==========================================

document.getElementById("btnCerrarAdmin").onclick =
    function () {
        productorEditando = null;
        productoEditando = null;
        indiceProductoEditando = null;
        productorNuevoProducto = null;

        limpiarFormulario();
        habilitarCamposProductor();

        cambiarTituloFormulario(
            '<i class="fas fa-user-plus"></i> Registrar productor'
        );

        cambiarTextoGuardar(
            '<i class="fas fa-save"></i> Guardar productor'
        );

        mostrarBotonAgregarProducto(true);

        admin.classList.add("oculto");
    };

// Close modal on backdrop click
admin.addEventListener("click", function (e) {
    if (e.target === admin) {
        admin.classList.add("oculto");
    }
});

// Close modal on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !admin.classList.contains("oculto")) {
        admin.classList.add("oculto");
    }
});


// ==========================================
// BOTÓN AGREGAR PRODUCTO
// ==========================================

document.getElementById("btnAgregarProducto").onclick =
    function () {
        agregarProducto();
    };


// ==========================================
// BOTÓN GUARDAR
// ==========================================

document.getElementById("btnGuardarProductor").onclick =
    function () {
        guardarProductor();
    };


// ==========================================
// BOTÓN ARTESANÍAS
// ==========================================

document.getElementById("btnArtesanias").onclick =
    function () {
        areaActual = "artesanias";

        document
            .getElementById("btnArtesanias")
            .classList.add("activo");

        document
            .getElementById("btnTransformacion")
            .classList.remove("activo");

        mostrarCatalogo();
    };


// ==========================================
// BOTÓN TRANSFORMACIÓN
// ==========================================

document.getElementById("btnTransformacion").onclick =
    function () {
        areaActual = "transformacion";

        document
            .getElementById("btnTransformacion")
            .classList.add("activo");

        document
            .getElementById("btnArtesanias")
            .classList.remove("activo");

        mostrarCatalogo();
    };


// ==========================================
// CAMBIAR TÍTULO DEL FORMULARIO
// ==========================================

function cambiarTituloFormulario(texto) {
    const titulo =
        document.querySelector(
            "#ventanaAdmin h2"
        );

    if (titulo) {
        titulo.innerHTML = texto;
    }
}


// ==========================================
// CAMBIAR TEXTO DEL BOTÓN GUARDAR
// ==========================================

function cambiarTextoGuardar(texto) {
    const boton =
        document.getElementById(
            "btnGuardarProductor"
        );

    if (boton) {
        boton.innerHTML = texto;
    }
}


// ==========================================
// MOSTRAR U OCULTAR BOTÓN
// "AGREGAR PRODUCTO"
// ==========================================

function mostrarBotonAgregarProducto(mostrar) {
    const boton =
        document.getElementById(
            "btnAgregarProducto"
        );

    if (!boton) {
        return;
    }

    if (mostrar) {
        boton.style.display = "inline-flex";
    } else {
        boton.style.display = "none";
    }
}


// ==========================================
// CREAR FORMULARIO DE PRODUCTO
// ==========================================

function crearFormularioProducto(
    productoExistente = null
) {
    const formulario =
        document.createElement("div");

    formulario.className =
        "producto-form";

    formulario.innerHTML = `
        <h4>
            <i class="fas fa-box-open"></i> Producto
        </h4>

        <label>
            <i class="fas fa-camera"></i> Fotografías
        </label>

        <input
            type="file"
            class="fotos"
            accept="image/*"
            multiple
        >

        <label>
            <i class="fas fa-tag"></i> Nombre del producto
        </label>

        <input
            type="text"
            class="nombre"
            placeholder="Ej. Manta de llama"
        >

        <label>
            <i class="fas fa-layer-group"></i> Categoría
        </label>

        <input
            type="text"
            class="categoria"
            placeholder="Ej. Textiles"
        >

        <label>
            <i class="fas fa-dollar-sign"></i> Precio en Bs
        </label>

        <input
            type="number"
            class="precio"
            placeholder="Ej. 180"
            min="0"
        >

        <label>
            <i class="fas fa-align-left"></i> Descripción
        </label>

        <textarea
            class="descripcion"
            placeholder="Descripción del producto"
        ></textarea>

        <button
            type="button"
            class="btn-quitar"
        >
            <i class="fas fa-trash-alt"></i> Quitar producto
        </button>
    `;


    // ======================================
    // COLOCAR DATOS SI ES EDICIÓN
    // ======================================

    if (productoExistente) {
        formulario.querySelector(
            ".nombre"
        ).value =
            productoExistente.nombre || "";

        formulario.querySelector(
            ".categoria"
        ).value =
            productoExistente.categoria || "";

        formulario.querySelector(
            ".precio"
        ).value =
            productoExistente.precio || "";

        formulario.querySelector(
            ".descripcion"
        ).value =
            productoExistente.descripcion || "";
    }


    // ======================================
    // BOTÓN QUITAR
    // ======================================

    const botonQuitar =
        formulario.querySelector(
            ".btn-quitar"
        );

    botonQuitar.onclick =
        function () {
            formulario.style.animation = "fadeUp 0.3s reverse forwards";
            setTimeout(function () {
                formulario.remove();
            }, 300);
        };


    return formulario;
}


// ==========================================
// AGREGAR PRODUCTO AL NUEVO PRODUCTOR
// ==========================================

function agregarProducto() {
    const producto =
        crearFormularioProducto();

    formularioProductos.appendChild(
        producto
    );

    // Scroll to new form
    producto.scrollIntoView({ behavior: "smooth", block: "center" });
}


// ==========================================
// GUARDAR INFORMACIÓN
// ==========================================

async function guardarProductor() {
    const area =
        document.getElementById("area").value;

    const nombre =
        document.getElementById("nombreProductor").value.trim();

    const ubicacion =
        document.getElementById("ubicacion").value.trim();

    const whatsapp =
        document.getElementById("whatsapp").value.trim();

    const facebook =
        document.getElementById("facebook").value.trim();

    const tiktok =
        document.getElementById("tiktok").value.trim();


    // ======================================
    // VALIDAR DATOS DEL PRODUCTOR
    // ======================================

    if (
        nombre === "" ||
        ubicacion === "" ||
        whatsapp === ""
    ) {
        showToast(
            "Completa nombre, ubicación y WhatsApp.",
            "warning"
        );
        return;
    }


    // ======================================
    // AÑADIR PRODUCTO A PRODUCTOR EXISTENTE
    // ======================================

    if (
        productorNuevoProducto !== null
    ) {
        await guardarNuevoProducto();
        return;
    }


    // ======================================
    // EDITAR PRODUCTO
    // ======================================

    if (
        productoEditando !== null &&
        indiceProductoEditando !== null
    ) {
        await guardarProductoEditado();
        return;
    }


    // ======================================
    // EDITAR PRODUCTOR
    // ======================================

    if (
        productorEditando !== null
    ) {
        const productor =
            productores[productorEditando];

        if (!productor) {
            showToast(
                "No se encontró el productor.",
                "error"
            );
            return;
        }

        productor.area = area;
        productor.nombre = nombre;
        productor.ubicacion = ubicacion;
        productor.whatsapp = whatsapp;
        productor.facebook = facebook;
        productor.tiktok = tiktok;

        const guardado = guardarDatos();

        if (!guardado) {
            return;
        }

        showToast(
            "Información del productor actualizada correctamente."
        );

        productorEditando = null;

        limpiarFormulario();
        habilitarCamposProductor();

        cambiarTituloFormulario(
            '<i class="fas fa-user-plus"></i> Registrar productor'
        );

        cambiarTextoGuardar(
            '<i class="fas fa-save"></i> Guardar productor'
        );

        mostrarBotonAgregarProducto(true);

        admin.classList.add("oculto");

        mostrarCatalogo();
        updateHeroStats();
        return;
    }


    // ======================================
    // NUEVO PRODUCTOR
    // ======================================

    const formularios =
        formularioProductos.querySelectorAll(
            ".producto-form"
        );

    if (formularios.length === 0) {
        showToast(
            "Debes agregar por lo menos un producto.",
            "warning"
        );
        return;
    }

    const productos = [];

    for (const formulario of formularios) {
        const nombreProducto =
            formulario
                .querySelector(".nombre")
                .value.trim();

        const categoria =
            formulario
                .querySelector(".categoria")
                .value.trim();

        const precio =
            formulario
                .querySelector(".precio")
                .value;

        const descripcion =
            formulario
                .querySelector(".descripcion")
                .value.trim();

        const archivos =
            formulario
                .querySelector(".fotos")
                .files;

        if (
            nombreProducto === "" ||
            precio === ""
        ) {
            showToast(
                "Completa el nombre y precio de cada producto.",
                "warning"
            );
            return;
        }

        const fotos = [];

        for (const archivo of archivos) {
            try {
                const foto =
                    await leerFoto(archivo);
                fotos.push(foto);
            } catch (error) {
                showToast(
                    "No se pudo cargar una fotografía.",
                    "error"
                );
                return;
            }
        }

        productos.push({
            id:
                Date.now() +
                Math.floor(
                    Math.random() * 100000
                ),
            nombre: nombreProducto,
            categoria: categoria,
            precio: precio,
            descripcion: descripcion,
            fotos: fotos
        });
    }


    // ======================================
    // CREAR PRODUCTOR
    // ======================================

    const productor = {
        id: Date.now(),
        area: area,
        nombre: nombre,
        ubicacion: ubicacion,
        whatsapp: whatsapp,
        facebook: facebook,
        tiktok: tiktok,
        productos: productos
    };

    productores.push(productor);

    const guardado = guardarDatos();

    if (!guardado) {
        return;
    }

    showToast(
        "Productor guardado correctamente."
    );

    limpiarFormulario();
    habilitarCamposProductor();

    admin.classList.add("oculto");

    mostrarCatalogo();
    updateHeroStats();
}


// ==========================================
// GUARDAR NUEVO PRODUCTO
// EN PRODUCTOR EXISTENTE
// ==========================================

async function guardarNuevoProducto() {
    const productor =
        productorNuevoProducto;

    if (!productor) {
        showToast(
            "No se encontró el productor.",
            "error"
        );
        return;
    }

    const formulario =
        formularioProductos.querySelector(
            ".producto-form"
        );

    if (!formulario) {
        showToast(
            "No se encontró el formulario del producto.",
            "error"
        );
        return;
    }

    const nombreProducto =
        formulario
            .querySelector(".nombre")
            .value.trim();

    const categoria =
        formulario
            .querySelector(".categoria")
            .value.trim();

    const precio =
        formulario
            .querySelector(".precio")
            .value;

    const descripcion =
        formulario
            .querySelector(".descripcion")
            .value.trim();

    const archivos =
        formulario
            .querySelector(".fotos")
            .files;

    if (
        nombreProducto === "" ||
        precio === ""
    ) {
        showToast(
            "Completa el nombre y precio del producto.",
            "warning"
        );
        return;
    }

    const fotos = [];

    for (const archivo of archivos) {
        try {
            const foto =
                await leerFoto(archivo);
            fotos.push(foto);
        } catch (error) {
            showToast(
                "No se pudo cargar una fotografía.",
                "error"
            );
            return;
        }
    }


    // ======================================
    // CREAR PRODUCTO
    // ======================================

    const nuevoProducto = {
        id:
            Date.now() +
            Math.floor(
                Math.random() * 100000
            ),
        nombre: nombreProducto,
        categoria: categoria,
        precio: precio,
        descripcion: descripcion,
        fotos: fotos
    };


    // ======================================
    // ASEGURAR ARRAY DE PRODUCTOS
    // ======================================

    if (
        !Array.isArray(productor.productos)
    ) {
        productor.productos = [];
    }

    productor.productos.push(nuevoProducto);


    // ======================================
    // GUARDAR
    // ======================================

    const guardado = guardarDatos();

    if (!guardado) {
        return;
    }

    showToast(
        "Nuevo producto agregado correctamente."
    );

    productorNuevoProducto = null;

    limpiarFormulario();
    habilitarCamposProductor();

    cambiarTituloFormulario(
        '<i class="fas fa-user-plus"></i> Registrar productor'
    );

    cambiarTextoGuardar(
        '<i class="fas fa-save"></i> Guardar productor'
    );

    mostrarBotonAgregarProducto(true);

    admin.classList.add("oculto");

    mostrarCatalogo();
    updateHeroStats();
}


// ==========================================
// LEER FOTOGRAFÍA
// ==========================================

function leerFoto(archivo) {
    return new Promise(
        function (resolve, reject) {
            const lector =
                new FileReader();

            lector.onload =
                function () {
                    resolve(lector.result);
                };

            lector.onerror =
                function () {
                    reject();
                };

            lector.readAsDataURL(archivo);
        }
    );
}


// ==========================================
// GUARDAR EN LOCALSTORAGE
// ==========================================

function guardarDatos() {
    try {
        localStorage.setItem(
            "productoresBolivia",
            JSON.stringify(productores)
        );
        return true;
    } catch (error) {
        showToast(
            "No se pudieron guardar los datos. " +
            "Las fotografías pueden ser demasiado grandes. " +
            "Prueba con menos fotografías o imágenes más pequeñas.",
            "error"
        );
        return false;
    }
}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {
    document.getElementById("area").value =
        "artesanias";

    document.getElementById("nombreProductor").value =
        "";

    document.getElementById("ubicacion").value =
        "";

    document.getElementById("whatsapp").value =
        "";

    document.getElementById("facebook").value =
        "";

    document.getElementById("tiktok").value =
        "";

    formularioProductos.innerHTML = "";
}


// ==========================================
// MOSTRAR CATÁLOGO
// ==========================================

function mostrarCatalogo() {
    catalogo.innerHTML = "";

    const lista =
        productores.filter(
            function (productor) {
                return (
                    productor.area ===
                    areaActual
                );
            }
        );

    if (lista.length === 0) {
        const areaLabel = areaActual === "artesanias"
            ? "artesanías"
            : "transformación";

        catalogo.innerHTML = `
            <div class="vacio">
                <h3>
                    No hay productores de ${areaLabel} registrados
                </h3>
                <p>
                    Presiona <strong>Administrar</strong> para agregar productores y sus productos.
                </p>
            </div>
        `;
        return;
    }

    lista.forEach(
        function (productor, index) {
            mostrarProductor(productor, index);
        }
    );
}


// ==========================================
// MOSTRAR PRODUCTOR
// ==========================================

function mostrarProductor(productor, index) {
    const bloque =
        document.createElement("div");

    bloque.className = "productor";
    bloque.style.animationDelay = (index * 0.1) + "s";


    // ======================================
    // CABECERA
    // ======================================

    const cabecera =
        document.createElement("div");

    cabecera.className = "productor-cabecera";

    const nombre =
        document.createElement("h3");

    nombre.innerHTML =
        '<i class="fas fa-user-circle"></i> ' +
        productor.nombre;

    const ubicacion =
        document.createElement("p");

    ubicacion.className = "ubicacion";

    ubicacion.innerHTML =
        '<i class="fas fa-map-marker-alt"></i> ' +
        productor.ubicacion;

    cabecera.appendChild(nombre);
    cabecera.appendChild(ubicacion);


    // ======================================
    // CONTACTOS
    // ======================================

    const contactos =
        document.createElement("div");

    contactos.className = "contactos";

    if (productor.whatsapp) {
        const whatsapp =
            document.createElement("a");

        whatsapp.innerHTML =
            '<i class="fab fa-whatsapp"></i> WhatsApp';

        whatsapp.className = "whatsapp";

        whatsapp.href =
            "https://wa.me/" +
            productor.whatsapp.replace(
                /\D/g,
                ""
            );

        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";

        contactos.appendChild(whatsapp);
    }

    if (productor.facebook) {
        const facebook =
            document.createElement("a");

        facebook.innerHTML =
            '<i class="fab fa-facebook-f"></i> Facebook';

        facebook.className = "facebook";

        facebook.href = productor.facebook;

        facebook.target = "_blank";
        facebook.rel = "noopener noreferrer";

        contactos.appendChild(facebook);
    }

    if (productor.tiktok) {
        const tiktok =
            document.createElement("a");

        tiktok.innerHTML =
            '<i class="fab fa-tiktok"></i> TikTok';

        tiktok.className = "tiktok";

        tiktok.href = productor.tiktok;

        tiktok.target = "_blank";
        tiktok.rel = "noopener noreferrer";

        contactos.appendChild(tiktok);
    }

    cabecera.appendChild(contactos);


    // ======================================
    // EDITAR PRODUCTOR
    // ======================================

    const botonEditarProductor =
        document.createElement("button");

    botonEditarProductor.type = "button";

    botonEditarProductor.className =
        "editar-productor";

    botonEditarProductor.innerHTML =
        '<i class="fas fa-pen"></i> Editar productor';

    botonEditarProductor.onclick =
        function () {
            editarProductor(productor);
        };

    const botonEliminarProductor =
        document.createElement("button");

    botonEliminarProductor.type = "button";

    botonEliminarProductor.className =
        "eliminar-productor";

    botonEliminarProductor.innerHTML =
        '<i class="fas fa-trash-alt"></i> Eliminar productor';

    botonEliminarProductor.onclick =
        function () {
            eliminarProductor(productor);
        };

    const accionesProductor =
        document.createElement("div");
    accionesProductor.style.display = "flex";
    accionesProductor.style.gap = "10px";
    
    accionesProductor.appendChild(botonEditarProductor);
    accionesProductor.appendChild(botonEliminarProductor);

    cabecera.appendChild(accionesProductor);

    bloque.appendChild(cabecera);


    // ======================================
    // LISTA DE PRODUCTOS
    // ======================================

    const productos =
        document.createElement("div");

    productos.className = "lista-productos";

    if (
        !Array.isArray(productor.productos)
    ) {
        productor.productos = [];
    }

    productor.productos.forEach(
        function (producto, indice) {
            mostrarProducto(
                productos,
                productor,
                producto,
                indice
            );
        }
    );

    bloque.appendChild(productos);


    // ======================================
    // BOTÓN AÑADIR NUEVO PRODUCTO
    // ======================================

    const botonNuevoProducto =
        document.createElement("button");

    botonNuevoProducto.type = "button";

    botonNuevoProducto.innerHTML =
        '<i class="fas fa-plus-circle"></i> Añadir nuevo producto';

    botonNuevoProducto.className = "btn-nuevo-producto";

    botonNuevoProducto.onclick =
        function () {
            abrirFormularioNuevoProducto(
                productor
            );
        };

    bloque.appendChild(botonNuevoProducto);

    catalogo.appendChild(bloque);
}


// ==========================================
// EDITAR PRODUCTOR
// ==========================================

function editarProductor(productor) {
    const indice =
        productores.indexOf(productor);

    if (indice === -1) {
        showToast(
            "No se encontró el productor.",
            "error"
        );
        return;
    }

    productorEditando = indice;
    productoEditando = null;
    indiceProductoEditando = null;
    productorNuevoProducto = null;

    document.getElementById("area").value =
        productor.area || "artesanias";

    document.getElementById("nombreProductor").value =
        productor.nombre || "";

    document.getElementById("ubicacion").value =
        productor.ubicacion || "";

    document.getElementById("whatsapp").value =
        productor.whatsapp || "";

    document.getElementById("facebook").value =
        productor.facebook || "";

    document.getElementById("tiktok").value =
        productor.tiktok || "";

    formularioProductos.innerHTML = "";

    habilitarCamposProductor();

    cambiarTituloFormulario(
        '<i class="fas fa-pen"></i> Editar productor'
    );

    cambiarTextoGuardar(
        '<i class="fas fa-save"></i> Guardar cambios'
    );

    mostrarBotonAgregarProducto(false);

    admin.classList.remove("oculto");
}


// ==========================================
// ABRIR FORMULARIO
// PARA AÑADIR PRODUCTO A PRODUCTOR EXISTENTE
// ==========================================

function abrirFormularioNuevoProducto(
    productor
) {
    if (!productor) {
        showToast(
            "No se encontró el productor.",
            "error"
        );
        return;
    }

    productorNuevoProducto = productor;
    productorEditando = null;
    productoEditando = null;
    indiceProductoEditando = null;


    // ======================================
    // MOSTRAR DATOS DEL PRODUCTOR
    // ======================================

    document.getElementById("area").value =
        productor.area || "artesanias";

    document.getElementById("nombreProductor").value =
        productor.nombre || "";

    document.getElementById("ubicacion").value =
        productor.ubicacion || "";

    document.getElementById("whatsapp").value =
        productor.whatsapp || "";

    document.getElementById("facebook").value =
        productor.facebook || "";

    document.getElementById("tiktok").value =
        productor.tiktok || "";


    // ======================================
    // BLOQUEAR DATOS DEL PRODUCTOR
    // ======================================

    document.getElementById("area").disabled = true;
    document.getElementById("nombreProductor").disabled = true;
    document.getElementById("ubicacion").disabled = true;
    document.getElementById("whatsapp").disabled = true;
    document.getElementById("facebook").disabled = true;
    document.getElementById("tiktok").disabled = true;


    // ======================================
    // LIMPIAR PRODUCTOS DEL FORMULARIO
    // ======================================

    formularioProductos.innerHTML = "";


    // ======================================
    // CREAR NUEVO FORMULARIO
    // ======================================

    const formulario = crearFormularioProducto();

    formularioProductos.appendChild(formulario);


    // ======================================
    // CAMBIAR TÍTULO
    // ======================================

    cambiarTituloFormulario(
        '<i class="fas fa-plus-circle"></i> Añadir nuevo producto'
    );

    cambiarTextoGuardar(
        '<i class="fas fa-save"></i> Guardar nuevo producto'
    );

    mostrarBotonAgregarProducto(false);

    admin.classList.remove("oculto");
}


// ==========================================
// HABILITAR CAMPOS DEL PRODUCTOR
// ==========================================

function habilitarCamposProductor() {
    document.getElementById("area").disabled = false;
    document.getElementById("nombreProductor").disabled = false;
    document.getElementById("ubicacion").disabled = false;
    document.getElementById("whatsapp").disabled = false;
    document.getElementById("facebook").disabled = false;
    document.getElementById("tiktok").disabled = false;
}


// ==========================================
// MOSTRAR PRODUCTO
// ==========================================

function mostrarProducto(
    contenedor,
    productor,
    producto,
    indice
) {
    const tarjeta =
        document.createElement("div");

    tarjeta.className = "producto";
    tarjeta.style.animationDelay = (indice * 0.1) + "s";


    // ======================================
    // GALERÍA
    // ======================================

    const galeria =
        document.createElement("div");

    galeria.className = "galeria";

    const fotos =
        Array.isArray(producto.fotos)
            ? producto.fotos
            : [];

    if (fotos.length > 0) {
        fotos.forEach(
            function (foto) {
                const imagen =
                    document.createElement("img");

                imagen.src = foto;
                imagen.alt = producto.nombre || "Producto";
                imagen.loading = "lazy";

                galeria.appendChild(imagen);
            }
        );
    } else {
        const sinFoto =
            document.createElement("div");

        sinFoto.className = "sin-foto";
        sinFoto.textContent = "Sin fotografía";

        galeria.appendChild(sinFoto);
    }

    tarjeta.appendChild(galeria);


    // ======================================
    // INFORMACIÓN
    // ======================================

    const informacion =
        document.createElement("div");

    informacion.className = "producto-info";


    // ======================================
    // CATEGORÍA
    // ======================================

    if (producto.categoria) {
        const categoria =
            document.createElement("span");

        categoria.className = "categoria";
        categoria.textContent = producto.categoria;

        informacion.appendChild(categoria);
    }


    // ======================================
    // NOMBRE
    // ======================================

    const nombre =
        document.createElement("h4");

    nombre.textContent =
        producto.nombre || "Producto";

    informacion.appendChild(nombre);


    // ======================================
    // DESCRIPCIÓN
    // ======================================

    if (producto.descripcion) {
        const descripcion =
            document.createElement("p");

        descripcion.textContent =
            producto.descripcion;

        informacion.appendChild(descripcion);
    }


    // ======================================
    // PRECIO
    // ======================================

    const precio =
        document.createElement("p");

    precio.className = "precio";

    precio.textContent =
        "Bs " + producto.precio;

    informacion.appendChild(precio);


    // ======================================
    // BOTONES
    // ======================================

    const acciones =
        document.createElement("div");

    acciones.className = "acciones";


    // ======================================
    // EDITAR
    // ======================================

    const botonEditar =
        document.createElement("button");

    botonEditar.type = "button";
    botonEditar.className = "editar";

    botonEditar.innerHTML =
        '<i class="fas fa-pen"></i> Editar';

    botonEditar.onclick =
        function () {
            editarProducto(
                productor,
                indice
            );
        };

    acciones.appendChild(botonEditar);


    // ======================================
    // ELIMINAR
    // ======================================

    const botonEliminar =
        document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.className = "eliminar";

    botonEliminar.innerHTML =
        '<i class="fas fa-trash-alt"></i> Eliminar';

    botonEliminar.onclick =
        function () {
            eliminarProducto(
                productor,
                indice
            );
        };

    acciones.appendChild(botonEliminar);

    informacion.appendChild(acciones);

    tarjeta.appendChild(informacion);

    contenedor.appendChild(tarjeta);
}


// ==========================================
// EDITAR PRODUCTO
// ==========================================

function editarProducto(
    productor,
    indice
) {
    if (
        !productor ||
        !Array.isArray(productor.productos)
    ) {
        showToast(
            "No se encontró el productor.",
            "error"
        );
        return;
    }

    const producto =
        productor.productos[indice];

    if (!producto) {
        showToast(
            "No se encontró el producto.",
            "error"
        );
        return;
    }


    // ======================================
    // GUARDAR QUÉ PRODUCTO SE EDITA
    // ======================================

    productoEditando = productor;
    indiceProductoEditando = indice;
    productorEditando = null;
    productorNuevoProducto = null;


    // ======================================
    // DATOS DEL PRODUCTOR
    // ======================================

    document.getElementById("area").value =
        productor.area || "artesanias";

    document.getElementById("nombreProductor").value =
        productor.nombre || "";

    document.getElementById("ubicacion").value =
        productor.ubicacion || "";

    document.getElementById("whatsapp").value =
        productor.whatsapp || "";

    document.getElementById("facebook").value =
        productor.facebook || "";

    document.getElementById("tiktok").value =
        productor.tiktok || "";

    habilitarCamposProductor();


    // ======================================
    // LIMPIAR FORMULARIO
    // ======================================

    formularioProductos.innerHTML = "";


    // ======================================
    // CREAR FORMULARIO DE EDICIÓN
    // ======================================

    const formulario =
        crearFormularioProducto(producto);


    // ======================================
    // FOTOGRAFÍAS ACTUALES
    // ======================================

    const fotosActuales =
        Array.isArray(producto.fotos)
            ? producto.fotos
            : [];

    if (fotosActuales.length > 0) {
        const texto =
            document.createElement("p");

        texto.innerHTML =
            '<strong><i class="fas fa-images"></i> Fotografías actuales:</strong>';
        texto.style.marginBottom = "10px";

        formulario.insertBefore(
            texto,
            formulario.firstChild
        );

        const galeria =
            document.createElement("div");

        galeria.className = "galeria";
        galeria.style.marginBottom = "15px";
        galeria.style.borderRadius = "8px";
        galeria.style.overflow = "hidden";

        fotosActuales.forEach(
            function (foto) {
                const imagen =
                    document.createElement("img");

                imagen.src = foto;
                imagen.style.width = "120px";
                imagen.style.minWidth = "120px";
                imagen.style.height = "120px";
                imagen.style.objectFit = "cover";
                imagen.loading = "lazy";

                galeria.appendChild(imagen);
            }
        );

        const primeraEtiqueta =
            formulario.querySelector("label");

        formulario.insertBefore(
            galeria,
            primeraEtiqueta
        );
    }

    formularioProductos.appendChild(formulario);


    // ======================================
    // CAMBIAR TÍTULO
    // ======================================

    cambiarTituloFormulario(
        '<i class="fas fa-pen"></i> Editar producto'
    );

    cambiarTextoGuardar(
        '<i class="fas fa-save"></i> Guardar cambios del producto'
    );

    mostrarBotonAgregarProducto(false);

    admin.classList.remove("oculto");
}


// ==========================================
// GUARDAR PRODUCTO EDITADO
// ==========================================

async function guardarProductoEditado() {
    const productor = productoEditando;

    if (!productor) {
        showToast(
            "No se encontró el productor.",
            "error"
        );
        return;
    }

    const producto =
        productor.productos[indiceProductoEditando];

    if (!producto) {
        showToast(
            "No se encontró el producto.",
            "error"
        );
        return;
    }


    // ======================================
    // BUSCAR FORMULARIO
    // ======================================

    const formulario =
        formularioProductos.querySelector(
            ".producto-form"
        );

    if (!formulario) {
        showToast(
            "No se encontró el formulario.",
            "error"
        );
        return;
    }


    // ======================================
    // DATOS NUEVOS
    // ======================================

    const nuevoNombre =
        formulario
            .querySelector(".nombre")
            .value.trim();

    const nuevaCategoria =
        formulario
            .querySelector(".categoria")
            .value.trim();

    const nuevoPrecio =
        formulario
            .querySelector(".precio")
            .value;

    const nuevaDescripcion =
        formulario
            .querySelector(".descripcion")
            .value.trim();

    const archivos =
        formulario
            .querySelector(".fotos")
            .files;


    // ======================================
    // VALIDAR
    // ======================================

    if (
        nuevoNombre === "" ||
        nuevoPrecio === ""
    ) {
        showToast(
            "Completa el nombre y precio del producto.",
            "warning"
        );
        return;
    }


    // ======================================
    // CONSERVAR FOTOS ACTUALES
    // ======================================

    let nuevasFotos =
        Array.isArray(producto.fotos)
            ? producto.fotos
            : [];


    // ======================================
    // SI SE SELECCIONAN NUEVAS FOTOS
    // SE REEMPLAZAN LAS ANTERIORES
    // ======================================

    if (archivos.length > 0) {
        nuevasFotos = [];

        for (const archivo of archivos) {
            try {
                const foto =
                    await leerFoto(archivo);
                nuevasFotos.push(foto);
            } catch (error) {
                showToast(
                    "No se pudo cargar una fotografía.",
                    "error"
                );
                return;
            }
        }
    }


    // ======================================
    // ACTUALIZAR PRODUCTO
    // ======================================

    producto.nombre = nuevoNombre;
    producto.categoria = nuevaCategoria;
    producto.precio = nuevoPrecio;
    producto.descripcion = nuevaDescripcion;
    producto.fotos = nuevasFotos;


    // ======================================
    // GUARDAR
    // ======================================

    const guardado = guardarDatos();

    if (!guardado) {
        return;
    }

    showToast(
        "Producto actualizado correctamente."
    );

    productoEditando = null;
    indiceProductoEditando = null;

    limpiarFormulario();
    habilitarCamposProductor();

    cambiarTituloFormulario(
        '<i class="fas fa-user-plus"></i> Registrar productor'
    );

    cambiarTextoGuardar(
        '<i class="fas fa-save"></i> Guardar productor'
    );

    mostrarBotonAgregarProducto(true);

    admin.classList.add("oculto");

    mostrarCatalogo();
    updateHeroStats();
}


// ==========================================
// ELIMINAR PRODUCTOR
// ==========================================

function eliminarProductor(productor) {
    const indice = productores.indexOf(productor);

    if (indice === -1) {
        return;
    }

    const confirmar = confirm(
        "¿Seguro que deseas eliminar al productor \"" +
        productor.nombre +
        "\" y todos sus productos?"
    );

    if (!confirmar) {
        return;
    }

    productores.splice(indice, 1);

    const guardado = guardarDatos();

    if (!guardado) {
        return;
    }

    showToast("Productor eliminado correctamente.");

    mostrarCatalogo();
    updateHeroStats();
}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarProducto(
    productor,
    indice
) {
    if (
        !productor ||
        !Array.isArray(productor.productos)
    ) {
        return;
    }

    const producto =
        productor.productos[indice];

    if (!producto) {
        return;
    }

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar el producto \"" +
            producto.nombre +
            "\"?"
        );

    if (!confirmar) {
        return;
    }

    productor.productos.splice(indice, 1);

    const guardado = guardarDatos();

    if (!guardado) {
        return;
    }

    showToast(
        "Producto eliminado correctamente."
    );

    mostrarCatalogo();
    updateHeroStats();
}


// ==========================================
// MOSTRAR CATÁLOGO AL INICIAR
// ==========================================

mostrarCatalogo();
updateHeroStats();