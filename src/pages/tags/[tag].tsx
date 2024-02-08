import PostList from '@/components/PostList';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

type TagPostsProps = {
    tag: string;
};

export const getStaticPaths = (async () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
    return {
        props: {
            tag: context.params?.tag as string,
        },
    };
}) satisfies GetStaticProps<TagPostsProps>;



export default function TagPosts({ tag }: TagPostsProps) {
    return <PostList tag={tag} />;
}
