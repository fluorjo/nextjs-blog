import Button from '@/components/Button';
import Input from '@/components/Input';
import { MarkdownEditor } from '@/components/Markdown';
import { Post } from '@/types';
import { useCategories, useTags } from '@/utils/hooks';
import { createClient } from '@/utils/supabase/server';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';
import ReactSelect from 'react-select/creatable';

type PostProps = Post;

export default function ModifyPost({
    id,
    title,
    category: initialCategory,
    tags: initialTags,
    content: initialContent,
    created_at,
    preview_image_url,
}: PostProps) {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { data: existingCategories } = useCategories();
    const { data: existingTags } = useTags();

    const [category, setCategory] = useState(initialCategory);
    const [tags, setTags] = useState(initialTags);
    const [content, setContent] = useState(initialContent);

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!titleRef.current?.value || titleRef.current.value.length === 0)
            return alert('제목 입력 필요');
        if (category.length === 0) return alert('카테고리 입력 필요');
        if (tags.length === 0) return alert('태그 입력 필요');
        if (content.length === 0) return alert('내용 입력 필요');

        const formData = new FormData();

        formData.append('title', titleRef.current?.value ?? '');
        formData.append('category', category);
        // formData.append('tags', tags.join(','));
        formData.append('content', content);

        if (fileRef.current?.files?.[0]) {
            formData.append('preview_image', fileRef.current.files[0]);
        }

        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData,
        });
        const data = await response.json();
        if (data.id) router.push(`/posts/${data.id}`);
    };
    return (
        <div className={'container flex flex-col pb-20 pt-12'}>
            <h1 className={'mb-8 text-2xl font-medium'}>글 수정</h1>
            <form onSubmit={handleUpdate}>
                <div className="flex flex-col gap-3">
                    <Input type="text" value={title} ref={titleRef} />
                    <Input type="file" accept="image/*" ref={fileRef} />
                    <ReactSelect
                        options={(existingCategories ?? []).map((category) => ({
                            label: category,
                            value: category,
                        }))}
                        placeholder="카테고리"
                        // value={category}
                        value={
                            category
                                ? { label: category, value: category }
                                : null
                        }
                        onChange={(e) => e && setCategory(e.value)}
                        isMulti={false}
                    />
                    <ReactSelect
                        options={(existingTags ?? []).map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                        onChange={(e) => e && setTags(e.map((e) => e.value))}
                        defaultValue={(tags ?? []).map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                        placeholder="태그"
                        isMulti
                    />
                    <MarkdownEditor
                        height={500}
                        value={content}
                        onChange={(s) => setContent(s ?? '')}
                    />
                </div>
                <Button type="submit" className={'mt-4 w-full'}>
                    수정하기
                </Button>
            </form>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    query,
    req,
}) => {
    const { id } = query;

    const supabase = createClient(req.cookies);

    const { data } = await supabase
        .from('Post')
        .select('*')
        .eq('id', Number(id));

    console.log(data);
    if (!data || !data[0]) {
        return { notFound: true };
    }
    const { title, category, tags, content, created_at, preview_image_url } =
        data[0];
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
};
