'use client';

import { useState, useEffect, useCallback } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { useLoginModal, useRegisterModal } from '~/app/hooks';
import { Modal, Heading, Input, Button, LoginModal } from '~/app/components';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
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
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post('/api/register', data)
            .then(() => {
                toast.success('Success!');
                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch((err) => toast.error('Something Went Wrong'))
            .finally(() => setIsLoading(false));
    };

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Airbnb" subtitle="Create an account" />
            <Input
                id={'email'}
                label={'Email'}
                errors={errors}
                register={register}
                required
            />
            <Input
                id={'name'}
                label={'Name'}
                type={'text'}
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
                    <div>Already have an account?</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Login
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            title={'Register'}
            disabled={isLoading}
            actionLabel={'Continue'}
            isOpen={registerModal.isOpen}
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;
