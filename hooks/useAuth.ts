'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { user };
};
