import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS
app.use('/api/*', cors())

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
    content: '<h2>Finding the Right Car Insurance</h2><p>Choosing the right car insurance can save you thousands of dollars annually while providing comprehensive coverage. This guide compares the top insurance providers in 2025.</p><h3>1. State Farm - Best Overall Coverage</h3><p>State Farm offers competitive rates with exceptional customer service. Average annual premium: $1,200-1,800. Excellent claim processing with 98% satisfaction rate.</p><h3>2. Geico - Best for Budget-Conscious Drivers</h3><p>Geico provides affordable premiums starting at $900/year. Perfect for drivers with clean records looking to minimize costs without sacrificing essential coverage.</p>',
    excerpt: 'Discover the best car insurance companies in 2025. Compare rates, coverage options, and save up to 40% on premiums with our comprehensive guide.',
    category: 'Insurance',
    tags: 'car insurance,auto insurance,insurance comparison,best insurance,cheap car insurance',
    featured_image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
    views: 15420,
    published: true,
    created_at: '2025-11-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Cryptocurrency Investment Guide 2025: Bitcoin, Ethereum & Altcoins',
    slug: 'cryptocurrency-investment-guide-2025',
    content: '<h2>The Complete Crypto Investment Strategy</h2><p>Cryptocurrency has evolved from speculative asset to mainstream investment. This comprehensive guide covers everything from Bitcoin basics to advanced trading strategies.</p><h3>1. Bitcoin - Digital Gold Standard</h3><p>Bitcoin remains the most stable cryptocurrency with $1.2 trillion market cap. Long-term holding (HODL) strategy has proven successful with 200%+ annual returns historically.</p>',
    excerpt: 'Master cryptocurrency investment in 2025. Learn Bitcoin, Ethereum, and altcoin strategies. Comprehensive guide to building a profitable crypto portfolio.',
    category: 'Cryptocurrency',
    tags: 'cryptocurrency,bitcoin,ethereum,crypto investment,blockchain,altcoins',
    featured_image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200',
    views: 28350,
    published: true,
    created_at: '2025-11-21T10:00:00Z'
  },
  {
    id: 3,
    title: 'Best VPN Services 2025: Privacy, Security & Speed Comparison',
    slug: 'best-vpn-services-2025-comparison',
    content: '<h2>Choosing the Right VPN Service</h2><p>Online privacy is more critical than ever. This guide compares the top VPN services for security, speed, and value in 2025.</p><h3>1. NordVPN - Best Overall VPN</h3><p>NordVPN leads with military-grade encryption, 5,500+ servers in 60 countries, and blazing speeds.</p>',
    excerpt: 'Find the best VPN service for 2025. Compare NordVPN, ExpressVPN, Surfshark, and more. Expert reviews, speed tests, and privacy comparisons.',
    category: 'VPN',
    tags: 'vpn,best vpn,vpn service,online privacy,cybersecurity,vpn comparison',
    featured_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
    views: 19870,
    published: true,
    created_at: '2025-11-22T10:00:00Z'
  },
  {
    id: 4,
    title: 'Personal Injury Lawyer Guide 2025: How to Win Your Case',
    slug: 'personal-injury-lawyer-guide-2025',
    content: '<h2>Understanding Personal Injury Claims</h2><p>Personal injury cases can result in substantial compensation when handled correctly. This guide explains everything you need to know about hiring a lawyer and winning your case.</p>',
    excerpt: 'Complete guide to personal injury lawyers and claims. Learn how to choose an attorney, maximize settlements, and win your case.',
    category: 'Legal',
    tags: 'personal injury lawyer,attorney,legal advice,injury claim,lawsuit,compensation',
    featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
    views: 12450,
    published: true,
    created_at: '2025-11-23T10:00:00Z'
  },
  {
    id: 5,
    title: 'Best Web Hosting 2025: Complete Guide for Beginners & Businesses',
    slug: 'best-web-hosting-2025-guide',
    content: '<h2>Choosing the Perfect Web Hosting Service</h2><p>Web hosting is the foundation of your online presence. This comprehensive guide compares the best hosting providers for speed, reliability, and value in 2025.</p>',
    excerpt: 'Find the best web hosting service for 2025. Compare Bluehost, SiteGround, HostGator, and more. Expert reviews, speed tests, and pricing comparison.',
    category: 'Web Hosting',
    tags: 'web hosting,best hosting,wordpress hosting,hosting comparison,cheap hosting',
    featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    views: 22100,
    published: true,
    created_at: '2025-11-23T12:00:00Z'
  },
  {
    id: 6,
    title: 'How to Invest in Real Estate 2025: Complete Beginner Guide',
    slug: 'how-to-invest-real-estate-2025-guide',
    content: '<h2>Real Estate Investment Strategies</h2><p>Real estate remains one of the most reliable wealth-building strategies. This guide covers proven methods to start investing with any budget level.</p>',
    excerpt: 'Learn how to invest in real estate in 2025. Proven strategies for beginners including rental properties, REITs, house flipping, and Airbnb arbitrage.',
    category: 'Finance',
    tags: 'real estate,real estate investing,property investment,rental property,REITs',
    featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    views: 31200,
    published: true,
    created_at: '2025-11-24T10:00:00Z'
  },
  {
    id: 7,
    title: 'Life Insurance Guide 2025: Term vs Whole Life Explained',
    slug: 'life-insurance-guide-2025',
    content: '<h2>Understanding Life Insurance</h2><p>Life insurance protects your family financially. Term life offers affordable coverage for specific periods. Whole life provides lifetime protection with cash value accumulation.</p>',
    excerpt: 'Compare term vs whole life insurance. Find the best rates and coverage for your family in 2025.',
    category: 'Insurance',
    tags: 'life insurance,term life,whole life,insurance quotes',
    featured_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    views: 8900,
    published: true,
    created_at: '2025-11-24T14:00:00Z'
  },
  {
    id: 8,
    title: 'Business Loan Guide 2025: SBA Loans vs Traditional Banks',
    slug: 'business-loan-guide-2025',
    content: '<h2>Financing Your Business</h2><p>Business loans fuel growth. SBA loans offer favorable terms with government backing. Traditional banks provide fast approval.</p>',
    excerpt: 'Compare business loan options. SBA loans vs traditional banks. Find the best financing for your business.',
    category: 'Finance',
    tags: 'business loans,SBA loans,small business financing',
    featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200',
    views: 14500,
    published: true,
    created_at: '2025-11-24T16:00:00Z'
  },
  {
    id: 9,
    title: 'Bitcoin ETF Guide 2025: How to Invest Safely',
    slug: 'bitcoin-etf-guide-2025',
    content: '<h2>Bitcoin ETF Investing</h2><p>Bitcoin ETFs provide regulated crypto exposure. No wallet required. Trade like stocks. Top ETFs: BlackRock iShares, Fidelity, Grayscale.</p>',
    excerpt: 'Complete Bitcoin ETF guide. Learn how to invest in cryptocurrency through regulated funds.',
    category: 'Cryptocurrency',
    tags: 'bitcoin ETF,crypto investing,bitcoin,cryptocurrency',
    featured_image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200',
    views: 18700,
    published: true,
    created_at: '2025-11-25T08:00:00Z'
  },
  {
    id: 10,
    title: 'Divorce Lawyer Cost 2025: What to Expect',
    slug: 'divorce-lawyer-cost-2025',
    content: '<h2>Divorce Legal Costs</h2><p>Average divorce lawyer costs $200-500/hour. Uncontested divorce: $1,000-5,000. Contested: $15,000-30,000+.</p>',
    excerpt: 'Complete divorce lawyer cost guide. Understand fees, processes, and how to save money.',
    category: 'Legal',
    tags: 'divorce lawyer,divorce cost,family law,legal fees',
    featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
    views: 9800,
    published: true,
    created_at: '2025-11-25T10:00:00Z'
  }
]

// API Routes

// Get all posts (paginated)
app.get('/api/posts', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  const category = c.req.query('category')
  const offset = (page - 1) * limit

  try {
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
  } catch (error) {
    console.error('Error fetching posts:', error)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// Get single post by slug
app.get('/api/posts/:slug', async (c) => {
  const slug = c.req.param('slug')

  try {
    const post = posts.find(p => p.slug === slug && p.published)

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Increment view count (in-memory)
    post.views += 1

    return c.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
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

        <article class="max-w-4xl mx-auto px-4 py-12">
            <img src="${post.featured_image}" alt="${post.title}" class="w-full h-96 object-cover rounded-lg shadow-lg mb-8">
            
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

            <div class="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8 mb-8">
                ${post.content}
            </div>

            <div class="mb-8">
                <h3 class="text-lg font-semibold mb-3">Tags:</h3>
                <div class="flex flex-wrap gap-2">
                    ${post.tags.split(',').map(tag => 
                        `<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">${tag.trim()}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="mt-12">
                <a href="/" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Home
                </a>
            </div>
        </article>

        <footer class="bg-gray-900 text-white py-12 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center text-gray-400">
                <p>&copy; 2025 Expert Reviews. All rights reserved.</p>
            </div>
        </footer>
    </body>
    </html>
  `)
})

// Get categories
app.get('/api/categories', async (c) => {
  try {
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name))
    return c.json(sortedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

// Get popular posts
app.get('/api/posts/popular/top', async (c) => {
  const limit = parseInt(c.req.query('limit') || '5')

  try {
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
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    return c.json({ error: 'Failed to fetch popular posts' }, 500)
  }
})

// Default route - Blog Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>High-Revenue Blog - Insurance, Finance, Crypto & More</title>
        <meta name="description" content="Expert guides on insurance, finance, cryptocurrency, legal services, and web hosting. Maximize your knowledge and savings with our comprehensive reviews.">
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

        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h2 class="text-4xl font-bold mb-4">Expert Guides & Reviews</h2>
                <p class="text-xl opacity-90">Insurance, Finance, Crypto, Legal, Hosting & VPN</p>
            </div>
        </div>

        <!-- Categories -->
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div id="categories" class="flex flex-wrap gap-3 mb-8"></div>
        </div>

        <!-- Posts Grid -->
        <div class="max-w-7xl mx-auto px-4 pb-12">
            <div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            <div id="loading" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        </div>

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
            // Fetch and display categories
            async function loadCategories() {
                try {
                    const response = await axios.get('/api/categories');
                    const categories = response.data;
                    const container = document.getElementById('categories');
                    
                    container.innerHTML = '<button onclick="loadPosts()" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">All</button>' +
                        categories.map(cat => 
                            \`<button onclick="loadPosts('\${cat.name}')" class="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 border">\${cat.name}</button>\`
                        ).join('');
                } catch (error) {
                    console.error('Error loading categories:', error);
                }
            }

            // Fetch and display posts
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
                            <a href="/post/\${post.slug}">
                                <img src="\${post.featured_image}" alt="\${post.title}" class="w-full h-48 object-cover">
                            </a>
                            <div class="p-6">
                                <span class="text-sm text-blue-600 font-semibold">\${post.category}</span>
                                <h3 class="text-xl font-bold mt-2 mb-3">
                                    <a href="/post/\${post.slug}" class="hover:text-blue-600">\${post.title}</a>
                                </h3>
                                <p class="text-gray-600 mb-4">\${post.excerpt}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">
                                        <i class="fas fa-eye mr-1"></i>\${post.views.toLocaleString()} views
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
                    document.getElementById('loading').innerHTML = '<p class="text-red-600">Failed to load posts</p>';
                }
            }

            // Initialize
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

export default app
