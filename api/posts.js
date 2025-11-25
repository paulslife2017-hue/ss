const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://wvofyxbwsmtmbfnlygsx.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2b2Z5eGJ3c210bWJmbmx5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxODUwNDUsImV4cCI6MjA0Nzc2MTA0NX0.vR_dqhCHEqU7bGwJdHOtYZzE1I-vPPiXNXAa3xAkG7Q';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const category = req.query.category;
    const offset = (page - 1) * limit;

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

    return res.status(200).json({
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
    return res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
};
