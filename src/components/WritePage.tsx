'use client'
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MarkdownEditor } from '@/components/Markdown';
import { useCategories, useTags } from '@/utils/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import ReactSelect from 'react-select/creatable';

export default function WritePage() {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { data: existingCategories } = useCategories();
    const { data: existingTags } = useTags();
    
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('[]');
    const [content, setContent] = useState('');
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!titleRef.current?.value || titleRef.current.value.length === 0)
            return alert('제목 입력 필요');
        if (category.length === 0) return alert('카테고리 입력 필요');
        if (tags.length === 0) return alert('태그 입력 필요');
        if (content.length === 0) return alert('내용 입력 필요');

        const formData = new FormData();

        formData.append('title', titleRef.current?.value ?? '');
        formData.append('category', category);
        formData.append('tags', tags);
        formData.append('content', content);

        if (fileRef.current?.files?.[0]) {
            formData.append('preview_image', fileRef.current.files[0]);
        }

        const response = await fetch('/api/posts', {
            method: 'POST',
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
            <h1 className={'mb-8 text-2xl font-medium'}>새 글</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <Input type="text" placeholder="제목" ref={titleRef} />
                    <Input type="file" accept="image/*" ref={fileRef} />
                    <ReactSelect
                        options={(existingCategories ?? []).map((category) => ({
                            label: category,
                            value: category,
                        }))}
                        inputId='category'
                        placeholder="카테고리"
                        onChange={(e) => e && setCategory(e.value)}
                        isMulti={false}
                    />
                    <ReactSelect
                        options={(existingTags ?? []).map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                        onChange={(e) =>
                            e && setTags(JSON.stringify(e.map((e) => e.value)))
                        }
                        inputId='tags'
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
                    작성하기
                </Button>
            </form>
        </div>
    );
}
