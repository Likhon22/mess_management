export type Role = 'manager' | 'member';

export interface Member {
    user_id: string;
    role: Role;
    approved: boolean;
    joined_at: string;
}

export interface Mess {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    members: Member[];
}

export interface JoinRequest {
    user_id: string;
    mess_id: string;
    status: 'pending' | 'approved' | 'rejected';
    requested_at: string;
}
