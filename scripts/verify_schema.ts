import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const REQUIRED_TABLES = [
    'profiles',
    'grievances',
    'departments',
    'feedback',
    'audit_logs',
    'broadcasts',
    'notifications'
];

async function verifySchema() {
    console.log('🔍 Verifying Database Schema...');

    let allPassed = true;

    for (const table of REQUIRED_TABLES) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            console.error(`❌ Table '${table}' check failed:`, error.message);
            allPassed = false;
        } else {
            console.log(`✅ Table '${table}' exists and is accessible.`);
        }
    }

    if (allPassed) {
        console.log('\n✨ Schema Verification Passed! All tables exist.');
    } else {
        console.error('\n⚠️ Schema Verification Failed. Please run missing migrations.');
        process.exit(1);
    }
}

verifySchema();
