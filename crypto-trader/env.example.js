// Example environment configuration
// Copy this file to env.js and fill in your actual values
// DO NOT commit env.js to version control!

const ENV = {
  // Your Supabase project URL
  SUPABASE_URL: 'https://yuobwpszomojorrjiwlp.supabase.co' ,
  
  // Your Supabase anonymous (public) key
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2J3cHN6b21vam9ycmppd2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODI1MDQsImV4cCI6MjA2ODU1ODUwNH0.3ee0zwMXcl4-zlv5sn0gKyJ7BDjtKTVLbL73Qj6eNJs',
  
  // Your Supabase service role key (keep this secret!)
  // Only use this for server-side operations
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV;
} 