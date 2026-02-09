'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMe } from '@/hooks/useAuth';
import { messService } from '@/services/mess.service';
import type { Role, MessMember } from '@/services/mess.service';

interface MessContextType {
    currentMessId: string | null;
    setCurrentMessId: (messId: string | null) => void;
    userRole: Role | null;
    isAdmin: boolean;
    isManager: boolean;
    isMemberOfAnyMess: boolean;
    user: any; // Using any for now to avoid circular deps or complex type imports if not readily available, or use User type if imported.
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export function MessProvider({ children }: { children: React.ReactNode }) {
    const [currentMessId, setCurrentMessId] = useState<string | null>(null);
    const { data: user } = useMe();
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);

    // Auto-select first mess if user has messes
    useEffect(() => {
        if (user?.messes && user.messes.length > 0 && !currentMessId) {
            setCurrentMessId(user.messes[0]);
        }
    }, [user, currentMessId]);

    // Fetch mess details to get the real user role
    useEffect(() => {
        async function fetchRole() {
            if (currentMessId && user) {
                try {
                    const mess = await messService.getMessDetails(currentMessId);
                    const member = mess.members.find(m => m.user_id === user.id);
                    if (member) {
                        const roles = member.roles as Role[];
                        console.log('MessContext: User ID:', user.id, 'found in mess members. Roles:', roles);
                        setUserRole(roles[0] || 'member');
                        setIsAdmin(roles.includes('admin'));
                        setIsManager(roles.includes('manager'));
                        console.log('MessContext: Permissions set - isManager:', roles.includes('manager'), 'isAdmin:', roles.includes('admin'));
                    } else {
                        console.log('MessContext: User ID:', user.id, 'NOT found in mess members');
                        setUserRole('member');
                        setIsAdmin(false);
                        setIsManager(false);
                    }
                } catch (error) {
                    console.error('Failed to fetch mess role:', error);
                    setUserRole('member');
                    setIsAdmin(false);
                    setIsManager(false);
                }
            } else {
                setUserRole(null);
                setIsAdmin(false);
                setIsManager(false);
            }
        }
        fetchRole();
    }, [currentMessId, user?.messes, user?.id]);

    return (
        <MessContext.Provider
            value={{
                currentMessId,
                setCurrentMessId,
                userRole,
                isAdmin,
                isManager,
                isMemberOfAnyMess: !!user?.messes && user.messes.length > 0,
                user,
            }}
        >
            {children}
        </MessContext.Provider>
    );
}

export function useMessContext() {
    const context = useContext(MessContext);
    if (context === undefined) {
        throw new Error('useMessContext must be used within a MessProvider');
    }
    return context;
}
