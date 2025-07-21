# Next Steps: Phase 1 - Database & Security

## Relevant Files

- `supabase/migrations/005_multiplayer_support.sql` - Migration for game_code column and indexes (to be created)
- `supabase/migrations/002_core_tables.sql` - Existing core tables that need modification
- `supabase/migrations/003_multiplayer_tables.sql` - Existing multiplayer tables to verify
- `.env.example` - Environment variables template (may need updates)
- `crypto-trader/public/auth.js` - Authentication module that will interact with new policies
- `docs/database-schema.md` - Database documentation (to be updated)

## Objective

Add database columns and Row-Level Security (RLS) policies required for multiplayer support. This phase implements the foundation for game codes, multiplayer flags, and participant tracking as outlined in the Future Multiplayer Plan Phase 1.

## Tasks

- [x] 1.0 Create and Apply Migration 005
  - [x] 1.1 Create new migration file `supabase/migrations/005_multiplayer_support.sql`
  - [x] 1.2 Add ALTER TABLE statement for `active_games` table with game_code column
  - [x] 1.3 Add CREATE INDEX statement for `game_code` unique index
  - [x] 1.4 Test migration locally using Supabase CLI
  - [x] 1.5 Apply migration to development database

- [x] 2.0 Verify Existing Tables
  - [x] 2.1 Check that `game_participants` table exists from migration 003
  - [x] 2.2 Verify all required columns are present in `game_participants`
  - [x] 2.3 Confirm indexes exist on `game_participants` table
  - [x] 2.4 Document current table structure before modifications

- [x] 3.0 Implement Row-Level Security Policies
  - [x] 3.1 Create RLS policy for public viewing of open multiplayer games
  - [x] 3.2 Create RLS policy for game owner management permissions
  - [x] 3.3 Create RLS policies for `game_participants` table (already exist from migration 003)
  - [x] 3.4 Test RLS policies with different user roles
  - [x] 3.5 Ensure existing single-player game policies still work

- [x] 4.0 Test Database Changes
  - [x] 4.1 Create test multiplayer game record with game_code
  - [x] 4.2 Verify game_code uniqueness constraint works
  - [x] 4.3 Test participant count increment/decrement logic
  - [x] 4.4 Confirm RLS policies enforce proper access control
  - [x] 4.5 Run full regression test on existing game functionality

- [x] 5.0 Update Documentation
  - [x] 5.1 Update database schema documentation with new columns
  - [x] 5.2 Document RLS policies and their purposes
  - [x] 5.3 Add migration notes to deployment documentation
  - [x] 5.4 Update .env.example if new environment variables needed (no changes needed)
  - [x] 5.5 Create brief multiplayer database design document

## Success Criteria

- Migration 005 successfully applied to database
- `active_games` table has new column: `game_code` (is_multiplayer and participant_count already exist)
- Unique index exists on `game_code` column
- `game_participants` table exists and is properly structured
- RLS policies allow public viewing of open multiplayer games
- RLS policies restrict game management to owners
- All existing functionality remains intact
- Database schema documentation is updated

## Notes

- This phase focuses purely on database structure - no frontend or backend code changes
- The 4-character game code will use mixed-case alphanumeric (36^4 = 1,679,616 combinations)
- RLS policies must be carefully tested to ensure security while maintaining functionality
- Consider running migrations on a test database first before production

## Phase 1 Completion Summary

**Date Completed**: July 21, 2025

All tasks have been successfully completed! The database is now ready for multiplayer support with:
- Migration 005 applied with game_code column
- RLS policies protecting data while allowing public multiplayer game discovery
- All existing functionality tested and working
- Comprehensive documentation created

The project is now ready for Phase 2 - Backend Functions to implement the Edge Functions for game creation, joining, and price updates. 