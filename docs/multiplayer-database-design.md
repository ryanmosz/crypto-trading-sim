# Multiplayer Database Design

## Overview

This document describes the database schema and security policies for the multiplayer functionality in the Crypto Trading Simulator.

## Tables

### active_games

The main table for tracking all ongoing games (both single-player and multiplayer).

#### Columns

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Game creator's user ID |
| started_at | TIMESTAMPTZ | When the game started |
| ends_at | TIMESTAMPTZ | When the game will end |
| duration_days | INTEGER | Game duration (30, 60, or 90 days) |
| allocations | JSONB | Initial crypto allocations |
| starting_prices | JSONB | Crypto prices at game start |
| starting_money | NUMERIC | Starting amount ($10M) |
| current_prices | JSONB | Latest crypto prices |
| current_value | NUMERIC | Current portfolio value |
| last_updated | TIMESTAMPTZ | Last price update time |
| is_complete | BOOLEAN | Whether game has ended |
| final_value | NUMERIC | Final portfolio value |
| completed_at | TIMESTAMPTZ | When game ended |
| created_at | TIMESTAMPTZ | When record was created |
| is_multiplayer | BOOLEAN | Whether this is a multiplayer game |
| participant_count | INTEGER | Number of participants |
| **game_code** | TEXT | **4-character unique code for joining (NEW)** |

#### Indexes

- Primary key: `id`
- Foreign key: `user_id` → `auth.users(id)`
- Unique index: `game_code` (for fast multiplayer game lookups)

### game_participants

Junction table for tracking all participants in multiplayer games.

#### Columns

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| game_id | UUID | Reference to active_games |
| user_id | UUID | Participant's user ID |
| allocations | JSONB | Player's crypto allocations |
| starting_value | NUMERIC | Starting portfolio value |
| current_value | NUMERIC | Current portfolio value |
| joined_at | TIMESTAMPTZ | When player joined |
| is_original_creator | BOOLEAN | Whether this is the game creator |

#### Indexes

- Primary key: `id`
- Foreign keys: 
  - `game_id` → `active_games(id)` ON DELETE CASCADE
  - `user_id` → `auth.users(id)` ON DELETE CASCADE
- Unique constraint: `(game_id, user_id)` - one entry per user per game
- Index: `game_id` for fast game lookups
- Index: `user_id` for fast user lookups

## Row Level Security (RLS) Policies

### active_games Policies

1. **Public can view open multiplayer games**
   - Command: SELECT
   - Logic: Anyone can see multiplayer games that aren't complete, OR their own games
   - SQL: `(is_multiplayer = true AND is_complete = false) OR (auth.uid() = user_id)`

2. **Authenticated users can create games**
   - Command: INSERT
   - Logic: Users can only create games with their own user_id
   - SQL: `auth.uid() = user_id`

3. **Game owners can update their games**
   - Command: UPDATE
   - Logic: Only the game creator can update their game
   - SQL: `auth.uid() = user_id`

4. **Game owners can delete their games**
   - Command: DELETE
   - Logic: Only the game creator can delete their game
   - SQL: `auth.uid() = user_id`

### game_participants Policies

1. **Users can view game participants**
   - Command: SELECT
   - Logic: Users can see participants in games they're in or public multiplayer games
   - Complex policy checking game ownership or multiplayer status

2. **Users can join games**
   - Command: INSERT
   - Logic: Users can only add themselves as participants
   - SQL: `auth.uid() = user_id`

3. **Users can update own participation**
   - Command: UPDATE
   - Logic: Users can only update their own participant records
   - SQL: `auth.uid() = user_id`

## Game Code Design

- Format: 4 characters, mixed-case alphanumeric (A-Z, a-z, 0-9)
- Total combinations: 62^4 = 14,776,336
- Example: `A7bQ`, `X2mP`, `9ZkL`
- Purpose: Easy to share and type for joining multiplayer games

## Migration History

- Migration 001: Created auth profiles
- Migration 002: Created core tables (past_runs, now_entries, etc.)
- Migration 003: Created multiplayer tables and added is_multiplayer column
- Migration 004: Added public usernames functionality
- **Migration 005: Added game_code column and updated RLS policies** 