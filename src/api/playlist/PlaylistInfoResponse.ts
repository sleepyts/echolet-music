export interface PlaylistInfoResponse {
    more: boolean;
    playlist: Playlist[];
}

interface Creator {
    defaultAvatar: boolean;
    province: number;
    authStatus: number;
    followed: boolean;
    avatarUrl: string;
    accountStatus: number;
    gender: number;
    city: number;
    birthday: number;
    userId: number;
    userType: number;
    nickname: string;
    signature: string;
    description: string;
    detailDescription: string;
    avatarImgId: number;
    backgroundImgId: number;
    backgroundUrl: string;
    authority: number;
    mutual: boolean;
    expertTags: string[] | null;
    experts: any;
    djStatus: number;
    vipType: number;
    remarkName: string | null;
    authenticationTypes: number;
    avatarDetail: any;
    avatarImgIdStr: string;
    backgroundImgIdStr: string;
    anchor: boolean;
    avatarImgId_str: string;
}

export interface Playlist {
    creator: Creator;
    artists: undefined;
    tracks: undefined;
    top: boolean;
    updateFrequency: string | null;
    backgroundCoverId: number;
    backgroundCoverUrl: string | null;
    titleImage: number;
    titleImageUrl: string | null;
    englishTitle: string | null;
    opRecommend: boolean;
    recommendInfo: any;
    subscribedCount: number;
    cloudTrackCount: number;
    userId: number;
    totalDuration: number;
    coverImgId: number;
    privacy: number;
    trackUpdateTime: number;
    trackCount: number;
    updateTime: number;
    commentThreadId: string;
    coverImgUrl: string;
    specialType: number;
    anonimous: boolean;
    createTime: number;
    highQuality: boolean;
    newImported: boolean;
    trackNumberUpdateTime: number;
    playCount: number;
    adType: number;
    description: string;
    tags: string[];
    ordered: boolean;
    status: number;
    name: string;
    id: number;
    coverImgId_str: string;
    sharedUsers: any;
    shareStatus: any;
    copied: boolean;
    containsTracks: boolean;

}
