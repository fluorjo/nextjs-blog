import Button from '@/components/Button';
import Input from '@/components/Input';
import { createClient } from '@/utils/supabase/client';
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const supabase = createClient();

export default function Admin() {
    const router = useRouter();
    const [userResponse, setUserResponse] = useState<UserResponse>();
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
    useEffect(() => {
        (async () => {
            const user = await supabase.auth.getUser();
            setUserResponse(user);
        })();
    }, []);

    return (
        <div className="container flex flex-col pb-20 pt-12 ">
            {!!userResponse?.data.user ? (
                <div className="flex flex-col gap-2">
                    <div className="mb-8">
                        <b>{userResponse.data.user.email}</b> 로그인 성공
                    </div>
                    <Button type="button" onClick={() => router.push('/write')}>
                        글 쓰러 가기
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            fetch('/api/posts', {
                                method: 'DELETE',
                            });
                        }}
                    >
                        테스트 글 삭제
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            supabase.auth.signOut();
                            router.push('/');
                        }}
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-8 ">
                    <h1 className="text-2xl font-medium ">로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <Input
                                type="text"
                                placeholder="email"
                                ref={emailRef}
                            />
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
            )}
        </div>
    );
}
