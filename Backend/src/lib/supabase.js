import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// Service-role client — bypasses RLS for backend operations
// ws provided explicitly for Node.js < 22 compatibility
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws },
  }
);

export default supabase;
