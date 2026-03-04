-- Check if database exists and create if needed
CREATE DATABASE IF NOT EXISTS training_platform;
USE training_platform;

-- Show all tables
SHOW TABLES;

-- Check if sponsorships table exists and show its structure
DESCRIBE sponsorships;

-- Count records in each table
SELECT 'sponsors' as table_name, COUNT(*) as count FROM sponsors
UNION ALL
SELECT 'contracts' as table_name, COUNT(*) as count FROM contracts
UNION ALL
SELECT 'sponsorships' as table_name, COUNT(*) as count FROM sponsorships;

-- Check sponsorship statuses
SELECT status, COUNT(*) as count 
FROM sponsorships 
GROUP BY status;

-- Show sample sponsorship data
SELECT id, status, amount_allocated, created_at, contract_id 
FROM sponsorships 
LIMIT 10;