// --- DATOS Y ESTADO ---
const productosBase = [
    { id: 1, nombre: "Espejo Dental", categoria: "Instrumentos", precio: 25.99, imagen: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400&auto=format&fit=crop" },
    { id: 2, nombre: "Brackets Metálicos", categoria: "Ortodoncia", precio: 89.99, imagen: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=400&auto=format&fit=crop" },
    { id: 3, nombre: "Limas K-Files", categoria: "Endodoncia", precio: 45.50, imagen: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400&auto=format&fit=crop" },
    { id: 4, nombre: "Sonda Periodontal", categoria: "Periodoncia", precio: 32.75, imagen: "https://images.unsplash.com/photo-1598256989800-fea5f95213b1?q=80&w=400&auto=format&fit=crop" },
    { id: 5, nombre: "Gel Blanqueador", categoria: "Blanqueamiento", precio: 55.00, imagen: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=400&auto=format&fit=crop" },
    { id: 6, nombre: "Guantes Nitrilo", categoria: "Higiene", precio: 18.20, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=400&auto=format&fit=crop" },
    { id: 7, nombre: "Radiografía", categoria: "Radiología", precio: 12.00, imagen: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400&auto=format&fit=crop" }
];

let carrito = JSON.parse(sessionStorage.getItem('dentstock_cart')) || [];
let productosFiltrados = []; 

// --- GENERACIÓN INICIAL DE PRODUCTOS ---
const todosLosProductos = [];
for (let i = 0; i < 50; i++) {
    const base = productosBase[i % productosBase.length];
    const prodId = `${base.id}-${i}`;
    const nombre = i < productosBase.length ? base.nombre : `${base.nombre} V-${i}`;
    
    todosLosProductos.push({
        id: prodId,
        nombre: nombre,
        categoria: base.categoria,
        precio: base.precio,
        imagen: base.imagen // <-- AHORA GUARDAMOS LA IMAGEN
    });
}

// --- RENDERIZADO EN EL GRID ---
const grid = document.getElementById('product-grid');
const noResults = document.getElementById('no-results');

function renderProducts(productos) {
    grid.innerHTML = '';
    
    if (productos.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        productos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // AQUÍ SE INSERTA LA IMAGEN REAL EN LUGAR DEL ICONO
            card.innerHTML = `
                <div class="product-image" style="padding: 0;">
                    <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <span class="category">${prod.categoria}</span>
                    <p class="price">$${prod.precio.toFixed(2)}</p>
                    <button class="btn-add-cart" onclick="addToCart('${prod.id}', '${prod.nombre}', ${prod.precio})">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// --- LÓGICA DE BÚSQUEDA Y FILTRADO ---
let currentCategory = 'Todos';

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    productosFiltrados = todosLosProductos.filter(prod => {
        const matchesCategory = currentCategory === 'Todos' || prod.categoria === currentCategory;
        const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm) || prod.categoria.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderProducts(productosFiltrados);
    updateSectionTitle();
}

function filterCategory(categoria, element) {
    event.preventDefault();
    currentCategory = categoria;
    
    document.querySelectorAll('#category-menu a').forEach(link => link.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('search-input').value = '';
    filterProducts();
}

function updateSectionTitle() {
    const title = document.getElementById('section-title');
    if (currentCategory === 'Todos') {
        title.textContent = "Productos Destacados";
    } else {
        title.textContent = `Categoría: ${currentCategory}`;
    }
}

// --- FUNCIÓN PARA LA SECCIÓN DE INFORMACIÓN ---
function showInfo(tipo) {
    event.preventDefault();
    const infoTexts = {
        'terminos': 'Términos y Condiciones:\n\n1. Los precios están sujetos a cambio sin previo aviso.\n2. El uso de los productos es responsabilidad del odontólogo.\n3. Garantía válida por 30 días en defectos de fábrica.',
        'privacidad': 'Aviso de Privacidad:\n\nEn DentStock protegemos tus datos. La información recabada (nombre, dirección, tarjeta) es utilizada únicamente para procesar tu pedido y no se comparte con terceros.',
        'envios': 'Política de Envíos y Devoluciones:\n\n- Envíos gratis en compras mayores a $500.\n- Tiempo de entrega: 3 a 5 días hábiles.\n- Devoluciones aceptadas dentro de los primeros 15 días con empaque original.',
        'faq': 'Preguntas Frecuentes:\n\n- ¿Hacen envíos internacionales? Sí, a toda Latinoamérica.\n- ¿Emiten factura? Sí, solicítala al correo facturacion@dentstock.com.\n- ¿Aceptan todas las tarjetas? Sí, Visa, Mastercard y Amex.'
    };
    alert(infoTexts[tipo]);
}

// --- LÓGICA DEL CARRITO ---
function addToCart(id, nombre, precio) {
    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    updateCartUI();
    
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => cartIcon.style.transform = "scale(1)", 200);
}

function removeFromCart(id) {
    carrito = carrito.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    sessionStorage.setItem('dentstock_cart', JSON.stringify(carrito));
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').textContent = totalItems;

    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    let totalPagar = 0;

    if (carrito.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPagar += subtotal;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p>Cant: ${item.cantidad} x $${item.precio.toFixed(2)}</p>
                </div>
                <div style="display:flex; align-items:center;">
                    <span class="cart-item-price">$${subtotal.toFixed(2)}</span>
                    <button class="btn-remove" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(div);
        });
    }
    document.getElementById('cart-total-price').textContent = `$${totalPagar.toFixed(2)}`;
    document.getElementById('modal-total').textContent = `$${totalPagar.toFixed(2)}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// --- LÓGICA DE PAGO ---
const modal = document.getElementById('paymentModal');
const paymentDetails = document.getElementById('payment-details');

function openPaymentModal() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
    }
    modal.style.display = "block";
    paymentDetails.innerHTML = '';
}

function closePaymentModal() { modal.style.display = "none"; }

function selectPaymentMethod(metodo) {
    document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');

    if (metodo === 'efectivo') {
        paymentDetails.innerHTML = `
            <div style="background:#f0fdf4; padding:15px; border-radius:8px; color:#166534; text-align:center; margin-bottom:20px;">
                <i class="fa-solid fa-store"></i> <strong>Pago en Efectivo</strong><br>
                <p style="font-size:0.9rem; margin-top:5px;">Acude a caja para realizar el pago al recibir tu pedido.</p>
            </div>
            <button class="btn-confirm" onclick="finalizarCompra()">Confirmar Pedido</button>
        `;
    } else {
        paymentDetails.innerHTML = `
            <form onsubmit="event.preventDefault(); finalizarCompra();">
                <div class="form-group">
                    <label>Titular de la tarjeta</label>
                    <input type="text" placeholder="Nombre completo" required>
                </div>
                <div class="form-group">
                    <label>Número de Tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required>
                </div>
                <div style="display:flex; gap:10px;">
                    <div class="form-group" style="flex:1;">
                        <label>Expiración</label>
                        <input type="text" placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>CVV</label>
                        <input type="password" placeholder="123" maxlength="3" required>
                    </div>
                </div>
                <button type="submit" class="btn-confirm" style="margin-top:10px;">Pagar Ahora</button>
            </form>
        `;
    }
}

function finalizarCompra() {
    alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");
    carrito = [];
    updateCartUI();
    closePaymentModal();
    toggleCart();
}

// ============================
// LÓGICA DE RASTREO Y RESEÑAS
// ============================

// --- 1. Rastreo de Pedidos ---
function trackOrder(e) {
    e.preventDefault();
    const code = document.getElementById('tracking-code').value.toUpperCase();
    const resultDiv = document.getElementById('tracking-result');
    
    resultDiv.className = 'tracking-result'; 
    resultDiv.innerHTML = 'Buscando...';
    resultDiv.style.display = 'block';

    setTimeout(() => {
        if (code.startsWith('DENT')) {
            resultDiv.className = 'tracking-result success';
            resultDiv.innerHTML = `<i class="fa-solid fa-box-open"></i> Pedido ${code} en camino.<br><small>Llegada estimada: En 2 días hábiles.</small>`;
        } else {
            resultDiv.className = 'tracking-result error';
            resultDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Folio no válido. Asegúrate de que empiece con "DENT".`;
        }
    }, 800);
}

// --- 2. Sistema de Reseñas ---
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('#star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid', 'active');
        } else {
            star.classList.remove('fa-solid', 'active');
            star.classList.add('fa-regular');
        }
    });
}

let reviews = JSON.parse(sessionStorage.getItem('dentstock_reviews')) || [
    { name: "Dr. Roberto", rating: 5, text: "Excelente calidad en los instrumentos, llegaron muy rápido." },
    { name: "Dra. Ana", rating: 4, text: "Muy buen servicio, aunque el empaque podría mejorar." }
];

function renderReviews() {
    const list = document.getElementById('reviews-list');
    if (!list) return;
    
    list.innerHTML = '';
    [...reviews].reverse().forEach(rev => {
        const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(rev.rating) + '<i class="fa-regular fa-star"></i>'.repeat(5 - rev.rating);
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="review-item-header">
                <span class="review-item-name">${rev.name}</span>
                <span class="review-item-stars">${starsHtml}</span>
            </div>
            <p class="review-item-text">"${rev.text}"</p>
        `;
        list.appendChild(div);
    });
}

function submitReview(e) {
    e.preventDefault();
    
    if (currentRating === 0) {
        alert("Por favor, selecciona una calificación con las estrellas.");
        return;
    }

    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;

    const newReview = {
        name: name,
        rating: currentRating,
        text: text
    };

    reviews.push(newReview);
    sessionStorage.setItem('dentstock_reviews', JSON.stringify(reviews));

    document.getElementById('review-name').value = '';
    document.getElementById('review-text').value = '';
    setRating(0); 
    
    renderReviews();
    alert("¡Gracias por tu reseña! Ha sido publicada.");
}

// ============================
// LÓGICA DEL MODAL DE LOGIN
// ============================

function openLoginModal(e) {
    e.preventDefault();
    document.getElementById('loginModal').style.display = "block";
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = "none";
}

function handleModalLogin(e) {
    e.preventDefault();
    alert("Iniciando sesión...");
    closeLoginModal();
    window.location.href = 'login.html'; 
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    productosFiltrados = [...todosLosProductos];
    renderProducts(productosFiltrados);
    updateCartUI();
    renderReviews();
});