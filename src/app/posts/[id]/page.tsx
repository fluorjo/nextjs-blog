/* eslint-disable react-hooks/rules-of-hooks */
import PostPage from '@/components/PostPage';
import { createClient as createUserClient } from '@/utils/supabase/client';
import { createClient } from '@/utils/supabase/server';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const userSupabase = createUserClient();

export const generateStaticParams = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('Post').select('id');
    
    return data?.map(({ id }) => ({ params: { id: id.toString() } })) ?? [];
};

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
            await userSupabase.from('Post').delete().match({ id: params.id });
            alert('ok');
            // alert(id)
        } catch (error) {
            alert('error');
        }
        router.push('/');
    };

    return <PostPage {...rest} tags={JSON.parse(tags) as string[]} />;
}
