// Formatter function for Rupee Currency (₹) with en-IN numbering
function formatPrice(rupees) {
    return '₹' + rupees.toLocaleString('en-IN');
}

// Mock Product Database with prices in INR (₹)
const products = [
    { id: 1, name: 'Pro Carbon Running Shoes', category: 'Footwear', price: 10999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', desc: 'Engineered for maximum speed and endurance with ultra-responsive carbon fiber plating.' },
    { id: 2, name: 'All-Terrain Football Cleats', category: 'Footwear', price: 7499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600', desc: 'Superior grip and ankle support on turf and natural grass fields.' },
    { id: 3, name: 'Pro Dri-Fit Training Jersey', category: 'Apparel', price: 1999, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600', desc: 'Lightweight moisture-wicking fabric designed to keep you cool during workouts.' },
    { id: 4, name: 'Compression Fitness Tights', category: 'Apparel', price: 2499, image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=600', desc: 'Enhances blood circulation and reduces muscle fatigue during heavy training sessions.' },
    { id: 5, name: 'Adjustable Dumbbell Set (Pair)', category: 'Gym Equipment', price: 16999, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600', desc: 'Compact adjustable dumbbells ranging from 2.5kg to 24kg for home gym workouts.' },
    { id: 6, name: 'Professional Resistance Bands', category: 'Gym Equipment', price: 1299, image: 'https://images.unsplash.com/photo-1598289431512-b97b09177c42?auto=format&fit=crop&q=80&w=600', desc: 'Set of 5 resistance bands with door anchor and handles for full-body workout.' },
    { id: 7, name: 'Official Match Basketball', category: 'Team Sports & Accessories', price: 2999, image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=600', desc: 'Optimal grip composite leather basketball for indoor and outdoor play.' },
    { id: 8, name: 'Elite Sports Duffel Bag', category: 'Team Sports & Accessories', price: 3499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600', desc: 'Water-resistant, spacious compartments with ventilated shoe pocket.' }
];

const categories = [
    { name: 'Footwear', count: 'Running & Cleats', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
    { name: 'Apparel', count: 'Jerseys & Tights', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400' },
    { name: 'Gym Equipment', count: 'Dumbbells & Bands', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Team Sports & Accessories', count: 'Balls & Gear Bags', image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=400' }
];

// Global State
let cart = [];
let wishlist = [1, 5];
let currentView = 'home';
let searchQuery = '';

// View Switcher
function switchView(viewId, param) {
    currentView = viewId;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('view-' + viewId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'detail' && param) {
        renderProductDetail(param);
    }
    renderAll();
}

// Render functions
function renderAll() {
    renderHomeCategories();
    renderFeaturedProducts();
    applyFilters();
    renderCart();
    renderWishlist();
    updateCartBadge();
}

// Render Home Categories
function renderHomeCategories() {
    const container = document.getElementById('homeCategoriesGrid');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <div onclick="filterByCategoryFromHome('${cat.name}')" class="group relative rounded-xl overflow-hidden shadow-sm cursor-pointer h-48 bg-gray-900">
            <img src="${cat.image}" class="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-300">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 class="font-bold text-lg">${cat.name}</h3>
                <p class="text-xs text-gray-300">${cat.count}</p>
            </div>
        </div>
    `).join('');
}

function filterByCategoryFromHome(categoryName) {
    switchView('shop');
    const radios = document.querySelectorAll('input[name="categoryFilter"]');
    radios.forEach(r => {
        if (r.value === categoryName) r.checked = true;
    });
    applyFilters();
}

// Render Featured Products
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProductsGrid');
    if (!container) return;
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(p => generateProductCard(p)).join('');
}

// Generate Product Card
function generateProductCard(p) {
    const isWishlisted = wishlist.includes(p.id);
    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
            <div class="relative h-48 overflow-hidden bg-gray-100 cursor-pointer" onclick="switchView('detail', ${p.id})">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                <button onclick="event.stopPropagation(); toggleWishlist(${p.id})" class="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full text-gray-700 hover:text-red-500 transition">
                    <i class="fa-${isWishlisted ? 'solid text-red-500' : 'regular'} fa-heart"></i>
                </button>
                <span class="absolute bottom-3 left-3 bg-forest text-white text-xs px-2.5 py-1 rounded-md font-semibold">${p.category}</span>
            </div>
            <div class="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <h4 onclick="switchView('detail', ${p.id})" class="font-bold text-gray-900 cursor-pointer hover:text-forest transition line-clamp-1">${p.name}</h4>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">${p.desc}</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-lg font-extrabold text-forest">${formatPrice(p.price)}</span>
                    <button onclick="addToCart(${p.id})" class="bg-forest hover:bg-forest-dark text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Filter and Search System
function handleSearch(query) {
    searchQuery = query.toLowerCase();
    if (currentView !== 'shop') {
        switchView('shop');
    } else {
        applyFilters();
    }
}

function applyFilters() {
    const selectedCatElem = document.querySelector('input[name="categoryFilter"]:checked');
    const selectedCategory = selectedCatElem ? selectedCatElem.value : 'All';
    const maxPrice = Number(document.getElementById('priceRange').value);
    const sortBy = document.getElementById('sortBy').value;

    document.getElementById('priceVal').innerText = formatPrice(maxPrice);

    let filtered = products.filter(p => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchPrice = p.price <= maxPrice;
        const matchSearch = p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
        return matchCat && matchPrice && matchSearch;
    });

    if (sortBy === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    const container = document.getElementById('shopProductsGrid');
    const countLabel = document.getElementById('productCountLabel');
    if (!container) return;

    countLabel.innerText = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500"><i class="fa-solid fa-box-open text-4xl mb-2 text-gray-300"></i><p>No products found matching your search or filters.</p></div>`;
        return;
    }

    container.innerHTML = filtered.map(p => generateProductCard(p)).join('');
}

function resetFilters() {
    document.querySelector('input[name="categoryFilter"][value="All"]').checked = true;
    document.getElementById('priceRange').value = 25000;
    document.getElementById('sortBy').value = 'default';
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('mobileSearchInput').value = '';
    applyFilters();
}

// Product Details
function renderProductDetail(productId) {
    const p = products.find(prod => prod.id === productId);
    const container = document.getElementById('productDetailContent');
    if (!p || !container) return;

    const isWishlisted = wishlist.includes(p.id);

    container.innerHTML = `
        <div class="rounded-xl overflow-hidden bg-gray-100 h-96 relative">
            <img src="${p.image}" class="w-full h-full object-cover">
            <button onclick="toggleWishlist(${p.id}); renderProductDetail(${p.id});" class="absolute top-4 right-4 bg-white/90 p-3 rounded-full text-gray-700 hover:text-red-500 shadow transition">
                <i class="fa-${isWishlisted ? 'solid text-red-500' : 'regular'} fa-heart text-lg"></i>
            </button>
        </div>
        <div class="flex flex-col justify-between">
            <div>
                <span class="bg-forest-light text-forest text-xs font-bold px-3 py-1 rounded-full">${p.category}</span>
                <h1 class="text-3xl font-extrabold text-gray-900 mt-2">${p.name}</h1>
                <div class="text-2xl font-bold text-forest mt-2">${formatPrice(p.price)}</div>
                <p class="text-gray-600 mt-4 leading-relaxed">${p.desc}</p>
                
                <div class="mt-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Select Variant / Option:</label>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 border rounded-lg text-sm font-medium border-forest bg-forest-light text-forest">Standard</button>
                        <button class="px-4 py-2 border rounded-lg text-sm font-medium hover:border-forest">Pro Series</button>
                    </div>
                </div>
            </div>
            <div class="mt-8 flex gap-4">
                <button onclick="addToCart(${p.id})" class="flex-1 bg-forest hover:bg-forest-dark text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
                <button onclick="switchView('cart')" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3.5 rounded-xl transition">View Cart</button>
            </div>
        </div>
    `;
}

// Cart Actions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartBadge();
    renderCart();
    showToast(`${product.name} added to cart!`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartBadge').innerText = totalQty;
}

function renderCart() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white p-12 rounded-2xl shadow-sm border text-center">
                <i class="fa-solid fa-cart-shopping text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800">Your cart is empty</h3>
                <p class="text-gray-500 mt-2 mb-6">Explore our sports equipment and add items to your cart.</p>
                <button onclick="switchView('shop')" class="bg-forest text-white font-bold px-6 py-3 rounded-xl hover:bg-forest-dark transition">Start Shopping</button>
            </div>
        `;
        return;
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    container.innerHTML = `
        <div class="lg:col-span-2 space-y-4">
            ${cart.map(item => `
                <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between gap-4">
                    <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-900">${item.name}</h4>
                        <p class="text-sm text-forest font-semibold mt-1">${formatPrice(item.price)}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center">-</button>
                        <span class="font-bold w-6 text-center">${item.qty}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center">+</button>
                    </div>
                    <div class="text-right font-bold text-gray-900 w-24">
                        ${formatPrice(item.price * item.qty)}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border h-fit">
            <h3 class="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Order Summary</h3>
            <div class="flex justify-between text-sm mb-2"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <div class="flex justify-between text-sm mb-4"><span>Delivery</span><span class="text-forest font-semibold">FREE</span></div>
            <div class="flex justify-between text-lg font-bold border-t pt-3 mb-6"><span>Total Amount</span><span class="text-forest">${formatPrice(subtotal)}</span></div>
            <button onclick="proceedToCheckout(${subtotal})" class="w-full bg-forest hover:bg-forest-dark text-white font-bold py-3.5 rounded-xl shadow transition">Proceed to Checkout</button>
        </div>
    `;
}

function proceedToCheckout(subtotal) {
    if (cart.length === 0) return;
    document.getElementById('checkoutSubtotal').innerText = formatPrice(subtotal);
    document.getElementById('checkoutTotal').innerText = formatPrice(subtotal);
    switchView('checkout');
}

// Wishlist System
function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }
    renderAll();
}

function renderWishlist() {
    const container = document.getElementById('wishlistContainer');
    const countLabel = document.getElementById('wishlistCount');
    if (!container || !countLabel) return;

    countLabel.innerText = wishlist.length;
    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

    if (wishlistedProducts.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500">Your wishlist is currently empty.</p>`;
        return;
    }

    container.innerHTML = wishlistedProducts.map(p => `
        <div class="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
            <div class="flex items-center gap-3">
                <img src="${p.image}" class="w-14 h-14 object-cover rounded-lg">
                <div>
                    <h4 class="font-bold text-sm text-gray-900">${p.name}</h4>
                    <p class="text-xs text-forest font-semibold">${formatPrice(p.price)}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="addToCart(${p.id})" class="bg-forest text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-forest-dark transition">Add to Cart</button>
                <button onclick="toggleWishlist(${p.id})" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Form Event Handlers & Toast Notification
function handleCheckoutSubmit(e) {
    e.preventDefault();
    showToast('Order placed successfully! Thank you for shopping with SportGear.');
    cart = [];
    updateCartBadge();
    switchView('home');
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('Thank you for contacting us! Our team will get back to you shortly.');
    e.target.reset();
    switchView('home');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-forest text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition transform duration-300 font-medium text-sm flex items-center gap-2';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize application on page load
renderAll();