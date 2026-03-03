'use client';

import { useGoogleLogin } from '@/hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const googleLogin = useGoogleLogin();

    const handleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            try {
                await googleLogin.mutateAsync(credentialResponse.credential);
                toast.success('Account created successfully!');
            } catch (err: any) {
                toast.error(err.message || 'Signup failed');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -tr-10 -mr-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -bl-10 -ml-10 w-32 h-32 bg-teal-100 rounded-full opacity-50 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                                <span className="text-4xl">✨</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">নতুন অ্যাকাউন্ট</h1>
                            <p className="text-gray-500 font-medium">Join your mess and simplify shared living</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={() => {
                                        toast.error('Signup Failed');
                                    }}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                    text="signup_with"
                                    width="100%"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Easy Onboarding</span>
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold underline">
                                        Login here
                                    </Link>
                                </p>

                                <p className="text-xs text-gray-400 leading-relaxed px-4">
                                    By creating an account, you agree to our <span className="text-emerald-600 font-bold underline cursor-pointer">Terms</span> and <span className="text-emerald-600 font-bold underline cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
