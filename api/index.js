const { Hono } = require('hono');
const { handle } = require('hono/vercel');
const { createClient } = require('@supabase/supabase-js');

const app = new Hono().basePath('/');

// Supabase client initialization
const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://wvofyxbwsmtmbfnlygsx.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2b2Z5eGJ3c210bWJmbmx5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxODUwNDUsImV4cCI6MjA0Nzc2MTA0NX0.vR_dqhCHEqU7bGwJdHOtYZzE1I-vPPiXNXAa3xAkG7Q';
  return createClient(supabaseUrl, supabaseKey);
};

// API Routes
app.get('/api/posts', async (c) => {
  const supabase = getSupabase();
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const category = c.req.query('category');
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return c.json({
      posts: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts', details: error.message }, 500);
  }
});

app.get('/api/posts/:slug', async (c) => {
  const supabase = getSupabase();
  const slug = c.req.param('slug');

  try {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id, views')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      await supabase
        .from('posts')
        .update({ views: (existingPost.views || 0) + 1 })
        .eq('id', existingPost.id);
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Error fetching post:', error);
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

app.get('/api/categories', async (c) => {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories', details: error.message }, 500);
  }
});

app.get('/api/posts/popular/top', async (c) => {
  const supabase = getSupabase();
  const limit = parseInt(c.req.query('limit') || '5');

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, views, category')
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return c.json({ error: 'Failed to fetch popular posts' }, 500);
  }
});

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>High-Revenue Blog - Insurance, Finance, Crypto & More</title>
        <meta name="description" content="Expert guides on insurance, finance, cryptocurrency, legal services, and web hosting. Maximize your knowledge and savings.">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">
                        <i class="fas fa-newspaper text-blue-600 mr-2"></i>
                        Expert Reviews
                    </h1>
                    <nav class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-600 hover:text-blue-600">Home</a>
                        <a href="/about" class="text-gray-600 hover:text-blue-600">About</a>
                        <a href="/contact" class="text-gray-600 hover:text-blue-600">Contact</a>
                    </nav>
                </div>
            </div>
        </header>

        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h2 class="text-4xl font-bold mb-4">Expert Guides & Reviews</h2>
                <p class="text-xl opacity-90">Insurance, Finance, Crypto, Legal, Hosting & VPN</p>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-8">
            <div id="categories" class="flex flex-wrap gap-3 mb-8"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 pb-12">
            <div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            <div id="loading" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4 text-gray-600">Loading amazing content...</p>
            </div>
            <div id="error" class="hidden text-center py-8">
                <p class="text-red-600 text-lg">Failed to load content. Please refresh the page.</p>
            </div>
        </div>

        <footer class="bg-gray-900 text-white py-12 mt-12">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4">Expert Reviews</h3>
                        <p class="text-gray-400">Your trusted source for expert guides.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Categories</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/?category=Insurance">Insurance</a></li>
                            <li><a href="/?category=Finance">Finance</a></li>
                            <li><a href="/?category=Cryptocurrency">Cryptocurrency</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Legal</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/terms">Terms of Service</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Expert Reviews. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            async function loadCategories() {
                try {
                    console.log('Fetching categories...');
                    const response = await axios.get('/api/categories');
                    console.log('Categories response:', response.data);
                    const categories = response.data;
                    const container = document.getElementById('categories');
                    
                    container.innerHTML = '<button onclick="loadPosts()" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">All</button>' +
                        categories.map(cat => 
                            \`<button onclick="loadPosts('\${cat.name}')" class="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 border">\${cat.name}</button>\`
                        ).join('');
                } catch (error) {
                    console.error('Error loading categories:', error);
                    document.getElementById('error').classList.remove('hidden');
                }
            }

            async function loadPosts(category = null) {
                try {
                    console.log('Fetching posts...');
                    document.getElementById('loading').style.display = 'block';
                    document.getElementById('posts-grid').innerHTML = '';
                    document.getElementById('error').classList.add('hidden');
                    
                    const url = category ? \`/api/posts?category=\${category}&limit=12\` : '/api/posts?limit=12';
                    console.log('Fetching from:', url);
                    const response = await axios.get(url);
                    console.log('Posts response:', response.data);
                    const posts = response.data.posts;
                    
                    if (!posts || posts.length === 0) {
                        document.getElementById('loading').innerHTML = '<p class="text-gray-600">No posts found</p>';
                        return;
                    }
                    
                    const grid = document.getElementById('posts-grid');
                    grid.innerHTML = posts.map(post => \`
                        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                            <img src="\${post.featured_image}" alt="\${post.title}" class="w-full h-48 object-cover" onerror="this.src='https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200'">
                            <div class="p-6">
                                <span class="text-sm text-blue-600 font-semibold">\${post.category}</span>
                                <h3 class="text-xl font-bold mt-2 mb-3">\${post.title}</h3>
                                <p class="text-gray-600 mb-4">\${post.excerpt}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">
                                        <i class="fas fa-eye mr-1"></i>\${post.views ? post.views.toLocaleString() : '0'} views
                                    </span>
                                    <a href="/post/\${post.slug}" class="text-blue-600 hover:text-blue-800 font-semibold">
                                        Read More <i class="fas fa-arrow-right ml-1"></i>
                                    </a>
                                </div>
                            </div>
                        </article>
                    \`).join('');
                    
                    document.getElementById('loading').style.display = 'none';
                } catch (error) {
                    console.error('Error loading posts:', error);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('error').classList.remove('hidden');
                }
            }

            console.log('Initializing...');
            loadCategories();
            loadPosts();
        </script>
    </body>
    </html>
  `);
});

app.get('/about', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About Us - Expert Reviews</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold mb-6">About Us</h1>
            <div class="bg-white rounded-lg shadow-md p-8 prose max-w-none">
                <p class="text-lg mb-4">We provide expert reviews and comprehensive guides to help you make informed decisions.</p>
                <p>Our team researches and analyzes products and services across insurance, finance, cryptocurrency, legal services, web hosting, and VPN solutions.</p>
            </div>
            <a href="/" class="inline-block mt-6 text-blue-600 hover:text-blue-800">← Back to Home</a>
        </div>
    </body>
    </html>
  `);
});

app.get('/contact', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Us - Expert Reviews</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold mb-6">Contact Us</h1>
            <div class="bg-white rounded-lg shadow-md p-8">
                <p class="text-lg mb-4">Have questions or feedback? We'd love to hear from you!</p>
                <p class="mb-2"><strong>Email:</strong> contact@expertreviews.com</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9AM - 5PM EST</p>
            </div>
            <a href="/" class="inline-block mt-6 text-blue-600 hover:text-blue-800">← Back to Home</a>
        </div>
    </body>
    </html>
  `);
});

app.get('/privacy', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - Expert Reviews</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold mb-6">Privacy Policy</h1>
            <div class="bg-white rounded-lg shadow-md p-8 prose max-w-none">
                <p>Last updated: November 25, 2025</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">Information We Collect</h2>
                <p>We collect information you provide directly to us and information automatically collected when you use our services.</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services.</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">Contact Us</h2>
                <p>If you have questions about this Privacy Policy, please contact us at privacy@expertreviews.com</p>
            </div>
            <a href="/" class="inline-block mt-6 text-blue-600 hover:text-blue-800">← Back to Home</a>
        </div>
    </body>
    </html>
  `);
});

app.get('/terms', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Service - Expert Reviews</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-4xl font-bold mb-6">Terms of Service</h1>
            <div class="bg-white rounded-lg shadow-md p-8 prose max-w-none">
                <p>Last updated: November 25, 2025</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">Agreement to Terms</h2>
                <p>By accessing our website, you agree to be bound by these Terms of Service.</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">Use License</h2>
                <p>Permission is granted to temporarily access the materials on our website for personal, non-commercial use only.</p>
                <h2 class="text-2xl font-bold mt-6 mb-4">Contact</h2>
                <p>Questions about the Terms of Service should be sent to us at legal@expertreviews.com</p>
            </div>
            <a href="/" class="inline-block mt-6 text-blue-600 hover:text-blue-800">← Back to Home</a>
        </div>
    </body>
    </html>
  `);
});

module.exports = handle(app);
