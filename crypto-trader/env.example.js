// Example environment configuration
// Copy this file to env.js and fill in your actual values
// DO NOT commit env.js to version control!

const ENV = {
  // Your Supabase project URL
  SUPABASE_URL: 'https://yuobwpszomojorrjiwlp.supabase.co' ,
  
  // Your Supabase anonymous (public) key
  SUPABASE_ANON_KEY:   'YOUR_ANON_KEY_HERE',
  
  // Your Supabase service role key (keep this secret!)
  // Only use this for server-side operations
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV;
} 