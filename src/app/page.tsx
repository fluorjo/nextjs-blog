import PostList from '@/components/PostList';
import { Post } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { GetStaticProps } from 'next';
import { cookies } from 'next/headers';

export default async function Home() {
    const supabase = createClient(cookies());
    const { data } = await supabase.from('Post').select('*');

    return (
        <PostList
            initialPosts={data?.map((post) => ({
                ...post,
                tags: JSON.parse(post.tags) as string[],
            }))}
        />
    );
}
