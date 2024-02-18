'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Input from './Input';

const supabase = createClient();

const LoginForm = () => {
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await supabase.auth.signInWithPassword({
            email: emailRef.current?.value ?? '',
            password: passwordRef.current?.value ?? '',
        });

        if (!response.data.user) return alert('login failed');

        router.refresh();
    };

    return (
        <div className="flex flex-col gap-8 ">
            <h1 className="text-2xl font-medium ">로그인</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <Input type="text" placeholder="email" ref={emailRef} />
                    <Input
                        type="text"
                        placeholder="password"
                        ref={passwordRef}
                    />
                </div>
                <button
                    type="submit"
                    className={
                        'mt-4 w-full rounded-md bg-gray-800 py-2 text-white'
                    }
                >
                    login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
