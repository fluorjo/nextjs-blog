'use client';
import { useCategories } from '@/utils/hooks';
import { cn } from '@/utils/style';
import Link from 'next/link';
import { FC } from 'react';
import { AiFillGithub, AiOutlineClose } from 'react-icons/ai';
import IconButton from './IconButton';
import { useSidebar } from './Providers';

const Sidebar: FC = () => {
    const { isOpen, setIsOpen } = useSidebar();

    const { data: existingCategories } = useCategories();
    return (
        <div
            className={cn(
                'absolute z-10 min-h-screen flex-col gap-6 border-r bg-white pl-10 pr-6 text-base lg:relative',
                isOpen ? 'flex' : 'hidden',
            )}
        >
            <div className={'flex justify-end lg:hidden'}>
                <IconButton
                    Icon={AiOutlineClose}
                    onClick={() => setIsOpen(false)}
                    label="sidebarClose"
                />
            </div>
            <Link
                href={'/'}
                className="w-48 font-medium text-gray-600 hover:underline"
            >
                HOME
            </Link>
            <Link
                href={'/tags'}
                className="w-48 font-medium text-gray-600 hover:underline"
            >
                TAG
            </Link>
            {existingCategories?.map((category) => (
                <Link
                    key={category}
                    href={`/categories/${category}`}
                    className="w-48 font-medium text-gray-600 hover:underline"
                >
                    {category}
                </Link>
            ))}
            <div className="mt-10 flex items-center gap-4">
                <IconButton
                    Icon={AiFillGithub}
                    component={Link}
                    label="githubLink"
                    href={'https://github.com/fluorjo'}
                    target="_blank"
                />
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                    src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fgjbae1212%2Fhit-counter&count_bg=%23000000&title_bg=%23A5A5A5&icon=ethereum.svg&icon_color=%23FFFFFF&title=%EB%B0%A9%EB%AC%B8%EC%9E%90&edge_flat=true"
                    alt="방문자 뱃지"
                />
            </div>
        </div>
    );
};

export default Sidebar;
