import PostPage from '@/components/PostPage';
import { Post } from '@/types';
import { createClient as createUserClient } from '@/utils/supabase/client';
import { createClient } from '@/utils/supabase/server';
import { UserResponse } from '@supabase/supabase-js';
import { GetStaticPaths, GetStaticProps } from 'next';
import { cookies } from 'next/headers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const userSupabase = createUserClient();

export const getStaticPaths = async () => {
    const { data } = await supabase.from('Post').select('id');

    return {
        paths: data?.map(({ id }) => ({ params: { id: id.toString() } })) ?? [],
        fallback: 'blocking',
    };
}


export default async function Post({ params }: { params: { id: string } }) {
    const supabase = createClient(cookies());
    const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('id', Number(params?.id));
    if (!data || !data[0]) {
        return { notFound: true };
    }
    const { tags, ...rest } = data[0];

    const [userResponse, setUserResponse] = useState<UserResponse>();

    useEffect(() => {
        (async () => {
            const user = await userSupabase.auth.getUser();
            setUserResponse(user);
        })();
    }, []);
    const router = useRouter();

    const deletePost = async () => {
        try {
            await userSupabase.from('Post').delete().match({ id: id });
            alert('ok');
            // alert(id)
        } catch (error) {
            alert('error');
        }
        router.push('/');
    };

    return <PostPage {...rest} tags={JSON.parse(tags) as string[]}/>;
}

