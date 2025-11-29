import { createClient } from "@supabase/supabase-js";
import type { Rsvp } from "@/lib/types";

// Note: supabase-js is bugged and requires the database schema to be passed
// https://github.com/supabase/supabase-js/issues/733
// In our case we are creating a rsvps table with the following columns:
// id: uuid (primary key)
// created_at: timestamp
// name: text
// email: text
// special_requests: text
type Database = {
  public: {
    Tables: {
      rsvps: {
        Row: Rsvp;
        Insert: Omit<Rsvp, "id" | "created_at">;
        Update: Partial<Omit<Rsvp, "id" | "created_at">>;
      };
    };
  };
};

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
