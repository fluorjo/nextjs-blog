import PostList from '@/components/PostList';
import { Post } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

type PostType = {
    category: string;
    content: string;
    created_at: string;
    id: number;
    preview_image_url: string | null;
    tags: string;
    title: string;
};
type CategoryPostsProps = {
    category: string;
    posts: Post[];
};
const supabase = createClient({});

export const getStaticPaths = (async () => {
    const { data } = await supabase.from('Post').select('category');
    const categories = Array.from(new Set(data?.map((d) => d.category)));

    return {
        paths: categories.map((category) => ({ params: { category } })),
        fallback: 'blocking',
    };
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
    const category = context.params?.category as string;
    const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('category', category);
    return {
        props: {
            category,
            posts:
                data?.map((post) => ({
                    ...post,
                    tags: JSON.parse(post.tags) as string[],
                })) ?? [],
        },
    };
}) satisfies GetStaticProps<CategoryPostsProps>;

export default function CategoryPosts({
    category,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return <PostList category={category} />;

    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/api/categories/${category}`);
    //             const result = await response.json();
    //             const postsArray =
    //                 result.posts && Array.isArray(result.posts)
    //                     ? result.posts
    //                     : [];
    //             setData(postsArray);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     console.log(data);
    //     fetchData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [category]);

    // return (
    //     <div className="flex flex-col items-center gap-8 pt-20">
    //         <h1 className="text-2xl font-medium">[{category}]</h1>
    //         <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 lg:gap-x-7 lg:gap-y-12">
    //             {data.map((post: PostType) => (
    //                 <PostCard key={post.id} {...post} />
    //             ))}
    //         </div>
    //     </div>
    // );
}
// export const getServerSideProps: GetServerSideProps<
//     CategoryPostsProps
// > = async ({ query }) => {
//     return {
//         props: {
//             category: query.category as string,
//         },
//     };
// };
