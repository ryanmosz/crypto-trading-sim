// Example environment configuration
// Copy this file to env.js and fill in your actual values
// DO NOT commit env.js to version control!

const ENV = {
  // Your Supabase project URL
  SUPABASE_URL: 'https://your-project.supabase.co',
  
  // Your Supabase anonymous (public) key
  SUPABASE_ANON_KEY: 'your-anon-key-here',
  
  // Your Supabase service role key (keep this secret!)
  // Only use this for server-side operations
  SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key-here'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV;
} 