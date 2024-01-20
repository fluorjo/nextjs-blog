import { Post, postRequest } from '@/types';
import { createClient } from '@/utils/supabase/server';
import type { StorageError } from '@supabase/storage-js';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Post | StorageError>,
) {
    const {
        query: { id },
        method,
        body,
    } = req;

    if (req.method !== 'PUT') return res.status(405).end();

    const form = formidable();
    const [fields, files] = await form.parse(req);

    let preview_image_url: string | null = null;

    const supabase = await createClient(req.cookies);

    const postId = req.query.id; 
    const { data: existingData } = await supabase
        .from('Post')
        .select('*')
        .eq('id', Number(postId));

    console.log(postId);
    if (!existingData || existingData.length !== 1) {
        return res.status(404).end(); 
    }

    if (files.preview_image?.length === 1) {
        const file = files.preview_image[0];
        const fileContent = await readFileSync(file.filepath);
        const fileName = `${file.newFilename}_${file.originalFilename}`;
        const { data: uploadData, error } = await supabase.storage
            .from('blog-image')
            .upload(fileName, fileContent, {
                contentType: file.mimetype ?? undefined,
            });
        if (error) {
            res.status(403).json(error);
        }
        if (uploadData?.path) {
            const { data } = await supabase.storage
                .from('blog-image')
                .getPublicUrl(uploadData.path);
            preview_image_url = data.publicUrl;
        }
    }
    const { title, category, tags, content } = fields;
    const updatedPostData = {
        title: title?.[0] || existingData[0].title,
        category: category?.[0] || existingData[0].category,
        tags: tags?.[0] || existingData[0].tags,
        content: content?.[0] || existingData[0].content,
        preview_image_url: preview_image_url || existingData[0].preview_image_url,
    } as postRequest;

    const { data } = await supabase.from('Post').update(updatedPostData).eq('id', Number(postId)).select();

    if (data && data.length === 1) {
        const { tags, ...reset } = data[0];
        res.status(200).json({
            ...reset,
            tags: JSON.parse(tags) as string[],
        });
    } else {
        res.status(500).end();
    }
}
export const config = {
    api: {
        bodyParser: false,
    },
};
