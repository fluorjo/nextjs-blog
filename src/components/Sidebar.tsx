import { cn } from '@/utils/style';
import Link from 'next/link';
import { FC } from 'react';
import { AiFillGithub, AiOutlineClose } from 'react-icons/ai';
import IconButton from './IconButton';

type SidebarProps = {
    close: () => void;
    isOpen: boolean;
};

const Sidebar: FC<SidebarProps> = ({ close, isOpen }) => {
    return (
        <div
            className={cn(
                'absolute z-10 min-h-screen flex-col gap-6 border-r bg-white pl-10 pr-6 text-base lg:relative',
                isOpen ? 'flex' : 'hidden',
            )}
        >
            <div className={'flex justify-end lg:hidden'}>
                <IconButton Icon={AiOutlineClose} onClick={close} />
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
                <IconButton
                    Icon={AiFillGithub}
                    component={Link}
                    href={'https://github.com/fluorjo'}
                    target="_blank"
                />
            </div>
        </div>
    );
};

export default Sidebar;
