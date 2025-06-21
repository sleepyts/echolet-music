export interface ArtistDetailResponse {
    code: number;
    message: string;
    data: ArtistData;
}

export interface ArtistData {
    videoCount: number;
    vipRights: VipRights;
    identify: Identify;
    artist: Artist;
    blacklist: boolean;
    preferShow: number;
    showPriMsg: boolean;
    secondaryExpertIdentiy: SecondaryExpertIdentity[];
    eventCount: number;
    user: User;
}

interface VipRights {
    rightsInfoDetailDtoList: VipRight[];
    oldProtocol: boolean;
    redVipAnnualCount: number;
    redVipLevel: number;
    now: number;
}

interface VipRight {
    vipCode: number;
    expireTime: number;
    iconUrl: string | null;
    dynamicIconUrl: string | null;
    vipLevel: number;
    signIap: boolean;
    signDeduct: boolean;
    signIapDeduct: boolean;
    sign: boolean;
}

interface Identify {
    imageUrl: string;
    imageDesc: string;
    actionUrl: string;
}

interface Artist {
    id: number;
    cover: string;
    avatar: string;
    name: string;
    transNames: string[];
    alias: string[];
    identities: string[];
    identifyTag: string[];
    briefDesc: string;
    rank: Rank;
    albumSize: number;
    musicSize: number;
    mvSize: number;
}

interface Rank {
    rank: number;
    type: number;
}

interface SecondaryExpertIdentity {
    expertIdentiyId: number;
    expertIdentiyName: string;
    expertIdentiyCount: number;
}

interface User {
    backgroundUrl: string;
    birthday: number;
    detailDescription: string;
    authenticated: boolean;
    gender: number;
    city: number;
    signature: string;
    description: string;
    remarkName: string | null;
    shortUserName: string;
    accountStatus: number;
    locationStatus: number;
    avatarImgId: number;
    defaultAvatar: boolean;
    province: number;
    nickname: string;
    expertTags: string[] | null;
    djStatus: number;
    avatarUrl: string;
    accountType: number;
    authStatus: number;
    vipType: number;
    userName: string;
    followed: boolean;
    userId: number;
    lastLoginIP: string;
    lastLoginTime: number;
    authenticationTypes: number;
    mutual: boolean;
    createTime: number;
    anchor: boolean;
    authority: number;
    backgroundImgId: number;
    userType: number;
    experts: any | null;
    avatarDetail: AvatarDetail | null;
}

interface AvatarDetail {
    userType: number;
    identityLevel: number;
    identityIconUrl: string;
}
