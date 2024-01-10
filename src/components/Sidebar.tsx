import { cn } from '@/utils/style';
import Link from 'next/link';
import { FC } from 'react';
import { AiFillGithub, AiOutlineClose } from 'react-icons/ai';

type SidebarProps = {
    close: () => void;
    isOpen: boolean;
};

const Sidebar: FC<SidebarProps> = ({ close, isOpen }) => {
    return (
        <div
            className={cn(
                'absolute min-h-screen flex-col gap-6 border-r bg-white pl-10 pr-6 text-base lg:relative',
                isOpen ? 'flex' : 'hidden',
            )}
        >
            <div className={'flex justify-end lg:hidden'}>
                <AiOutlineClose className={'h-5 w-5'} onclick={close} />
            </div>
            <Link
                href={'/'}
                className="w-48 font-medium text-gray-600 hover:underline"
            >
                HOME
            </Link>
            <Link
                href={'/tag'}
                className="w-48 font-medium text-gray-600 hover:underline"
            >
                TAG
            </Link>
            <Link
                href={'/category/dummy'}
                className="w-48 font-medium text-gray-600 hover:underline"
            >
                WEB
            </Link>
            <div className="mt-10 flex items-center gap-4">
                <Link href={'https://github.com/fluorjo'} target="_blank">
                    <AiFillGithub className={'h-6 w-6'}></AiFillGithub>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
