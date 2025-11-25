import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

// Mock Data - Categories
const categories = [
  { id: 1, name: 'Insurance', slug: 'insurance', description: 'High-value insurance guides and comparisons' },
  { id: 2, name: 'Finance', slug: 'finance', description: 'Personal finance, investing, and wealth building' },
  { id: 3, name: 'Cryptocurrency', slug: 'cryptocurrency', description: 'Crypto trading, blockchain, and digital assets' },
  { id: 4, name: 'Legal', slug: 'legal', description: 'Legal advice, services, and attorney guides' },
  { id: 5, name: 'Web Hosting', slug: 'web-hosting', description: 'Web hosting reviews and comparisons' },
  { id: 6, name: 'VPN', slug: 'vpn', description: 'VPN reviews, privacy, and security guides' }
]

// Mock Data - Posts
const posts = [
  {
    id: 1,
    title: 'Best Car Insurance Companies 2025: Complete Comparison Guide',
    slug: 'best-car-insurance-companies-2025-guide',
    content: '<h2>Finding the Right Car Insurance</h2><p>Choosing the right car insurance can save you thousands of dollars annually while providing comprehensive coverage.</p>',
    excerpt: 'Discover the best car insurance companies in 2025. Compare rates, coverage options, and save up to 40% on premiums.',
    category: 'Insurance',
    tags: 'car insurance,auto insurance,insurance comparison',
    featured_image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
    views: 15420,
    published: true,
    created_at: '2025-11-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Cryptocurrency Investment Guide 2025: Bitcoin, Ethereum & Altcoins',
    slug: 'cryptocurrency-investment-guide-2025',
    content: '<h2>The Complete Crypto Investment Strategy</h2><p>Comprehensive guide to cryptocurrency investment.</p>',
    excerpt: 'Master cryptocurrency investment in 2025. Learn Bitcoin, Ethereum, and altcoin strategies.',
    category: 'Cryptocurrency',
    tags: 'cryptocurrency,bitcoin,ethereum,crypto investment',
    featured_image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200',
    views: 28350,
    published: true,
    created_at: '2025-11-21T10:00:00Z'
  },
  {
    id: 3,
    title: 'Best VPN Services 2025: Privacy, Security & Speed Comparison',
    slug: 'best-vpn-services-2025-comparison',
    content: '<h2>Choosing the Right VPN Service</h2><p>Compare top VPN services for security and speed.</p>',
    excerpt: 'Find the best VPN service for 2025. Compare NordVPN, ExpressVPN, Surfshark, and more.',
    category: 'VPN',
    tags: 'vpn,best vpn,vpn service,online privacy',
    featured_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
    views: 19870,
    published: true,
    created_at: '2025-11-22T10:00:00Z'
  },
  {
    id: 4,
    title: 'Personal Injury Lawyer Guide 2025: How to Win Your Case',
    slug: 'personal-injury-lawyer-guide-2025',
    content: '<h2>Understanding Personal Injury Claims</h2><p>Everything you need to know about personal injury lawyers.</p>',
    excerpt: 'Complete guide to personal injury lawyers and claims. Learn how to choose an attorney.',
    category: 'Legal',
    tags: 'personal injury lawyer,attorney,legal advice',
    featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
    views: 12450,
    published: true,
    created_at: '2025-11-23T10:00:00Z'
  },
  {
    id: 5,
    title: 'Best Web Hosting 2025: Complete Guide',
    slug: 'best-web-hosting-2025-guide',
    content: '<h2>Choosing the Perfect Web Hosting Service</h2><p>Compare the best hosting providers.</p>',
    excerpt: 'Find the best web hosting service for 2025. Compare Bluehost, SiteGround, HostGator.',
    category: 'Web Hosting',
    tags: 'web hosting,best hosting,wordpress hosting',
    featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    views: 22100,
    published: true,
    created_at: '2025-11-23T12:00:00Z'
  },
  {
    id: 6,
    title: 'Real Estate Investing 2025: Complete Beginner Guide',
    slug: 'how-to-invest-real-estate-2025-guide',
    content: '<h2>Real Estate Investment Strategies</h2><p>Proven methods to start investing.</p>',
    excerpt: 'Learn how to invest in real estate in 2025. Rental properties, REITs, and more.',
    category: 'Finance',
    tags: 'real estate,real estate investing,property investment',
    featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    views: 31200,
    published: true,
    created_at: '2025-11-24T10:00:00Z'
  },
  {
    id: 7,
    title: 'Life Insurance Guide 2025: Term vs Whole Life',
    slug: 'life-insurance-guide-2025',
    content: '<h2>Understanding Life Insurance</h2><p>Compare term vs whole life insurance.</p>',
    excerpt: 'Compare term vs whole life insurance. Find the best rates for your family.',
    category: 'Insurance',
    tags: 'life insurance,term life,whole life',
    featured_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    views: 8900,
    published: true,
    created_at: '2025-11-24T14:00:00Z'
  },
  {
    id: 8,
    title: 'Business Loan Guide 2025',
    slug: 'business-loan-guide-2025',
    content: '<h2>Financing Your Business</h2><p>SBA loans vs traditional banks.</p>',
    excerpt: 'Compare business loan options. SBA loans vs traditional banks.',
    category: 'Finance',
    tags: 'business loans,SBA loans,small business financing',
    featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200',
    views: 14500,
    published: true,
    created_at: '2025-11-24T16:00:00Z'
  },
  {
    id: 9,
    title: 'Bitcoin ETF Guide 2025',
    slug: 'bitcoin-etf-guide-2025',
    content: '<h2>Bitcoin ETF Investing</h2><p>Invest safely in crypto through regulated funds.</p>',
    excerpt: 'Complete Bitcoin ETF guide. Invest in cryptocurrency through regulated funds.',
    category: 'Cryptocurrency',
    tags: 'bitcoin ETF,crypto investing,bitcoin',
    featured_image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200',
    views: 18700,
    published: true,
    created_at: '2025-11-25T08:00:00Z'
  },
  {
    id: 10,
    title: 'Divorce Lawyer Cost 2025',
    slug: 'divorce-lawyer-cost-2025',
    content: '<h2>Divorce Legal Costs</h2><p>Understand lawyer fees and save money.</p>',
    excerpt: 'Complete divorce lawyer cost guide. Understand fees and processes.',
    category: 'Legal',
    tags: 'divorce lawyer,divorce cost,family law',
    featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
    views: 9800,
    published: true,
    created_at: '2025-11-25T10:00:00Z'
  }
]

// API Routes
app.get('/api/posts', (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const category = c.req.query('category')
  const offset = (page - 1) * limit

  let filteredPosts = posts.filter(p => p.published)
  
  if (category) {
    filteredPosts = filteredPosts.filter(p => p.category === category)
  }

  const total = filteredPosts.length
  const paginatedPosts = filteredPosts.slice(offset, offset + limit)

  return c.json({
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
})

app.get('/api/categories', (c) => {
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name))
  return c.json(sortedCategories)
})

app.get('/api/posts/popular/top', (c) => {
  const limit = parseInt(c.req.query('limit') || '5')
  const popularPosts = posts
    .filter(p => p.published)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      views: p.views,
      category: p.category
    }))
  return c.json(popularPosts)
})

app.get('/api/posts/:slug', (c) => {
  const slug = c.req.param('slug')
  const post = posts.find(p => p.slug === slug && p.published)
  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }
  post.views += 1
  return c.json(post)
})

// Individual post page
app.get('/post/:slug', (c) => {
  const slug = c.req.param('slug')
  const post = posts.find(p => p.slug === slug && p.published)
  
  if (!post) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Post Not Found</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50">
          <div class="max-w-4xl mx-auto px-4 py-12">
              <h1 class="text-4xl font-bold mb-4">Post Not Found</h1>
              <p class="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
              <a href="/" class="text-blue-600 hover:text-blue-800">← Back to Home</a>
          </div>
      </body>
      </html>
    `)
  }

  // Increment view count
  post.views += 1

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title}</title>
        <meta name="description" content="${post.excerpt}">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <a href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600">
                        <i class="fas fa-newspaper text-blue-600 mr-2"></i>
                        Expert Reviews
                    </a>
                    <nav class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-600 hover:text-blue-600">Home</a>
                        <a href="/about" class="text-gray-600 hover:text-blue-600">About</a>
                        <a href="/contact" class="text-gray-600 hover:text-blue-600">Contact</a>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Article -->
        <article class="max-w-4xl mx-auto px-4 py-12">
            <!-- Featured Image -->
            <img src="${post.featured_image}" alt="${post.title}" class="w-full h-96 object-cover rounded-lg shadow-lg mb-8">
            
            <!-- Article Header -->
            <div class="mb-8">
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                    ${post.category}
                </span>
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${post.title}</h1>
                <div class="flex items-center text-gray-500 text-sm space-x-4">
                    <span><i class="fas fa-calendar mr-2"></i>${new Date(post.created_at).toLocaleDateString()}</span>
                    <span><i class="fas fa-eye mr-2"></i>${post.views.toLocaleString()} views</span>
                </div>
            </div>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8 mb-8">
                ${post.content}
            </div>

            <!-- Tags -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold mb-3">Tags:</h3>
                <div class="flex flex-wrap gap-2">
                    ${post.tags.split(',').map(tag => 
                        `<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">${tag.trim()}</span>`
                    ).join('')}
                </div>
            </div>

            <!-- Back to Home -->
            <div class="mt-12">
                <a href="/" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Home
                </a>
            </div>
        </article>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12 mt-12">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4">Expert Reviews</h3>
                        <p class="text-gray-400">Your trusted source for expert guides and reviews.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Categories</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/?category=Insurance" class="hover:text-white">Insurance</a></li>
                            <li><a href="/?category=Finance" class="hover:text-white">Finance</a></li>
                            <li><a href="/?category=Cryptocurrency" class="hover:text-white">Cryptocurrency</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/about" class="hover:text-white">About Us</a></li>
                            <li><a href="/contact" class="hover:text-white">Contact</a></li>
                            <li><a href="/privacy" class="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Legal</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/terms" class="hover:text-white">Terms of Service</a></li>
                            <li><a href="/privacy" class="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Expert Reviews. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `)
})

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>High-Revenue Blog - Insurance, Finance, Crypto & More</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">
                        <i class="fas fa-newspaper text-blue-600 mr-2"></i>
                        Expert Reviews
                    </h1>
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
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            async function loadCategories() {
                try {
                    const response = await axios.get('/api/categories');
                    const categories = response.data;
                    const container = document.getElementById('categories');
                    
                    container.innerHTML = '<button onclick="loadPosts()" class="px-4 py-2 bg-blue-600 text-white rounded-full">All</button>' +
                        categories.map(cat => 
                            \`<button onclick="loadPosts('\${cat.name}')" class="px-4 py-2 bg-white text-gray-700 rounded-full border">\${cat.name}</button>\`
                        ).join('');
                } catch (error) {
                    console.error('Error loading categories:', error);
                }
            }

            async function loadPosts(category = null) {
                try {
                    document.getElementById('loading').style.display = 'block';
                    document.getElementById('posts-grid').innerHTML = '';
                    
                    const url = category ? \`/api/posts?category=\${category}&limit=12\` : '/api/posts?limit=12';
                    const response = await axios.get(url);
                    const posts = response.data.posts;
                    
                    const grid = document.getElementById('posts-grid');
                    grid.innerHTML = posts.map(post => \`
                        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                            <img src="\${post.featured_image}" alt="\${post.title}" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <span class="text-sm text-blue-600 font-semibold">\${post.category}</span>
                                <h3 class="text-xl font-bold mt-2 mb-3">\${post.title}</h3>
                                <p class="text-gray-600 mb-4">\${post.excerpt}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">
                                        <i class="fas fa-eye mr-1"></i>\${post.views.toLocaleString()} views
                                    </span>
                                </div>
                            </div>
                        </article>
                    \`).join('');
                    
                    document.getElementById('loading').style.display = 'none';
                } catch (error) {
                    console.error('Error loading posts:', error);
                    document.getElementById('loading').innerHTML = '<p class="text-red-600">Failed to load content. Please refresh the page.</p>';
                }
            }

            loadCategories();
            loadPosts();
        </script>
    </body>
    </html>
  `)
})

// About page
app.get('/about', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About Us - Expert Reviews & Guides</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <a href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600">Expert Reviews</a>
            </div>
        </header>
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
  `)
})

// Contact page
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
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <a href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600">Expert Reviews</a>
            </div>
        </header>
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
  `)
})

// Privacy Policy
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
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <a href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600">Expert Reviews</a>
            </div>
        </header>
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
  `)
})

// Terms of Service
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
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <a href="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600">Expert Reviews</a>
            </div>
        </header>
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
  `)
})

const port = 8080
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
