import PostCard from '@/components/PostCard';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
type PostType={
    category: string
    content: string
    created_at: string
    id: number
    preview_image_url: string | null
    tags: string
    title: string
}
type CategoryPostsProps = {
    category: string;
};

export default function CategoryPosts({ category }: CategoryPostsProps) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/categories/${category}`);
                const result = await response.json();
                            const postsArray = result.posts && Array.isArray(result.posts) ? result.posts : [];
                setData(postsArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        console.log(data);
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    return (
        <div className="flex flex-col items-center gap-8 pt-20">
            <h1 className="text-2xl font-medium">[{category}]</h1>
            <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 lg:gap-x-7 lg:gap-y-12">
            {data.map((post: PostType) => (
              <PostCard key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
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
