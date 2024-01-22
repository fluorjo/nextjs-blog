import { Post } from '@/types';
import type { StorageError } from '@supabase/storage-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cn } from '@/utils/style';
import { createClient } from '@/utils/supabase/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const supabase = createClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const {
        query: {category},
        method,
        body,
    } = req; 

    const posts = await fetchPostsByCategory(Array.isArray(category) ? category[0] : category || '');

     res.status(200).json({ posts });
}

async function fetchPostsByCategory(category: string) {
    const { data } = await supabase
      .from('Post')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
  
    return data || [];
  }

