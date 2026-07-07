// Datos estáticos del catálogo de productos
const PRODUCTOS = [
    {
        id: 1,
        name: "Resma Papel Carta 500u",
        price: 4990,
        image: "assets/resma_papel_carta.png"
    },
    {
        id: 2,
        name: "Carpeta Plastificada",
        price: 1490,
        image: "assets/carpeta_plastificada.png"
    },
    {
        id: 3,
        name: "Lápiz Pasta",
        price: 490,
        image: "assets/lapiz_pasta.png"
    },
    {
        id: 4,
        name: "Tóner Impresora",
        price: 49990,
        image: "assets/toner_impresora.png"
    }
];

// Cargar producto nuevo desde localStorage si existe
const cargarNuevosProductos = () => {
    // 1. Cargar el array de productos nuevos (para soporte de múltiples ingresos)
    const nuevosProductosGuardados = localStorage.getItem('nuevosProductos');
    if (nuevosProductosGuardados) {
        try {
            const prods = JSON.parse(nuevosProductosGuardados);
            if (Array.isArray(prods)) {
                prods.forEach(prod => {
                    const existe = PRODUCTOS.find(p => p.id === prod.id);
                    if (!existe) {
                        PRODUCTOS.push(prod);
                    }
                });
            }
        } catch (e) {
            console.error("Error al cargar los nuevos productos:", e);
        }
    }
    
    // 2. Migración/Soporte para si quedó guardado el formato antiguo
    const viejo = localStorage.getItem('nuevoProducto');
    if (viejo) {
        try {
            const prod = JSON.parse(viejo);
            const existe = PRODUCTOS.find(p => p.id === prod.id);
            if (!existe) {
                PRODUCTOS.push(prod);
            }
        } catch(e) {}
    }
};

// Inicializar carga de nuevos productos
cargarNuevosProductos();

// Estado global de la aplicación (Carrito)
let carrito = [];

// Formateador de moneda para peso chileno (CLP)
const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor);
};

// Elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartIva = document.getElementById('cart-iva');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Cargar carrito desde localStorage
const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem('a1click_cart');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
        } catch (e) {
            carrito = [];
        }
    }
    actualizarInterfazCarrito();
};

// Guardar carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem('a1click_cart', JSON.stringify(carrito));
};

// Renderizar catálogo de productos
const renderizarCatalogo = () => {
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = PRODUCTOS.map(producto => `
        <article class="product-card">
            <div class="product-image-container">
                <img src="${producto.image}" alt="${producto.name}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.name}</h3>
                <p class="product-price">${formatearMoneda(producto.price)}</p>
                <button class="btn btn-primary" onclick="agregarAlCarro(${producto.id})">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al Carro
                </button>
            </div>
        </article>
    `).join('');
};

// Agregar un producto al carro
window.agregarAlCarro = (id) => {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    const itemEnCarro = carrito.find(item => item.id === id);

    if (itemEnCarro) {
        itemEnCarro.quantity += 1;
    } else {
        carrito.push({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            image: producto.image,
            quantity: 1
        });
    }

    guardarCarrito();
    actualizarInterfazCarrito();
    abrirCarro();
};

// Cambiar la cantidad de un producto en el carro
window.cambiarCantidad = (id, delta) => {
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        carrito = carrito.filter(item => item.id !== id);
    }

    guardarCarrito();
    actualizarInterfazCarrito();
};

// Eliminar un producto del carro
window.eliminarItem = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarInterfazCarrito();
};

// Abrir el carrito (drawer)
const abrirCarro = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
};

// Cerrar el carrito
const cerrarCarro = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
};

// Actualizar el DOM del carrito
const actualizarInterfazCarrito = () => {
    // Actualizar badge
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Si está vacío
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-cart-flatbed"></i>
                <p>Tu carrito está vacío.</p>
                <p class="subtext">¡Agrega algunos productos del catálogo!</p>
            </div>
        `;
        cartSubtotal.textContent = formatearMoneda(0);
        cartIva.textContent = formatearMoneda(0);
        cartTotal.textContent = formatearMoneda(0);
        checkoutBtn.disabled = true;
        return;
    }

    // Renderizar items
    cartItemsContainer.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">${formatearMoneda(item.price)}</div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <button class="delete-item-btn" onclick="eliminarItem(${item.id})" aria-label="Eliminar item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Calcular montos
    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    cartSubtotal.textContent = formatearMoneda(subtotal);
    cartIva.textContent = formatearMoneda(iva);
    cartTotal.textContent = formatearMoneda(total);
    checkoutBtn.disabled = false;
};

// Inicialización de Event Listeners
const inicializarEventListeners = () => {
    // Abrir/cerrar carro
    cartToggleBtn.addEventListener('click', abrirCarro);
    cartCloseBtn.addEventListener('click', cerrarCarro);
    cartOverlay.addEventListener('click', cerrarCarro);

    // Botón de checkout
    checkoutBtn.addEventListener('click', () => {
        if (carrito.length === 0) return;

        // Calcular montos finales
        const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const iva = Math.round(subtotal * 0.19);
        const total = subtotal + iva;

        // Datos del checkout para guardar en localStorage
        const checkoutData = {
            items: carrito,
            subtotal: subtotal,
            iva: iva,
            total: total
        };

        // Guardar detalles y redirigir
        localStorage.setItem('a1click_checkout_data', JSON.stringify(checkoutData));
        window.location.href = 'webpay.html';
    });
};

// Ejecución al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    cargarCarrito();
    inicializarEventListeners();
});
