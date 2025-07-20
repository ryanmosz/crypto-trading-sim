// Authentication module for crypto-trading-sim
// Handles Supabase auth operations

// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Note: In production, these should come from a secure source
// For now, you'll need to replace these with your actual keys
const SUPABASE_URL = 'https://yuobwpszomojorrjiwlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2J3cHN6b21vam9ycmppd2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODI1MDQsImV4cCI6MjA2ODU1ODUwNH0.3ee0zwMXcl4-zlv5sn0gKyJ7BDjtKTVLbL73Qj6eNJs';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth functions
export const auth = {
  // Sign up new user
  async signUp(email, password, username) {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            username: username || email.split('@')[0] 
          }]);
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  },
  
  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  },
  
  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  
  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// Game data functions
export const gameData = {
  // Save a past run
  async savePastRun(scenarioKey, allocations, finalValue) {
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('past_runs')
      .insert([{
        user_id: user.id,
        scenario_key: scenarioKey,
        allocations: allocations,
        final_value: finalValue,
        finished_at: new Date().toISOString()
      }])
      .select();
      
    return { data, error };
  },
  
  // Get user's past runs
  async getPastRuns() {
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('past_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('finished_at', { ascending: false });
      
    return { data, error };
  },
  
  // Submit a "Now" mode entry
  async submitNowEntry(allocations, startPrices) {
    const user = await auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('now_entries')
      .insert([{
        user_id: user.id,
        allocations: allocations,
        start_prices: startPrices,
        created_at: new Date().toISOString()
      }])
      .select();
      
    return { data, error };
  },
  
  // Get current leaderboard
  async getLeaderboard(limit = 100) {
    const { data, error } = await supabase
      .from('now_leaderboard')
      .select('*')
      .limit(limit);
      
    return { data, error };
  }
};

// Create Auth class wrapper
export class Auth {
  constructor() {
    this.supabase = supabase;
  }
  
  async signUp(email, password) {
    return auth.signUp(email, password);
  }
  
  async signIn(email, password) {
    return auth.signIn(email, password);
  }
  
  async signOut() {
    return auth.signOut();
  }
  
  async getCurrentUser() {
    return auth.getCurrentUser();
  }
  
  // Add any other methods as needed
}

// Also export the auth object for backward compatibility
export { auth }; 