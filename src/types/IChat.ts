export interface ChatEntity {
    _id?: string | string;
    participants:  string[];
    type?: 'individual' | 'group';
    status?: 'requested' | 'active' | 'block';
    lastSeen?: Date | string;
    groupName?: string | null;
    groupDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}