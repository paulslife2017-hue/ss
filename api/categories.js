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

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};
