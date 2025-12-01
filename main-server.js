import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Main homepage
app.get('/', (c) => {
  return c.html(require('fs').readFileSync('./index.html', 'utf-8'));
});

// Admin page
app.get('/admin', (c) => {
  return c.html(require('fs').readFileSync('./admin.html', 'utf-8'));
});

// API endpoints for services (placeholder - can be expanded later)
app.get('/api/services', (c) => {
  return c.json({
    beauty: [
      {
        id: 1,
        name: 'Gangnam Head Spa',
        price: 150000,
        duration: 90,
        location: 'Gangnam',
        description: 'Premium scalp treatment combining deep cleansing, massage therapy, and nourishing care.'
      },
      {
        id: 2,
        name: 'Korean Lip Tattoo',
        price: 300000,
        duration: 120,
        location: 'Apgujeong',
        description: 'Semi-permanent lip blushing with natural gradient effect.'
      },
      {
        id: 3,
        name: 'Glass Skin Facial',
        price: 180000,
        duration: 60,
        location: 'Cheongdam',
        description: 'Achieve the coveted Korean glass skin look with our signature facial treatment.'
      }
    ],
    tours: [
      {
        id: 1,
        name: 'Gangnam Beauty Day',
        price: 450000,
        duration: 480,
        maxPeople: 6,
        description: 'Full-day experience including head spa, lunch at trendy café, K-beauty shopping in Gangnam.'
      },
      {
        id: 2,
        name: 'K-Beauty Shopping Tour',
        price: 180000,
        duration: 240,
        maxPeople: 8,
        description: 'Guided tour through Myeongdong & Hongdae with personal beauty consultant.'
      },
      {
        id: 3,
        name: 'Traditional Meets Modern',
        price: 350000,
        duration: 360,
        maxPeople: 8,
        description: 'Visit Bukchon Hanok Village, traditional Korean spa experience, and modern K-beauty clinic.'
      }
    ],
    products: [
      {
        id: 1,
        name: 'Premium Skincare Set',
        price: 250000,
        stock: 45,
        category: 'skincare',
        description: 'Complete 10-step Korean skincare routine including cleanser, toner, essence, serum, moisturizer, and sunscreen.'
      },
      {
        id: 2,
        name: 'Sheet Mask Collection',
        price: 80000,
        stock: 128,
        category: 'masks',
        description: '30-piece collection featuring bestselling Korean sheet masks.'
      },
      {
        id: 3,
        name: 'K-Beauty Travel Kit',
        price: 60000,
        stock: 8,
        category: 'sets',
        description: 'Travel-sized essentials perfect for trying Korean skincare or taking on trips.'
      }
    ]
  });
});

// Booking endpoint (placeholder)
app.post('/api/booking', async (c) => {
  const body = await c.req.json();
  console.log('New booking:', body);
  
  return c.json({
    success: true,
    message: 'Booking received! We will contact you shortly.',
    bookingId: 'BK' + Date.now()
  });
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found | K-Beauty Seoul</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
        }
        h1 {
          font-size: 120px;
          margin: 0;
          text-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        p {
          font-size: 24px;
          margin: 20px 0 40px;
        }
        a {
          display: inline-block;
          padding: 16px 40px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          transition: transform 0.3s;
        }
        a:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <h1>404</h1>
      <p>Page not found</p>
      <a href="/">Back to Home</a>
    </body>
    </html>
  `);
});

const port = 3000;
console.log(`🚀 K-Beauty Seoul Platform Starting...`);
console.log(`📍 Server running on http://localhost:${port}`);
console.log(`🏠 Homepage: http://localhost:${port}/`);
console.log(`⚙️  Admin: http://localhost:${port}/admin`);
console.log(`🌐 API: http://localhost:${port}/api/services`);
console.log(`\n✨ Features:`);
console.log(`   - Airbnb-style mobile-first UI`);
console.log(`   - 3 sections: Beauty Services, Tours, Shop`);
console.log(`   - Multilingual: English, Japanese, Traditional Chinese`);
console.log(`   - Video + Description + Booking links`);
console.log(`   - Admin panel for management`);

serve({
  fetch: app.fetch,
  port
});
