// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Espejo Dental Intrálume",
        categoria: "instrumentos",
        precio: 25.99,
        icono: "fas fa-search",
        stock: 50
    },
    {
        id: 2,
        nombre: "Brackets Metálicos Ortodoncia",
        categoria: "ortodoncia",
        precio: 89.99,
        icono: "fas fa-teeth",
        stock: 30
    },
    {
        id: 3,
        nombre: "Limas de Endodoncia K-Files",
        categoria: "endodoncia",
        precio: 45.50,
        icono: "fas fa-tools",
        stock: 75
    },
    {
        id: 4,
        nombre: "Sonda Periodontal",
        categoria: "periodoncia",
        precio: 32.75,
        icono: "fas fa-ruler",
        stock: 40
    },
    {
        id: 5,
        nombre: "Kit de Blanqueamiento Dental",
        categoria: "blanqueamiento",
        precio: 125.00,
        icono: "fas fa-smile",
        stock: 25
    },
    {
        id: 6,
        nombre: "Radiografía Dental Digital",
        categoria: "radiologia",
        precio: 299.99,
        icono: "fas fa-x-ray",
        stock: 15
    },
    {
        id: 7,
        nombre: "Cepillo Dental Profesional",
        categoria: "higiene",
        precio: 18.99,
        icono: "fas fa-toothbrush",
        stock: 100
    },
    {
        id: 8,
        nombre: "Fresa de Diamante",
        categoria: "instrumentos",
        precio: 55.25,
        icono: "fas fa-diamond",
        stock: 60
    },
    {
        id: 9,
        nombre: "Arcos de Ortodoncia NiTi",
        categoria: "ortodoncia",
        precio: 67.50,
        icono: "fas fa-wave-square",
        stock: 45
    },
    {
        id: 10,
        nombre: "Gutapercha Endodoncia",
        categoria: "endodoncia",
        precio: 28.75,
        icono: "fas fa-thermometer",
        stock: 80
    },
    {
        id: 11,
        nombre: "Curetas Gracey",
        categoria: "periodoncia",
        precio: 42.00,
        icono: "fas fa-hook",
        stock: 35
    },
    {
        id: 12,
        nombre: "Hilo Dental Profesional",
        categoria: "higiene",
        precio: 12.50,
        icono: "fas fa-thread",
        stock: 120
    }
];

// Estado del carrito
let carrito = [];
let categoriaActual = 'all';
let productosFiltrados = [...productos];

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
    actualizarCarrito();
    
    // Event listeners
    searchInput.addEventListener('input', buscarProductos);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarProductos();
        }
    });
});

// Renderizar productos
function renderizarProductos() {
    productsGrid.innerHTML = '';
    
    productosFiltrados.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${producto.icono}"></i>
            </div>
            <div class="product-info">
                <h4 class="product-title">${producto.nombre}</h4>
                <p class="product-category">${producto.categoria}</p>
                <div class="product-price">$${producto.precio.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-plus"></i>
                        Agregar
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filtrar por categoría
function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    
    // Actualizar enlaces activos
    document.querySelectorAll('.categories-list a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar productos
    if (categoria === 'all') {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    }
    
    renderizarProductos();
}

// Buscar productos
function buscarProductos() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (termino === '') {
        productosFiltrados = categoriaActual === 'all' 
            ? [...productos] 
            : productos.filter(producto => producto.categoria === categoriaActual);
    } else {
        productosFiltrados = productos.filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(termino);
            const coincideCategoria = producto.categoria.toLowerCase().includes(termino);
            const coincideBusqueda = coincideNombre || coincideCategoria;
            
            if (categoriaActual === 'all') {
                return coincideBusqueda;
            } else {
                return coincideBusqueda && producto.categoria === categoriaActual;
            }
        });
    }
    
    renderizarProductos();
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.producto.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            producto: producto,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

// Actualizar carrito
function actualizarCarrito() {
    // Actualizar contador
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar items del carrito
    renderizarCarrito();
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Renderizar items del carrito
function renderizarCarrito() {
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <span>Agrega productos para comenzar</span>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    carrito.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${item.producto.icono}"></i>
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.producto.nombre}</h4>
                <p class="cart-item-price">$${item.producto.precio.toFixed(2)}</p>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.producto.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.cantidad}</span>
                        <button class="quantity-btn" onclick="cambiarCantidad(${item.producto.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="eliminarDelCarrito(${item.producto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Cambiar cantidad de producto
function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.producto.id === productoId);
    if (!item) return;
    
    item.cantidad += cambio;
    
    if (item.cantidad <= 0) {
        eliminarDelCarrito(productoId);
    } else {
        actualizarCarrito();
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.producto.id !== productoId);
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Toggle carrito
function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

// Toggle menú móvil
function toggleMobileMenu() {
    const categoriesNav = document.getElementById('categoriesNav');
    categoriesNav.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Proceder al checkout
function checkout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'error');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    mostrarNotificacion(`Procesando pedido de ${totalItems} productos por $${total.toFixed(2)}`);
    
    // Simular proceso de checkout
    setTimeout(() => {
        carrito = [];
        actualizarCarrito();
        toggleCart();
        mostrarNotificacion('¡Pedido procesado exitosamente!', 'success');
    }, 2000);
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Estilos para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: tipo === 'success' ? '#4ade80' : tipo === 'error' ? '#ff4757' : '#2c5aa0',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '300px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Scroll a productos
function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Funcionalidad de búsqueda con debounce
let timeoutId;
function debounceSearch(func, delay) {
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Aplicar debounce a la búsqueda
const buscarConDebounce = debounceSearch(() => {
    buscarProductos();
}, 300);

// Reemplazar el event listener de búsqueda
searchInput.removeEventListener('input', buscarProductos);
searchInput.addEventListener('input', buscarConDebounce);

// Funciones adicionales para mejorar la UX

// Marcar como favorito (funcionalidad futura)
function toggleFavorito(productoId) {
    mostrarNotificacion('Función de favoritos próximamente disponible');
}

// Compartir producto (funcionalidad futura)
function compartirProducto(productoId) {
    mostrarNotificacion('Función de compartir próximamente disponible');
}

// Cerrar menú móvil al hacer clic en una categoría
document.addEventListener('click', function(e) {
    if (e.target.matches('.categories-list a') && window.innerWidth <= 768) {
        setTimeout(() => {
            document.getElementById('categoriesNav').classList.remove('open');
            overlay.classList.remove('active');
        }, 300);
    }
});

// Cerrar carrito con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        if (document.getElementById('categoriesNav').classList.contains('open')) {
            toggleMobileMenu();
        }
    }
});

// Actualizar UI cuando se redimensiona la ventana
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById('categoriesNav').classList.remove('open');
        if (!cartSidebar.classList.contains('open')) {
            overlay.classList.remove('active');
        }
    }
});