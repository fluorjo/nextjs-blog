import IconButton from '@/components/IconButton';
import { MarkdownViewer } from '@/components/Markdown';
import { Post } from '@/types';
import { createClient as createUserClient } from '@/utils/supabase/client';
import { createClient } from '@/utils/supabase/server';
import { UserResponse } from '@supabase/supabase-js';
import { format } from 'date-fns';
import {
    GetStaticPaths,
    GetStaticProps,
    InferGetServerSidePropsType,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdOutlineDeleteForever, MdOutlineModeEdit } from 'react-icons/md';

const userSupabase = createUserClient();

const supabase = createClient({});

export const getStaticPaths = (async () => {
    const { data } = await supabase.from('Post').select('id');

    return {
        paths: data?.map(({ id }) => ({ params: { id: id.toString() } })) ?? [],
        fallback: 'blocking',
    };
}) satisfies GetStaticPaths;

type PostProps = Post;

export default function PostPage({
    id,
    title,
    category,
    tags,
    content,
    created_at,
    preview_image_url,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
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

    return (
        <div className="container flex flex-col gap-8 pb-40 pt-20">
            <h1 className={'text-4xl font-bold'}>{title}</h1>
            <div className={' flex justify-between'}>
                <div className="flex flex-row items-center gap-2 ">
                    <Link
                        href={`/categories/${category}`}
                        className={
                            'rounded-md bg-slate-800 px-2 py-1 text-sm text-white'
                        }
                    >
                        {category}
                    </Link>

                    {tags.map((tag) => (
                        <Link
                            href={`/tags/${tag}`}
                            className={
                                'rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500'
                            }
                            key={tag}
                        >
                            {tag}
                        </Link>
                    ))}
                    <div className="text-sm text-gray-500">
                        {format(new Date(created_at), 'yyyy년 M월 d일 HH:mm')}
                    </div>
                </div>
                {!!userResponse?.data.user ? (
                    <div className="flex">
                        <IconButton
                            Icon={MdOutlineModeEdit}
                            component={Link}
                            label='editPostLink'
                            href={`/posts/modify/${id}`}
                            className={`text-gray-500 hover:text-gray-600 `}
                            />
                        <IconButton
                            Icon={MdOutlineDeleteForever}
                            label='deletePostLink'
                            onClick={deletePost}
                            className={'text-gray-500 hover:text-gray-600'}
                        />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            {preview_image_url && (
                <Image
                    src={preview_image_url}
                    alt={title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={'h-auto w-full'}
                />
            )}
            <MarkdownViewer source={content} className={' min-w-full'} />
        </div>
    );
}

export const getStaticProps = (async (context) => {
    const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('id', Number(context.params?.id));

    console.log(data);
    if (!data || !data[0]) {
        return { notFound: true };
    }
    const {
        id,
        title,
        category,
        tags,
        content,
        created_at,
        preview_image_url,
    } = data[0];
    return {
        props: {
            id,
            title,
            category,
            tags: JSON.parse(tags) as string[],
            content,
            created_at,
            preview_image_url,
        },
    };
}) satisfies GetStaticProps<Post>;