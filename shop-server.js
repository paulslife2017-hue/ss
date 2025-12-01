import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { products, categories, brands } from './products.js';

const app = new Hono();

// In-memory storage for orders (replace with database later)
let orders = [];
let orderIdCounter = 1;

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));
app.use('/shop/*', serveStatic({ root: './public' }));

// ==========================================
// SHOP API ROUTES
// ==========================================

// Get all products or filter by category
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

// Get single product by ID
app.get('/api/products/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }
  
  return c.json(product);
});

// Get categories
app.get('/api/categories', (c) => {
  return c.json(categories);
});

// Get brands
app.get('/api/brands', (c) => {
  return c.json(brands);
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
      paymentIntent: body.paymentIntent || null
    };
    
    orders.push(order);
    
    return c.json({ success: true, order });
  } catch (error) {
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get all orders (admin)
app.get('/api/admin/orders', (c) => {
  return c.json(orders);
});

// Update order status (admin)
app.patch('/api/admin/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const order = orders.find(o => o.id === id);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    order.status = body.status;
    
    return c.json({ success: true, order });
  } catch (error) {
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// ==========================================
// HTML PAGES
// ==========================================

// Shop Homepage
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoulZen - Authentic Korean Beauty Products</title>
    <link rel="stylesheet" href="/static/shop.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">🌸 SeoulZen</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
                <a href="/blog">Blog</a>
                <a href="/about">About</a>
            </div>
            <div class="nav-actions">
                <a href="/cart" class="cart-icon">
                    🛒 Cart <span class="cart-count">0</span>
                </a>
                <a href="/admin" class="admin-link">Admin</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Authentic Korean Beauty</h1>
                <p>Direct from Seoul • Worldwide Shipping $10</p>
                <a href="/shop" class="btn btn-primary">Shop Now</a>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
        <div class="container">
            <h2>✨ Bestsellers</h2>
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
                <div class="feature-card">
                    <div class="feature-icon">💝</div>
                    <h3>Free Samples</h3>
                    <p>With every order</p>
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
                                    <span class="price">$\${product.price}</span>
                                    \${product.originalPrice ? \`<span class="original-price">$\${product.originalPrice}</span>\` : ''}
                                </div>
                                <button class="btn btn-secondary btn-add-cart" onclick="addToCart(\${product.id}, event)">
                                    Add to Cart
                                </button>
                            </div>
                        </a>
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
            
            // Show feedback
            alert('Added to cart!');
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
    </script>
</body>
</html>
  `);
});

// Shop page (product listing)
app.get('/shop', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop - SeoulZen</title>
    <link rel="stylesheet" href="/static/shop.css">
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
                <a href="/blog">Blog</a>
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
            <h3>Categories</h3>
            <div id="category-filters">
                <!-- Loaded by JS -->
            </div>
            
            <h3>Price Range</h3>
            <div class="price-filters">
                <label><input type="checkbox" value="0-20"> Under $20</label>
                <label><input type="checkbox" value="20-40"> $20 - $40</label>
                <label><input type="checkbox" value="40-60"> $40 - $60</label>
                <label><input type="checkbox" value="60+"> Over $60</label>
            </div>
        </aside>

        <main class="shop-main">
            <div class="shop-header">
                <h1>All Products</h1>
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

    <script src="/static/shop.js"></script>
</body>
</html>
  `);
});

// Product detail page
app.get('/product/:id', (c) => {
  const id = c.req.param('id');
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product - SeoulZen</title>
    <link rel="stylesheet" href="/static/shop.css">
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
        <div id="product-detail" class="product-detail-container">
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
                        <img src="\${product.image}" alt="\${product.name}" class="main-image">
                    </div>
                    <div class="product-info-detail">
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
                                <input type="number" id="quantity" value="1" min="1">
                                <button onclick="increaseQty()">+</button>
                            </div>
                            <button class="btn btn-primary btn-large" onclick="addToCart()">
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
                            <p class="ingredients">\${product.ingredients}</p>
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
                document.getElementById('product-detail').innerHTML = '<p>Product not found</p>';
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
            alert(\`Added \${quantity} item(s) to cart!\`);
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

// Continue in next message...
console.log('Shop server starting on port 3000...');

serve({
  fetch: app.fetch,
  port: 3000,
});
