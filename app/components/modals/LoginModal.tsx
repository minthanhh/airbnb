'use client';

import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useLoginModal, useRegisterModal } from '~/app/hooks';
import { Modal, Heading, Input, Button } from '~/app/components';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        console.log(data);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
            .then((cb) => {
                setIsLoading(false);
                console.log(cb);
                if (cb?.ok) {
                    toast.success('Logged in');
                    router.refresh();
                    loginModal.onClose();
                }

                if (cb?.error) {
                    toast.error(cb.error);
                }
            })
            .catch((err) => console.log(err));
    };

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!" />
            <Input
                id={'email'}
                label={'Email'}
                errors={errors}
                register={register}
                required
            />
            <Input
                id={'password'}
                label={'Password'}
                type={'password'}
                errors={errors}
                register={register}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                icon={FcGoogle}
                onClick={() => signIn('google')}
                label="Continue with Google"
            />
            <Button
                outline
                icon={AiFillGithub}
                onClick={() => signIn('github')}
                label="Continue with Github"
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div>First time using Airbnb?</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <Modal
            title={'Login'}
            disabled={isLoading}
            actionLabel={'Continue'}
            isOpen={loginModal.isOpen}
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default LoginModal;
