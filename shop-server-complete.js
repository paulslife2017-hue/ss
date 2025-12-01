import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { products as importedProducts } from './products.js';

const app = new Hono();

// In-memory storage (replace with database later)
let products = [...importedProducts]; // Make mutable copy for admin editing
let orders = [];
let orderIdCounter = 1;
let productIdCounter = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

// Simple admin password (change in production!)
const ADMIN_PASSWORD = '0907';

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// ==========================================
// API ROUTES
// ==========================================

// Get all products
app.get('/api/products', (c) => {
  const category = c.req.query('category');
  const featured = c.req.query('featured');
  const search = c.req.query('search');
  
  let filtered = products;
  
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (featured === 'true') {
    filtered = filtered.filter(p => p.featured);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  return c.json(filtered);
});

// Get single product
app.get('/api/products/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }
  
  return c.json(product);
});

// Create order
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    
    const order = {
      id: `ORDER-${String(orderIdCounter++).padStart(5, '0')}`,
      date: new Date().toISOString(),
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping || 10.00,
      total: body.total,
      status: 'pending',
      paymentStatus: 'pending'
    };
    
    orders.push(order);
    
    return c.json({ success: true, order });
  } catch (error) {
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', (c) => {
  const password = c.req.query('password');
  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return c.json(orders.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// Update order status (admin)
app.patch('/api/admin/orders/:id', async (c) => {
  try {
    const password = c.req.query('password');
    if (password !== ADMIN_PASSWORD) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const order = orders.find(o => o.id === id);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    if (body.status) order.status = body.status;
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    
    return c.json({ success: true, order });
  } catch (error) {
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// Get stats (admin)
app.get('/api/admin/stats', (c) => {
  const password = c.req.query('password');
  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  
  return c.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    totalProducts,
    lowStockProducts,
    recentOrders: orders.slice(-5).reverse()
  });
});

// Get all products (admin)
app.get('/api/admin/products', (c) => {
  const password = c.req.query('password');
  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return c.json(products);
});

// Add new product (admin)
app.post('/api/admin/products', async (c) => {
  try {
    const password = c.req.query('password');
    if (password !== ADMIN_PASSWORD) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    
    const newProduct = {
      id: productIdCounter++,
      name: body.name,
      brand: body.brand,
      category: body.category,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      image: body.image,
      images: body.images || [body.image],
      description: body.description,
      keyBenefits: body.keyBenefits || [],
      howToUse: body.howToUse || '',
      ingredients: body.ingredients || '',
      inStock: body.inStock !== false,
      stock: parseInt(body.stock) || 100,
      rating: parseFloat(body.rating) || 4.5,
      reviews: parseInt(body.reviews) || 0,
      tags: body.tags || [],
      featured: body.featured || false
    };
    
    products.push(newProduct);
    
    return c.json({ success: true, product: newProduct });
  } catch (error) {
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product (admin)
app.patch('/api/admin/products/:id', async (c) => {
  try {
    const password = c.req.query('password');
    if (password !== ADMIN_PASSWORD) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    // Update product fields
    const product = products[productIndex];
    if (body.name) product.name = body.name;
    if (body.brand) product.brand = body.brand;
    if (body.category) product.category = body.category;
    if (body.price) product.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) product.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    if (body.image) product.image = body.image;
    if (body.description) product.description = body.description;
    if (body.stock !== undefined) product.stock = parseInt(body.stock);
    if (body.inStock !== undefined) product.inStock = body.inStock;
    if (body.featured !== undefined) product.featured = body.featured;
    
    return c.json({ success: true, product });
  } catch (error) {
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:id', (c) => {
  const password = c.req.query('password');
  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const id = parseInt(c.req.param('id'));
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return c.json({ error: 'Product not found' }, 404);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  return c.json({ success: true, product: deletedProduct });
});

// ==========================================
// HTML PAGES
// ==========================================

// Homepage
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoulZen - Authentic Korean Beauty Products</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        
        /* Navigation */
        .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar .container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand a { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; text-decoration: none; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
        .nav-links a:hover { color: #FF6B9D; }
        .nav-actions { display: flex; gap: 1.5rem; align-items: center; }
        .cart-icon { background: #FF6B9D; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-weight: 600; }
        .cart-count { background: white; color: #FF6B9D; padding: 0.2rem 0.5rem; border-radius: 10px; margin-left: 0.5rem; }
        .admin-link { color: #666; font-size: 0.9rem; text-decoration: none; }
        
        /* Hero Section */
        .hero { background: linear-gradient(135deg, #FFF5F7 0%, #FFE8EE 100%); padding: 5rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; color: #333; margin-bottom: 1rem; }
        .hero p { font-size: 1.3rem; color: #666; margin-bottom: 2rem; }
        
        /* Buttons */
        .btn { display: inline-block; padding: 0.8rem 2rem; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-primary { background: #FF6B9D; color: white; }
        .btn-primary:hover { background: #FF4081; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,107,157,0.3); }
        .btn-secondary { background: white; color: #FF6B9D; border: 2px solid #FF6B9D; }
        .btn-secondary:hover { background: #FF6B9D; color: white; }
        
        /* Sections */
        .container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        section h2 { text-align: center; font-size: 2rem; margin-bottom: 2rem; color: #333; }
        
        /* Product Grid */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .product-card img { width: 100%; height: 280px; object-fit: cover; }
        .product-info { padding: 1.5rem; }
        .product-brand { color: #999; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .product-name { color: #333; font-size: 1.1rem; margin: 0.5rem 0; font-weight: 600; }
        .product-rating { color: #FFA726; font-size: 0.9rem; margin: 0.5rem 0; }
        .product-price { font-size: 1.3rem; font-weight: bold; color: #FF6B9D; margin: 1rem 0; }
        .original-price { text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 0.5rem; }
        .product-card a { text-decoration: none; }
        .btn-add-cart { width: 100%; margin-top: 0.5rem; }
        
        /* Categories */
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .category-card { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; color: #333; transition: all 0.3s; }
        .category-card:hover { transform: translateY(-3px); box-shadow: 0 4px 16px rgba(255,107,157,0.2); }
        .category-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .category-card h3 { font-size: 1.1rem; }
        
        /* Features */
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .feature-card { text-align: center; padding: 2rem; }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-card h3 { color: #333; margin-bottom: 0.5rem; }
        .feature-card p { color: #666; }
        
        /* Footer */
        .footer { background: #333; color: white; text-align: center; padding: 2rem; }
        .footer-links { margin-top: 1rem; display: flex; justify-content: center; gap: 2rem; }
        .footer-links a { color: white; text-decoration: none; }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/" id="brand-logo" style="cursor: pointer;">🌸 SeoulZen</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
                <a href="https://www.seoulzen.com">Blog</a>
            </div>
            <div class="nav-actions">
                <a href="/cart" class="cart-icon">
                    🛒 Cart <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>✨ Authentic Korean Beauty</h1>
            <p>Direct from Seoul • Worldwide Shipping $10</p>
            <a href="/shop" class="btn btn-primary">Shop Now</a>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
        <div class="container">
            <h2>🔥 Bestsellers</h2>
            <div id="featured-grid" class="product-grid">
                <!-- Loaded by JavaScript -->
            </div>
        </div>
    </section>

    <!-- Categories -->
    <section class="categories">
        <div class="container">
            <h2>Shop by Category</h2>
            <div class="category-grid">
                <a href="/shop?category=cleanser" class="category-card">
                    <span class="category-icon">🧼</span>
                    <h3>Cleansers</h3>
                </a>
                <a href="/shop?category=toner" class="category-card">
                    <span class="category-icon">💧</span>
                    <h3>Toners</h3>
                </a>
                <a href="/shop?category=serum" class="category-card">
                    <span class="category-icon">✨</span>
                    <h3>Serums</h3>
                </a>
                <a href="/shop?category=moisturizer" class="category-card">
                    <span class="category-icon">🌙</span>
                    <h3>Moisturizers</h3>
                </a>
                <a href="/shop?category=sunscreen" class="category-card">
                    <span class="category-icon">☀️</span>
                    <h3>Sunscreen</h3>
                </a>
                <a href="/shop?category=set" class="category-card">
                    <span class="category-icon">🎁</span>
                    <h3>Sets</h3>
                </a>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="features">
        <div class="container">
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🌍</div>
                    <h3>Worldwide Shipping</h3>
                    <p>Flat rate $10 to all countries</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">✅</div>
                    <h3>100% Authentic</h3>
                    <p>Direct from Korean brands</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📦</div>
                    <h3>Fast Delivery</h3>
                    <p>7-14 days tracked shipping</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 SeoulZen. All rights reserved.</p>
            <div class="footer-links">
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/contact">Contact</a>
            </div>
        </div>
    </footer>

    <script>
        // Load featured products
        async function loadFeaturedProducts() {
            try {
                const response = await fetch('/api/products?featured=true');
                const products = await response.json();
                
                const grid = document.getElementById('featured-grid');
                grid.innerHTML = products.slice(0, 6).map(product => \`
                    <div class="product-card">
                        <a href="/product/\${product.id}">
                            <img src="\${product.image}" alt="\${product.name}">
                            <div class="product-info">
                                <p class="product-brand">\${product.brand}</p>
                                <h3 class="product-name">\${product.name}</h3>
                                <div class="product-rating">
                                    ⭐ \${product.rating} (\${product.reviews.toLocaleString()})
                                </div>
                                <div class="product-price">
                                    $\${product.price}
                                    \${product.originalPrice ? \`<span class="original-price">$\${product.originalPrice}</span>\` : ''}
                                </div>
                            </div>
                        </a>
                        <div class="product-info">
                            <button class="btn btn-secondary btn-add-cart" onclick="addToCart(\${product.id}, event)">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        }

        // Add to cart
        function addToCart(productId, event) {
            event.preventDefault();
            event.stopPropagation();
            
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.id === productId);
            
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            alert('✅ Added to cart!');
        }

        // Update cart count
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
        }

        // Initialize
        loadFeaturedProducts();
        updateCartCount();
        
        // Secret admin access: triple-click logo within 2 seconds
        let logoClickCount = 0;
        let logoClickTimer = null;
        document.getElementById('brand-logo').addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            
            if (logoClickTimer) clearTimeout(logoClickTimer);
            
            if (logoClickCount === 3) {
                window.location.href = '/admin';
                logoClickCount = 0;
            } else {
                logoClickTimer = setTimeout(() => {
                    if (logoClickCount < 3) {
                        window.location.href = '/';
                    }
                    logoClickCount = 0;
                }, 2000); // 2 seconds
            }
        });
    </script>
</body>
</html>
  `);
});

// Shop page - ALL PRODUCTS with filtering
app.get('/shop', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop All Products - SeoulZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; }
        
        /* Navigation (same as homepage) */
        .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar .container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand a { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; text-decoration: none; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
        .cart-icon { background: #FF6B9D; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-weight: 600; }
        .cart-count { background: white; color: #FF6B9D; padding: 0.2rem 0.5rem; border-radius: 10px; margin-left: 0.5rem; }
        
        /* Shop Layout */
        .shop-container { max-width: 1400px; margin: 2rem auto; padding: 0 2rem; display: flex; gap: 2rem; }
        .shop-sidebar { width: 250px; background: white; padding: 1.5rem; border-radius: 12px; height: fit-content; }
        .shop-main { flex: 1; }
        .shop-header { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
        .shop-header h1 { font-size: 1.8rem; color: #333; }
        
        /* Filters */
        .shop-sidebar h3 { margin-bottom: 1rem; font-size: 1.1rem; color: #333; }
        .filter-group { margin-bottom: 2rem; }
        .filter-item { display: flex; align-items: center; padding: 0.5rem 0; cursor: pointer; }
        .filter-item input { margin-right: 0.5rem; }
        .filter-item:hover { color: #FF6B9D; }
        
        /* Sorting */
        select { padding: 0.5rem 1rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; cursor: pointer; }
        
        /* Product Grid */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .product-card:hover { transform: translateY(-5px); }
        .product-card img { width: 100%; height: 280px; object-fit: cover; }
        .product-info { padding: 1.5rem; }
        .product-brand { color: #999; font-size: 0.85rem; text-transform: uppercase; }
        .product-name { color: #333; font-size: 1.1rem; margin: 0.5rem 0; font-weight: 600; }
        .product-rating { color: #FFA726; font-size: 0.9rem; margin: 0.5rem 0; }
        .product-price { font-size: 1.3rem; font-weight: bold; color: #FF6B9D; margin: 1rem 0; }
        .original-price { text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 0.5rem; }
        .product-card a { text-decoration: none; }
        .btn { padding: 0.8rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; }
        .btn-secondary { background: #FF6B9D; color: white; }
        .btn-secondary:hover { background: #FF4081; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">🌸 SeoulZen</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
                <a href="https://www.seoulzen.com">Blog</a>
            </div>
            <div class="nav-actions">
                <a href="/cart" class="cart-icon">
                    🛒 Cart <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </nav>

    <div class="shop-container">
        <aside class="shop-sidebar">
            <div class="filter-group">
                <h3>Categories</h3>
                <label class="filter-item">
                    <input type="radio" name="category" value="all" checked> All Products
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="cleanser"> Cleansers
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="toner"> Toners
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="serum"> Serums
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="moisturizer"> Moisturizers
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="sunscreen"> Sunscreen
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="mask"> Masks
                </label>
                <label class="filter-item">
                    <input type="radio" name="category" value="set"> Sets
                </label>
            </div>
        </aside>

        <main class="shop-main">
            <div class="shop-header">
                <h1>All Products (<span id="product-count">0</span>)</h1>
                <select id="sort-select">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>

            <div id="products-grid" class="product-grid">
                <!-- Loaded by JS -->
            </div>
        </main>
    </div>

    <script>
        let allProducts = [];
        
        async function loadProducts() {
            try {
                const params = new URLSearchParams(window.location.search);
                const category = params.get('category') || 'all';
                
                const url = category !== 'all' ? \`/api/products?category=\${category}\` : '/api/products';
                const response = await fetch(url);
                allProducts = await response.json();
                
                if (category !== 'all') {
                    document.querySelector(\`input[value="\${category}"]\`).checked = true;
                }
                
                renderProducts(allProducts);
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        }
        
        function renderProducts(products) {
            document.getElementById('product-count').textContent = products.length;
            
            const grid = document.getElementById('products-grid');
            grid.innerHTML = products.map(product => \`
                <div class="product-card">
                    <a href="/product/\${product.id}">
                        <img src="\${product.image}" alt="\${product.name}">
                        <div class="product-info">
                            <p class="product-brand">\${product.brand}</p>
                            <h3 class="product-name">\${product.name}</h3>
                            <div class="product-rating">
                                ⭐ \${product.rating} (\${product.reviews.toLocaleString()})
                            </div>
                            <div class="product-price">
                                $\${product.price}
                                \${product.originalPrice ? \`<span class="original-price">$\${product.originalPrice}</span>\` : ''}
                            </div>
                        </div>
                    </a>
                    <div class="product-info">
                        <button class="btn btn-secondary" onclick="addToCart(\${product.id}, event)">
                            Add to Cart
                        </button>
                    </div>
                </div>
            \`).join('');
        }
        
        // Category filter
        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const category = e.target.value;
                if (category === 'all') {
                    window.location.href = '/shop';
                } else {
                    window.location.href = \`/shop?category=\${category}\`;
                }
            });
        });
        
        // Sorting
        document.getElementById('sort-select').addEventListener('change', (e) => {
            const sortBy = e.target.value;
            let sorted = [...allProducts];
            
            if (sortBy === 'price-low') {
                sorted.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-high') {
                sorted.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'rating') {
                sorted.sort((a, b) => b.rating - a.rating);
            }
            
            renderProducts(sorted);
        });
        
        function addToCart(productId, event) {
            event.preventDefault();
            event.stopPropagation();
            
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.id === productId);
            
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('✅ Added to cart!');
        }
        
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
        }
        
        loadProducts();
        updateCartCount();
    </script>
</body>
</html>
  `);
});

// Product Detail Page
app.get('/product/:id', (c) => {
  const id = c.req.param('id');
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product - SeoulZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; }
        
        .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar .container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand a { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; text-decoration: none; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
        .cart-icon { background: #FF6B9D; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-weight: 600; }
        .cart-count { background: white; color: #FF6B9D; padding: 0.2rem 0.5rem; border-radius: 10px; margin-left: 0.5rem; }
        
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; background: white; padding: 3rem; border-radius: 12px; }
        .product-images img { width: 100%; border-radius: 12px; }
        .product-brand { color: #999; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .product-detail h1 { font-size: 2rem; color: #333; margin: 0.5rem 0 1rem; }
        .product-rating { color: #FFA726; font-size: 1rem; margin-bottom: 1rem; }
        .product-price-detail { margin: 1.5rem 0; }
        .price { font-size: 2.5rem; font-weight: bold; color: #FF6B9D; }
        .original-price { text-decoration: line-through; color: #999; font-size: 1.5rem; margin-left: 1rem; }
        .discount { background: #FFE8EE; color: #FF6B9D; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem; margin-left: 1rem; }
        .product-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }
        .tag { background: #f0f0f0; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #666; }
        .product-actions { display: flex; gap: 1rem; margin: 2rem 0; }
        .quantity-selector { display: flex; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; }
        .quantity-selector button { padding: 0.8rem 1.2rem; border: none; background: white; cursor: pointer; font-size: 1.2rem; }
        .quantity-selector button:hover { background: #f0f0f0; }
        .quantity-selector input { width: 60px; text-align: center; border: none; font-size: 1.1rem; }
        .btn-large { flex: 1; padding: 1rem 2rem; background: #FF6B9D; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
        .btn-large:hover { background: #FF4081; }
        .product-description { margin-top: 2rem; }
        .product-description h3 { margin: 1.5rem 0 1rem; color: #333; }
        .product-description ul { margin-left: 1.5rem; line-height: 1.8; }
        .shipping-info { background: #FFF5F7; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; }
        .shipping-info p { margin: 0.5rem 0; color: #666; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">🌸 SeoulZen</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
            </div>
            <div class="nav-actions">
                <a href="/cart" class="cart-icon">
                    🛒 Cart <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div id="product-detail" class="product-detail">
            <!-- Loaded by JS -->
        </div>
    </div>

    <script>
        const productId = ${id};
        
        async function loadProduct() {
            try {
                const response = await fetch(\`/api/products/\${productId}\`);
                const product = await response.json();
                
                document.getElementById('product-detail').innerHTML = \`
                    <div class="product-images">
                        <img src="\${product.image}" alt="\${product.name}">
                    </div>
                    <div>
                        <p class="product-brand">\${product.brand}</p>
                        <h1>\${product.name}</h1>
                        <div class="product-rating">
                            ⭐ \${product.rating} (\${product.reviews.toLocaleString()} reviews)
                        </div>
                        <div class="product-price-detail">
                            <span class="price">$\${product.price}</span>
                            \${product.originalPrice ? \`<span class="original-price">$\${product.originalPrice}</span>\` : ''}
                            \${product.originalPrice ? \`<span class="discount">Save $\${(product.originalPrice - product.price).toFixed(2)}</span>\` : ''}
                        </div>
                        
                        <div class="product-tags">
                            \${product.tags.map(tag => \`<span class="tag">\${tag}</span>\`).join('')}
                        </div>
                        
                        <div class="product-actions">
                            <div class="quantity-selector">
                                <button onclick="decreaseQty()">-</button>
                                <input type="number" id="quantity" value="1" min="1" readonly>
                                <button onclick="increaseQty()">+</button>
                            </div>
                            <button class="btn-large" onclick="addToCart()">
                                Add to Cart - $\${product.price}
                            </button>
                        </div>
                        
                        <div class="product-description">
                            <h3>Description</h3>
                            <p>\${product.description}</p>
                            
                            <h3>Key Benefits</h3>
                            <ul>
                                \${product.keyBenefits.map(benefit => \`<li>\${benefit}</li>\`).join('')}
                            </ul>
                            
                            <h3>How to Use</h3>
                            <p>\${product.howToUse}</p>
                            
                            <h3>Ingredients</h3>
                            <p style="font-size: 0.9rem; color: #666;">\${product.ingredients}</p>
                        </div>
                        
                        <div class="shipping-info">
                            <p>🌍 <strong>Worldwide Shipping:</strong> $10 flat rate</p>
                            <p>📦 <strong>Delivery:</strong> 7-14 business days</p>
                            <p>✅ <strong>100% Authentic</strong> guaranteed</p>
                        </div>
                    </div>
                \`;
                
                document.title = \`\${product.name} - SeoulZen\`;
            } catch (error) {
                console.error('Failed to load product:', error);
            }
        }
        
        function increaseQty() {
            const input = document.getElementById('quantity');
            input.value = parseInt(input.value) + 1;
        }
        
        function decreaseQty() {
            const input = document.getElementById('quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }
        
        function addToCart() {
            const quantity = parseInt(document.getElementById('quantity').value);
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.id === productId);
            
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({ id: productId, quantity });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(\`✅ Added \${quantity} item(s) to cart!\`);
            updateCartCount();
        }
        
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
        }
        
        loadProduct();
        updateCartCount();
    </script>
</body>
</html>
  `);
});

// CART PAGE - 장바구니
app.get('/cart', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - SeoulZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; }
        
        .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar .container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand a { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; text-decoration: none; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
        .cart-icon { background: #FF6B9D; color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-weight: 600; }
        
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        h1 { margin-bottom: 2rem; color: #333; }
        
        .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        
        .cart-items { background: white; padding: 2rem; border-radius: 12px; }
        .cart-item { display: flex; gap: 1.5rem; padding: 1.5rem; border-bottom: 1px solid #eee; }
        .cart-item:last-child { border-bottom: none; }
        .cart-item img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; }
        .item-info { flex: 1; }
        .item-brand { color: #999; font-size: 0.85rem; text-transform: uppercase; }
        .item-name { font-size: 1.1rem; font-weight: 600; color: #333; margin: 0.5rem 0; }
        .item-price { font-size: 1.3rem; color: #FF6B9D; font-weight: bold; margin: 0.5rem 0; }
        .item-actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
        .quantity-selector { display: flex; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; }
        .quantity-selector button { padding: 0.5rem 1rem; border: none; background: white; cursor: pointer; }
        .quantity-selector button:hover { background: #f0f0f0; }
        .quantity-selector input { width: 50px; text-align: center; border: none; }
        .btn-remove { color: #FF6B9D; background: none; border: none; cursor: pointer; text-decoration: underline; }
        
        .cart-summary { background: white; padding: 2rem; border-radius: 12px; height: fit-content; }
        .summary-row { display: flex; justify-content: space-between; margin: 1rem 0; }
        .summary-row.total { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; border-top: 2px solid #eee; padding-top: 1rem; margin-top: 1.5rem; }
        .btn-checkout { width: 100%; padding: 1rem; background: #FF6B9D; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
        .btn-checkout:hover { background: #FF4081; }
        .btn-continue { width: 100%; padding: 1rem; background: white; color: #FF6B9D; border: 2px solid #FF6B9D; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 0.5rem; text-decoration: none; display: block; text-align: center; }
        
        .empty-cart { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; }
        .empty-cart-icon { font-size: 5rem; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">🌸 SeoulZen</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1>🛒 Shopping Cart</h1>
        
        <div id="cart-content">
            <!-- Loaded by JS -->
        </div>
    </div>

    <script>
        async function loadCart() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (cart.length === 0) {
                document.getElementById('cart-content').innerHTML = \`
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p style="margin: 1rem 0; color: #666;">Add some amazing K-Beauty products!</p>
                        <a href="/shop" class="btn-checkout">Start Shopping</a>
                    </div>
                \`;
                return;
            }
            
            // Load product details for cart items
            const productPromises = cart.map(item => 
                fetch(\`/api/products/\${item.id}\`).then(r => r.json())
            );
            const products = await Promise.all(productPromises);
            
            // Calculate totals
            const subtotal = cart.reduce((sum, item, index) => {
                return sum + (products[index].price * item.quantity);
            }, 0);
            const shipping = 10.00;
            const total = subtotal + shipping;
            
            document.getElementById('cart-content').innerHTML = \`
                <div class="cart-layout">
                    <div class="cart-items">
                        \${cart.map((item, index) => {
                            const product = products[index];
                            return \`
                                <div class="cart-item">
                                    <img src="\${product.image}" alt="\${product.name}">
                                    <div class="item-info">
                                        <p class="item-brand">\${product.brand}</p>
                                        <h3 class="item-name">\${product.name}</h3>
                                        <p class="item-price">$\${product.price}</p>
                                        <div class="item-actions">
                                            <div class="quantity-selector">
                                                <button onclick="updateQuantity(\${product.id}, -1)">-</button>
                                                <input type="number" value="\${item.quantity}" min="1" readonly>
                                                <button onclick="updateQuantity(\${product.id}, 1)">+</button>
                                            </div>
                                            <button class="btn-remove" onclick="removeFromCart(\${product.id})">Remove</button>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <p style="font-size: 1.3rem; font-weight: bold; color: #FF6B9D;">
                                            $\${(product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                    
                    <div class="cart-summary">
                        <h2>Order Summary</h2>
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>$\${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping</span>
                            <span>$\${shipping.toFixed(2)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span>$\${total.toFixed(2)}</span>
                        </div>
                        <button class="btn-checkout" onclick="window.location.href='/checkout'">
                            Proceed to Checkout
                        </button>
                        <a href="/shop" class="btn-continue">Continue Shopping</a>
                    </div>
                </div>
            \`;
        }
        
        function updateQuantity(productId, change) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const item = cart.find(i => i.id === productId);
            
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== productId);
                }
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
        
        function removeFromCart(productId) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart = cart.filter(i => i.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
        
        loadCart();
    </script>
</body>
</html>
  `);
});

// CHECKOUT PAGE - 결제
app.get('/checkout', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - SeoulZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; }
        
        .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navbar .container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand a { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; text-decoration: none; }
        
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        h1 { margin-bottom: 2rem; color: #333; }
        
        .checkout-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        
        .checkout-form { background: white; padding: 2rem; border-radius: 12px; }
        .form-section { margin-bottom: 2rem; }
        .form-section h2 { margin-bottom: 1rem; color: #333; font-size: 1.3rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: #666; font-weight: 500; }
        .form-group input, .form-group select { width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .order-summary { background: white; padding: 2rem; border-radius: 12px; height: fit-content; }
        .summary-item { display: flex; justify-content: space-between; margin: 1rem 0; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
        .summary-row { display: flex; justify-content: space-between; margin: 1rem 0; }
        .summary-row.total { font-size: 1.5rem; font-weight: bold; color: #FF6B9D; border-top: 2px solid #eee; padding-top: 1rem; margin-top: 1.5rem; }
        
        .btn-place-order { width: 100%; padding: 1rem; background: #FF6B9D; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
        .btn-place-order:hover { background: #FF4081; }
        .btn-place-order:disabled { background: #ccc; cursor: not-allowed; }
        
        .payment-info { background: #FFF5F7; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
        .payment-info p { color: #666; font-size: 0.9rem; margin: 0.3rem 0; }
        
        .success-message { background: #4CAF50; color: white; padding: 2rem; border-radius: 12px; text-align: center; }
        .success-message h2 { margin-bottom: 1rem; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">🌸 SeoulZen</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1>💳 Checkout</h1>
        
        <div id="checkout-content">
            <!-- Loaded by JS -->
        </div>
    </div>

    <script>
        async function loadCheckout() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (cart.length === 0) {
                window.location.href = '/cart';
                return;
            }
            
            // Load product details
            const productPromises = cart.map(item => 
                fetch(\`/api/products/\${item.id}\`).then(r => r.json())
            );
            const products = await Promise.all(productPromises);
            
            // Calculate totals
            const subtotal = cart.reduce((sum, item, index) => {
                return sum + (products[index].price * item.quantity);
            }, 0);
            const shipping = 10.00;
            const total = subtotal + shipping;
            
            document.getElementById('checkout-content').innerHTML = \`
                <div class="checkout-layout">
                    <div class="checkout-form">
                        <form id="checkout-form" onsubmit="placeOrder(event)">
                            <div class="form-section">
                                <h2>📧 Contact Information</h2>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" name="email" required>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h2>📦 Shipping Address</h2>
                                <div class="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="fullName" required>
                                </div>
                                <div class="form-group">
                                    <label>Address Line 1 *</label>
                                    <input type="text" name="address1" required>
                                </div>
                                <div class="form-group">
                                    <label>Address Line 2</label>
                                    <input type="text" name="address2">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>City *</label>
                                        <input type="text" name="city" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Postal Code *</label>
                                        <input type="text" name="postalCode" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>State/Province</label>
                                        <input type="text" name="state">
                                    </div>
                                    <div class="form-group">
                                        <label>Country *</label>
                                        <select name="country" required>
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="JP">Japan</option>
                                            <option value="KR">South Korea</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" name="phone" required>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h2>💳 Payment Method</h2>
                                <div class="payment-info">
                                    <p><strong>Demo Mode:</strong> No real payment processing</p>
                                    <p>In production, integrate Stripe or PayPal here</p>
                                    <p>Your order will be placed as "Pending Payment"</p>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-place-order" id="place-order-btn">
                                Place Order - $\${total.toFixed(2)}
                            </button>
                        </form>
                    </div>
                    
                    <div class="order-summary">
                        <h2>Order Summary</h2>
                        \${cart.map((item, index) => {
                            const product = products[index];
                            return \`
                                <div class="summary-item">
                                    <div>
                                        <p style="font-weight: 600;">\${product.name}</p>
                                        <p style="color: #999; font-size: 0.9rem;">Qty: \${item.quantity}</p>
                                    </div>
                                    <p style="font-weight: 600; color: #FF6B9D;">
                                        $\${(product.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            \`;
                        }).join('')}
                        
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>$\${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping</span>
                            <span>$\${shipping.toFixed(2)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span>$\${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        async function placeOrder(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const productPromises = cart.map(item => 
                fetch(\`/api/products/\${item.id}\`).then(r => r.json())
            );
            const products = await Promise.all(productPromises);
            
            const subtotal = cart.reduce((sum, item, index) => {
                return sum + (products[index].price * item.quantity);
            }, 0);
            const shipping = 10.00;
            const total = subtotal + shipping;
            
            const orderData = {
                customer: {
                    email: formData.get('email'),
                    fullName: formData.get('fullName'),
                    address1: formData.get('address1'),
                    address2: formData.get('address2'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postalCode: formData.get('postalCode'),
                    country: formData.get('country'),
                    phone: formData.get('phone')
                },
                items: cart.map((item, index) => ({
                    productId: item.id,
                    name: products[index].name,
                    price: products[index].price,
                    quantity: item.quantity
                })),
                subtotal,
                shipping,
                total
            };
            
            document.getElementById('place-order-btn').disabled = true;
            document.getElementById('place-order-btn').textContent = 'Processing...';
            
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Clear cart
                    localStorage.removeItem('cart');
                    
                    // Show success message
                    document.getElementById('checkout-content').innerHTML = \`
                        <div class="success-message">
                            <h2>✅ Order Placed Successfully!</h2>
                            <p style="font-size: 1.2rem; margin: 1rem 0;">Order ID: \${result.order.id}</p>
                            <p>Thank you for your order! We'll send a confirmation email shortly.</p>
                            <p style="margin-top: 1rem;">
                                <a href="/" style="color: white; text-decoration: underline;">Return to Home</a>
                            </p>
                        </div>
                    \`;
                } else {
                    alert('Order failed. Please try again.');
                    document.getElementById('place-order-btn').disabled = false;
                    document.getElementById('place-order-btn').textContent = 'Place Order';
                }
            } catch (error) {
                console.error('Order error:', error);
                alert('Order failed. Please try again.');
                document.getElementById('place-order-btn').disabled = false;
                document.getElementById('place-order-btn').textContent = 'Place Order';
            }
        }
        
        loadCheckout();
    </script>
</body>
</html>
  `);
});

// ADMIN DASHBOARD - 관리자 대시보드
app.get('/admin', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - SeoulZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; }
        
        .admin-header { background: #333; color: white; padding: 1.5rem 2rem; }
        .admin-header h1 { font-size: 1.8rem; }
        
        .container { max-width: 1400px; margin: 2rem auto; padding: 0 2rem; }
        
        .login-form { max-width: 400px; margin: 5rem auto; background: white; padding: 3rem; border-radius: 12px; }
        .login-form h2 { margin-bottom: 1.5rem; color: #333; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: #666; font-weight: 500; }
        .form-group input { width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .btn { width: 100%; padding: 1rem; background: #FF6B9D; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
        .btn:hover { background: #FF4081; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .stat-card h3 { color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .stat-card .stat-value { font-size: 2.5rem; font-weight: bold; color: #FF6B9D; }
        
        .orders-section { background: white; padding: 2rem; border-radius: 12px; }
        .orders-section h2 { margin-bottom: 1.5rem; color: #333; }
        
        table { width: 100%; border-collapse: collapse; }
        th { background: #f0f0f0; padding: 1rem; text-align: left; font-weight: 600; color: #333; }
        td { padding: 1rem; border-bottom: 1px solid #eee; }
        .status-badge { padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; font-weight: 600; }
        .status-pending { background: #FFF3CD; color: #856404; }
        .status-completed { background: #D4EDDA; color: #155724; }
        .status-cancelled { background: #F8D7DA; color: #721C24; }
        
        .btn-small { padding: 0.4rem 0.8rem; background: #FF6B9D; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
        .btn-small:hover { background: #FF4081; }
    </style>
</head>
<body>
    <div id="admin-content">
        <!-- Login form initially -->
        <div class="login-form">
            <h2>🔐 Admin Login</h2>
            <form onsubmit="login(event)">
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="admin-password" placeholder="Enter admin password" required>
                </div>
                <button type="submit" class="btn">Login</button>
                <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                    Hint: Special date 🔐
                </p>
            </form>
        </div>
    </div>

    <script>
        let adminPassword = '';
        
        function login(event) {
            event.preventDefault();
            adminPassword = document.getElementById('admin-password').value;
            loadDashboard();
        }
        
        async function loadDashboard() {
            try {
                // Load stats
                const statsResponse = await fetch(\`/api/admin/stats?password=\${adminPassword}\`);
                if (!statsResponse.ok) {
                    alert('Invalid password');
                    return;
                }
                
                const stats = await statsResponse.json();
                
                // Load orders
                const ordersResponse = await fetch(\`/api/admin/orders?password=\${adminPassword}\`);
                const orders = await ordersResponse.json();
                
                document.getElementById('admin-content').innerHTML = \`
                    <div class="admin-header">
                        <h1>👑 Admin Dashboard</h1>
                        <p>Manage your SeoulZen shop</p>
                    </div>
                    
                    <div class="container">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h3>Total Orders</h3>
                                <div class="stat-value">\${stats.totalOrders}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Total Revenue</h3>
                                <div class="stat-value">$\${stats.totalRevenue.toFixed(2)}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Pending Orders</h3>
                                <div class="stat-value">\${stats.pendingOrders}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Completed Orders</h3>
                                <div class="stat-value">\${stats.completedOrders}</div>
                            </div>
                        </div>
                        
                        <div class="orders-section">
                            <h2>📦 Recent Orders</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${orders.map(order => \`
                                        <tr>
                                            <td><strong>\${order.id}</strong></td>
                                            <td>
                                                \${order.customer.fullName}<br>
                                                <small style="color: #999;">\${order.customer.email}</small>
                                            </td>
                                            <td>\${new Date(order.date).toLocaleDateString()}</td>
                                            <td><strong>$\${order.total.toFixed(2)}</strong></td>
                                            <td>
                                                <span class="status-badge status-\${order.status}">
                                                    \${order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <select onchange="updateOrderStatus('\${order.id}', this.value)" style="padding: 0.3rem; border-radius: 5px;">
                                                    <option value="">Change Status</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                \`;
            } catch (error) {
                console.error('Failed to load dashboard:', error);
                alert('Failed to load dashboard');
            }
        }
        
        async function updateOrderStatus(orderId, newStatus) {
            if (!newStatus) return;
            
            try {
                const response = await fetch(\`/api/admin/orders/\${orderId}?password=\${adminPassword}\`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    alert('Order status updated!');
                    loadDashboard();
                } else {
                    alert('Failed to update order status');
                }
            } catch (error) {
                console.error('Failed to update order:', error);
                alert('Failed to update order status');
            }
        }
    </script>
</body>
</html>
  `);
});

// Start server
const PORT = 3001;
console.log(`🚀 SeoulZen Shop Server starting on port ${PORT}...`);
console.log('📦 Complete E-commerce system ready!');
console.log('');
console.log('Available pages:');
console.log(`  🏠 Homepage:     http://localhost:${PORT}`);
console.log(`  🛍️  Shop:        http://localhost:${PORT}/shop`);
console.log(`  🛒 Cart:         http://localhost:${PORT}/cart`);
console.log(`  💳 Checkout:     http://localhost:${PORT}/checkout`);
console.log(`  👑 Admin:        http://localhost:${PORT}/admin (password: admin123)`);
console.log('');

serve({
  fetch: app.fetch,
  port: PORT,
});
