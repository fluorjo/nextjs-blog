import PostList from '@/components/PostList';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type CategoryPostsProps = {
    category: string;
};

export default function CategoryPosts({ category }: CategoryPostsProps) {
    const router = useRouter();
    useEffect(() => {
        // 클라이언트 측에서 페이지 이동 시 데이터를 갱신
        if (router.query.category !== category) {
            

        }
    }, [router.query.category, category]);
    return <PostList category={category} />;
}

export const getServerSideProps: GetServerSideProps<
    CategoryPostsProps
> = async ({ query }) => {
    return {
        props: {
            category: query.category as string,
        },
    };
};
