import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes

// Get all posts (paginated)
app.get('/api/posts', async (c) => {
  const { env } = c
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const category = c.req.query('category')
  const offset = (page - 1) * limit

  try {
    let query = 'SELECT * FROM posts WHERE published = 1'
    let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE published = 1'
    
    if (category) {
      query += ` AND category = '${category}'`
      countQuery += ` AND category = '${category}'`
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    
    const posts = await env.DB.prepare(query).bind(limit, offset).all()
    const total = await env.DB.prepare(countQuery).first()
    
    return c.json({
      posts: posts.results,
      pagination: {
        page,
        limit,
        total: total?.total || 0,
        totalPages: Math.ceil((total?.total || 0) / limit)
      }
    })
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// Get single post by slug
app.get('/api/posts/:slug', async (c) => {
  const { env } = c
  const slug = c.req.param('slug')

  try {
    // Increment view count
    await env.DB.prepare('UPDATE posts SET views = views + 1 WHERE slug = ?').bind(slug).run()
    
    // Get post
    const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ? AND published = 1').bind(slug).first()
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }
    
    return c.json(post)
  } catch (error) {
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// Get categories
app.get('/api/categories', async (c) => {
  const { env } = c

  try {
    const categories = await env.DB.prepare('SELECT * FROM categories ORDER BY name').all()
    return c.json(categories.results)
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

// Get popular posts
app.get('/api/posts/popular/top', async (c) => {
  const { env } = c
  const limit = parseInt(c.req.query('limit') || '5')

  try {
    const posts = await env.DB.prepare(
      'SELECT id, title, slug, excerpt, views, category FROM posts WHERE published = 1 ORDER BY views DESC LIMIT ?'
    ).bind(limit).all()
    
    return c.json(posts.results)
  } catch (error) {
    return c.json({ error: 'Failed to fetch popular posts' }, 500)
  }
})

// Get recent posts
app.get('/api/posts/recent/latest', async (c) => {
  const { env } = c
  const limit = parseInt(c.req.query('limit') || '5')

  try {
    const posts = await env.DB.prepare(
      'SELECT id, title, slug, excerpt, created_at, category FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT ?'
    ).bind(limit).all()
    
    return c.json(posts.results)
  } catch (error) {
    return c.json({ error: 'Failed to fetch recent posts' }, 500)
  }
})

// Search posts
app.get('/api/search', async (c) => {
  const { env } = c
  const query = c.req.query('q')

  if (!query) {
    return c.json({ error: 'Search query is required' }, 400)
  }

  try {
    const posts = await env.DB.prepare(
      `SELECT * FROM posts 
       WHERE published = 1 
       AND (title LIKE ? OR content LIKE ? OR tags LIKE ?) 
       ORDER BY views DESC 
       LIMIT 20`
    ).bind(`%${query}%`, `%${query}%`, `%${query}%`).all()
    
    return c.json(posts.results)
  } catch (error) {
    return c.json({ error: 'Failed to search posts' }, 500)
  }
})

// Submit comment
app.post('/api/comments', async (c) => {
  const { env } = c
  const { post_id, author_name, author_email, content } = await c.req.json()

  if (!post_id || !author_name || !author_email || !content) {
    return c.json({ error: 'All fields are required' }, 400)
  }

  try {
    const result = await env.DB.prepare(
      'INSERT INTO comments (post_id, author_name, author_email, content) VALUES (?, ?, ?, ?)'
    ).bind(post_id, author_name, author_email, content).run()
    
    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (error) {
    return c.json({ error: 'Failed to submit comment' }, 500)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wealth & Finance Hub - Expert Guides on Money, Investing & Insurance</title>
        <meta name="description" content="Expert guides on insurance, finance, cryptocurrency, legal advice, and web hosting. Make smarter financial decisions with our comprehensive reviews.">
        <meta name="keywords" content="finance,investing,insurance,cryptocurrency,legal advice,web hosting,money management">
        
        <!-- Open Graph -->
        <meta property="og:title" content="Wealth & Finance Hub - Expert Money & Investing Guides">
        <meta property="og:description" content="Expert guides on insurance, finance, cryptocurrency, legal advice, and web hosting. Make smarter financial decisions.">
        <meta property="og:type" content="website">
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome -->
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .adsense-placeholder {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border-radius: 8px;
            }
            .card-hover {
                transition: all 0.3s ease;
            }
            .card-hover:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header with AdSense Banner -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-coins text-3xl gradient-text"></i>
                        <h1 class="text-2xl font-bold gradient-text">Wealth Hub</h1>
                    </div>
                    <nav class="hidden md:flex space-x-6">
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="all">All</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="Insurance">Insurance</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="Finance">Finance</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="Cryptocurrency">Crypto</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="Legal">Legal</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="Web Hosting">Hosting</a>
                        <a href="#" class="text-gray-600 hover:text-purple-600 transition" data-category="VPN">VPN</a>
                    </nav>
                    <div class="flex items-center space-x-3">
                        <button id="searchBtn" class="text-gray-600 hover:text-purple-600">
                            <i class="fas fa-search text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Search Bar (Hidden by default) -->
                <div id="searchBar" class="hidden mt-4">
                    <div class="relative">
                        <input type="text" id="searchInput" placeholder="Search articles..." 
                               class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <i class="fas fa-search absolute left-4 top-4 text-gray-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- AdSense Banner Placeholder -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div class="adsense-placeholder h-24">
                    <span>Google AdSense Banner Ad (728x90 or Responsive)</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Content Area -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Featured Post -->
                    <div id="featuredPost" class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="animate-pulse">
                            <div class="h-64 bg-gray-200"></div>
                            <div class="p-6 space-y-4">
                                <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-4 bg-gray-200 rounded"></div>
                                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- AdSense In-feed Ad -->
                    <div class="adsense-placeholder h-32">
                        <span>Google AdSense In-feed Ad (Responsive)</span>
                    </div>
                    
                    <!-- Posts Grid -->
                    <div id="postsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Loading skeletons -->
                        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div class="h-48 bg-gray-200"></div>
                            <div class="p-6 space-y-3">
                                <div class="h-6 bg-gray-200 rounded"></div>
                                <div class="h-4 bg-gray-200 rounded"></div>
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div id="pagination" class="flex justify-center mt-8 space-x-2"></div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- AdSense Sidebar Ad -->
                    <div class="sticky top-24">
                        <div class="adsense-placeholder h-64 mb-6">
                            <span>Google AdSense<br>Sidebar Ad<br>(300x250)</span>
                        </div>
                        
                        <!-- Popular Posts -->
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-fire text-orange-500 mr-2"></i>
                                Trending Now
                            </h3>
                            <div id="popularPosts" class="space-y-4">
                                <!-- Loading -->
                                <div class="animate-pulse space-y-3">
                                    <div class="h-4 bg-gray-200 rounded"></div>
                                    <div class="h-4 bg-gray-200 rounded"></div>
                                    <div class="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Categories -->
                        <div class="bg-white rounded-xl shadow-md p-6 mt-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-folder text-blue-500 mr-2"></i>
                                Categories
                            </h3>
                            <div id="categories" class="space-y-2">
                                <!-- Loading -->
                                <div class="animate-pulse space-y-2">
                                    <div class="h-8 bg-gray-200 rounded"></div>
                                    <div class="h-8 bg-gray-200 rounded"></div>
                                    <div class="h-8 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Another AdSense Ad -->
                        <div class="adsense-placeholder h-64 mt-6">
                            <span>Google AdSense<br>Sidebar Ad 2<br>(300x250)</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer with AdSense Anchor Ad -->
        <footer class="bg-gray-800 text-white mt-16 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 class="text-lg font-bold mb-4">Wealth Hub</h4>
                        <p class="text-gray-400">Expert guides on finance, investing, and wealth building.</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Categories</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition">Insurance</a></li>
                            <li><a href="#" class="hover:text-white transition">Cryptocurrency</a></li>
                            <li><a href="#" class="hover:text-white transition">Finance</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-twitter text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram text-2xl"></i></a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Wealth Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
        
        <!-- AdSense Anchor Ad Placeholder (Fixed Bottom) -->
        <div class="fixed bottom-0 left-0 right-0 z-40 adsense-placeholder h-16">
            <span>Google AdSense Anchor Ad (Fixed Bottom)</span>
        </div>

        <!-- Axios -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <script>
            let currentPage = 1;
            let currentCategory = null;
            
            // Load posts
            async function loadPosts(page = 1, category = null) {
                try {
                    let url = \`/api/posts?page=\${page}&limit=6\`;
                    if (category && category !== 'all') {
                        url += \`&category=\${encodeURIComponent(category)}\`;
                    }
                    
                    const response = await axios.get(url);
                    const { posts, pagination } = response.data;
                    
                    const container = document.getElementById('postsContainer');
                    container.innerHTML = posts.map(post => \`
                        <article class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer" onclick="window.location.href='/post/\${post.slug}'">
                            <img src="\${post.featured_image || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600'}" 
                                 alt="\${post.title}" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <div class="flex items-center space-x-2 mb-3">
                                    <span class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                                        \${post.category}
                                    </span>
                                    <span class="text-gray-500 text-sm flex items-center">
                                        <i class="fas fa-eye mr-1"></i> \${post.views.toLocaleString()}
                                    </span>
                                </div>
                                <h3 class="text-xl font-bold mb-2 hover:text-purple-600 transition">
                                    \${post.title}
                                </h3>
                                <p class="text-gray-600 mb-4 line-clamp-2">\${post.excerpt}</p>
                                <div class="flex items-center justify-between text-sm text-gray-500">
                                    <span><i class="fas fa-user mr-1"></i> \${post.author}</span>
                                    <span><i class="fas fa-calendar mr-1"></i> \${new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </article>
                    \`).join('');
                    
                    // Featured post (first post)
                    if (posts.length > 0 && page === 1) {
                        const featured = posts[0];
                        document.getElementById('featuredPost').innerHTML = \`
                            <div class="cursor-pointer" onclick="window.location.href='/post/\${featured.slug}'">
                                <img src="\${featured.featured_image}" alt="\${featured.title}" class="w-full h-64 object-cover">
                                <div class="p-8">
                                    <span class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium">
                                        Featured
                                    </span>
                                    <h2 class="text-3xl font-bold mt-4 mb-3 hover:text-purple-600 transition">\${featured.title}</h2>
                                    <p class="text-gray-600 mb-4">\${featured.excerpt}</p>
                                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                                        <span><i class="fas fa-user mr-1"></i> \${featured.author}</span>
                                        <span><i class="fas fa-eye mr-1"></i> \${featured.views.toLocaleString()}</span>
                                        <span><i class="fas fa-calendar mr-1"></i> \${new Date(featured.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }
                    
                    // Pagination
                    const paginationContainer = document.getElementById('pagination');
                    if (pagination.totalPages > 1) {
                        paginationContainer.innerHTML = Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => \`
                            <button onclick="loadPosts(\${p}, currentCategory)" 
                                    class="px-4 py-2 \${p === pagination.page ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'} rounded-lg shadow hover:bg-purple-500 hover:text-white transition">
                                \${p}
                            </button>
                        \`).join('');
                    }
                    
                    currentPage = page;
                    currentCategory = category;
                } catch (error) {
                    console.error('Failed to load posts:', error);
                }
            }
            
            // Load popular posts
            async function loadPopularPosts() {
                try {
                    const response = await axios.get('/api/posts/popular/top?limit=5');
                    const posts = response.data;
                    
                    document.getElementById('popularPosts').innerHTML = posts.map((post, index) => \`
                        <div class="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition" 
                             onclick="window.location.href='/post/\${post.slug}'">
                            <span class="text-2xl font-bold text-purple-600">\${index + 1}</span>
                            <div class="flex-1">
                                <h4 class="font-medium hover:text-purple-600 transition line-clamp-2">\${post.title}</h4>
                                <p class="text-sm text-gray-500 mt-1">
                                    <i class="fas fa-eye mr-1"></i> \${post.views.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    \`).join('');
                } catch (error) {
                    console.error('Failed to load popular posts:', error);
                }
            }
            
            // Load categories
            async function loadCategories() {
                try {
                    const response = await axios.get('/api/categories');
                    const categories = response.data;
                    
                    document.getElementById('categories').innerHTML = categories.map(cat => \`
                        <button onclick="loadPosts(1, '\${cat.name}')" 
                                class="w-full text-left px-4 py-2 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition">
                            <i class="fas fa-folder mr-2"></i> \${cat.name}
                        </button>
                    \`).join('');
                } catch (error) {
                    console.error('Failed to load categories:', error);
                }
            }
            
            // Search functionality
            document.getElementById('searchBtn').addEventListener('click', () => {
                const searchBar = document.getElementById('searchBar');
                searchBar.classList.toggle('hidden');
                if (!searchBar.classList.contains('hidden')) {
                    document.getElementById('searchInput').focus();
                }
            });
            
            document.getElementById('searchInput').addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        try {
                            const response = await axios.get(\`/api/search?q=\${encodeURIComponent(query)}\`);
                            const posts = response.data;
                            
                            const container = document.getElementById('postsContainer');
                            container.innerHTML = posts.map(post => \`
                                <article class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer" 
                                         onclick="window.location.href='/post/\${post.slug}'">
                                    <img src="\${post.featured_image || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600'}" 
                                         alt="\${post.title}" class="w-full h-48 object-cover">
                                    <div class="p-6">
                                        <div class="flex items-center space-x-2 mb-3">
                                            <span class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                                                \${post.category}
                                            </span>
                                        </div>
                                        <h3 class="text-xl font-bold mb-2 hover:text-purple-600 transition">\${post.title}</h3>
                                        <p class="text-gray-600 mb-4 line-clamp-2">\${post.excerpt}</p>
                                    </div>
                                </article>
                            \`).join('');
                            
                            document.getElementById('pagination').innerHTML = '';
                        } catch (error) {
                            console.error('Search failed:', error);
                        }
                    }
                }
            });
            
            // Category filter
            document.querySelectorAll('[data-category]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = e.target.dataset.category;
                    loadPosts(1, category === 'all' ? null : category);
                });
            });
            
            // Initialize
            loadPosts();
            loadPopularPosts();
            loadCategories();
        </script>
    </body>
    </html>
  `)
})

// Single post page
app.get('/post/:slug', async (c) => {
  const { env } = c
  const slug = c.req.param('slug')

  try {
    // Get post
    const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ? AND published = 1').bind(slug).first()
    
    if (!post) {
      return c.html('<h1>Post not found</h1>')
    }
    
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.meta_title || post.title}</title>
          <meta name="description" content="${post.meta_description || post.excerpt}">
          <meta name="keywords" content="${post.meta_keywords || post.tags}">
          
          <!-- Open Graph -->
          <meta property="og:title" content="${post.title}">
          <meta property="og:description" content="${post.excerpt}">
          <meta property="og:type" content="article">
          <meta property="og:image" content="${post.featured_image}">
          
          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
          
          <!-- Font Awesome -->
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          
          <!-- Google Fonts -->
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          
          <style>
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .adsense-placeholder {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  border-radius: 8px;
              }
              .prose {
                  max-width: none;
              }
              .prose h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
              }
              .prose h3 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
              }
              .prose p {
                  margin-bottom: 1rem;
                  line-height: 1.8;
                  font-size: 1.125rem;
              }
          </style>
      </head>
      <body class="bg-gray-50">
          <!-- Header -->
          <header class="bg-white shadow-sm">
              <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <a href="/" class="flex items-center space-x-3 hover:opacity-80 transition">
                      <i class="fas fa-arrow-left text-purple-600"></i>
                      <span class="text-lg font-medium">Back to Home</span>
                  </a>
              </div>
              
              <!-- AdSense Banner -->
              <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                  <div class="adsense-placeholder h-24">
                      <span>Google AdSense Banner Ad (728x90)</span>
                  </div>
              </div>
          </header>

          <!-- Main Content -->
          <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <article class="bg-white rounded-xl shadow-lg overflow-hidden">
                  <!-- Featured Image -->
                  <img src="${post.featured_image}" alt="${post.title}" class="w-full h-96 object-cover">
                  
                  <div class="p-8 lg:p-12">
                      <!-- Category & Meta -->
                      <div class="flex items-center justify-between mb-6">
                          <span class="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                              ${post.category}
                          </span>
                          <div class="flex items-center space-x-4 text-sm text-gray-500">
                              <span><i class="fas fa-user mr-1"></i> ${post.author}</span>
                              <span><i class="fas fa-eye mr-1"></i> ${post.views.toLocaleString()}</span>
                              <span><i class="fas fa-calendar mr-1"></i> ${new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                          </div>
                      </div>
                      
                      <!-- Title -->
                      <h1 class="text-4xl font-bold mb-6">${post.title}</h1>
                      
                      <!-- Share Buttons -->
                      <div class="flex items-center space-x-3 mb-8 pb-8 border-b">
                          <span class="text-gray-600 font-medium">Share:</span>
                          <a href="#" class="text-blue-600 hover:text-blue-700"><i class="fab fa-facebook text-2xl"></i></a>
                          <a href="#" class="text-blue-400 hover:text-blue-500"><i class="fab fa-twitter text-2xl"></i></a>
                          <a href="#" class="text-green-600 hover:text-green-700"><i class="fab fa-whatsapp text-2xl"></i></a>
                      </div>
                      
                      <!-- AdSense In-Content Ad 1 -->
                      <div class="adsense-placeholder h-32 mb-8">
                          <span>Google AdSense In-Content Ad (Responsive)</span>
                      </div>
                      
                      <!-- Content -->
                      <div class="prose prose-lg max-w-none">
                          ${post.content}
                      </div>
                      
                      <!-- AdSense In-Content Ad 2 -->
                      <div class="adsense-placeholder h-32 my-8">
                          <span>Google AdSense In-Content Ad (Responsive)</span>
                      </div>
                      
                      <!-- Tags -->
                      ${post.tags ? `
                      <div class="mt-8 pt-8 border-t">
                          <h3 class="text-lg font-bold mb-4">Tags</h3>
                          <div class="flex flex-wrap gap-2">
                              ${post.tags.split(',').map(tag => `
                                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                      #${tag.trim()}
                                  </span>
                              `).join('')}
                          </div>
                      </div>
                      ` : ''}
                      
                      <!-- AdSense In-Content Ad 3 -->
                      <div class="adsense-placeholder h-32 my-8">
                          <span>Google AdSense In-Content Ad (Responsive)</span>
                      </div>
                  </div>
              </article>
              
              <!-- Related Posts -->
              <div class="mt-12">
                  <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
                  <div id="relatedPosts" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Will be loaded by JS -->
                  </div>
              </div>
          </main>

          <!-- Footer -->
          <footer class="bg-gray-800 text-white mt-16 py-8">
              <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <p>&copy; 2025 Wealth Hub. All rights reserved.</p>
              </div>
          </footer>
          
          <!-- AdSense Anchor Ad -->
          <div class="fixed bottom-0 left-0 right-0 z-40 adsense-placeholder h-16">
              <span>Google AdSense Anchor Ad (Fixed Bottom)</span>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
          <script>
              // Load related posts
              async function loadRelatedPosts() {
                  try {
                      const response = await axios.get('/api/posts?limit=3&category=${encodeURIComponent(post.category)}');
                      const posts = response.data.posts.filter(p => p.slug !== '${slug}').slice(0, 3);
                      
                      document.getElementById('relatedPosts').innerHTML = posts.map(post => \`
                          <article class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition" 
                                   onclick="window.location.href='/post/\${post.slug}'">
                              <img src="\${post.featured_image}" alt="\${post.title}" class="w-full h-48 object-cover">
                              <div class="p-4">
                                  <h3 class="font-bold mb-2 hover:text-purple-600 transition">\${post.title}</h3>
                                  <p class="text-sm text-gray-600 line-clamp-2">\${post.excerpt}</p>
                              </div>
                          </article>
                      \`).join('');
                  } catch (error) {
                      console.error('Failed to load related posts:', error);
                  }
              }
              
              loadRelatedPosts();
          </script>
      </body>
      </html>
    `)
  } catch (error) {
    return c.html('<h1>Error loading post</h1>')
  }
})

export default app
