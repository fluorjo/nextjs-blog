import { MarkdownEditor } from '@/components/Markdown';
import { createClient } from '@/utils/supabase/server';
import { GetServerSideProps } from 'next';
import ReactSelect from 'react-select/creatable';

type WriteProps = {
    existingTags: string[];
    existingCategories: string[];
};
export default function Write({
    existingTags,
    existingCategories,
}: WriteProps) {
    return (
        <div className={'container mx-auto flex flex-col px-4 pb-20 pt-12'}>
            <h1 className={'mb-8 text-2xl font-medium'}>새 글</h1>
            <form action="">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="제목"
                        className={
                            'rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400'
                        }
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className={
                            'rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400'
                        }
                    />
                    <ReactSelect
                        options={existingCategories.map((categoty) => ({
                            label: categoty,
                            value: categoty,
                        }))}
                        placeholder="카테고리"
                        isMulti={false}
                    />
                    <ReactSelect
                        options={existingTags.map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                        placeholder="태그"
                        isMulti={true}
                    />
                    <MarkdownEditor height={500} />
                </div>
                <button
                    type="submit"
                    className={
                        'mt-4 w-full rounded-md bg-gray-800 py-2 text-white'
                    }
                >
                    작성하기
                </button>
            </form>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<WriteProps> = async ({
    req,
}) => {
    const supabase = createClient(req.cookies);
    const { data } = await supabase.from('Post').select('category,tags')

    return {
        props: {
            existingCategories: Array.from(
                new Set(data?.map((d) => d.category))
            ),
            existingTags: Array.from(
                new Set(data?.flatMap((d) => JSON.parse(d.tags)))),
        },
    };
};
