
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtujzqzgbwmgwdupseyx.supabase.co';
const supabaseKey = 'sb_publishable_VZhadAXlsVtHNH2Pdcyhjw_MYbd_0jF';

export const supabase = createClient(supabaseUrl, supabaseKey);
