import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, SignupData } from '@/types/auth';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push('/dashboard');
        },
    });
}

export function useSignup() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (signupData: SignupData) => authService.signup(signupData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push('/dashboard');
        },
    });
}

export function useMe() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getMe(),
        enabled: authService.isAuthenticated(),
        staleTime: 0,
        refetchInterval: 10000, // Poll every 10 seconds for invites/messes
    });
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return () => {
        authService.logout();
        queryClient.clear();
        router.push('/login');
    };
}
