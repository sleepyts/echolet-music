// Account 信息
export interface Account {
    id: number;
    userName: string;
    type: number;
    status: number;
    whitelistAuthority: number;
    createTime: number;
    tokenVersion: number;
    ban: number;
    baoyueVersion: number;
    donateVersion: number;
    vipType: number;
    anonimousUser: boolean;
    paidFee: boolean;
}

// Profile 信息
export interface Profile {
    userId: number;
    userType: number;
    nickname: string;
    avatarImgId: number;
    avatarUrl: string;
    backgroundImgId: number;
    backgroundUrl: string;
    signature: string;
    createTime: number;
    userName: string;
    accountType: number;
    shortUserName: string;
    birthday: number;
    authority: number;
    gender: number;
    accountStatus: number;
    province: number;
    city: number;
    authStatus: number;
    description: string | null;
    detailDescription: string | null;
    defaultAvatar: boolean;
    expertTags: string[] | null;
    experts: Record<string, string> | null;
    djStatus: number;
    locationStatus: number;
    vipType: number;
    followed: boolean;
    mutual: boolean;
    authenticated: boolean;
    lastLoginTime: number;
    lastLoginIP: string;
    remarkName: string | null;
    viptypeVersion: number;
    authenticationTypes: number;
    avatarDetail: unknown; // 根据返回结构可细化
    anchor: boolean;
}

// 主接口类型
export interface UserAccountResponse {
    code: number;
    account: Account;
    profile: Profile;
}
