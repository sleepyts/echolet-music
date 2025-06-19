export interface PlayListDetailResponse {
    code: number;
    playlist: PlaylistDetail;
}

export interface TrackId {
    id: number;
    v: number;
    t: number;
    at: number;
    alg: string | null;
    uid: number;
    rcmdReason: string;
    rcmdReasonTitle: string;
    sc: any;
    f: any;
    sr: any;
    dpr: any;
}

export interface Creator {
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

export interface PlaylistDetail {
    id: number;
    name: string;
    coverImgId: number;
    coverImgUrl: string;
    coverImgId_str: string;
    adType: number;
    userId: number;
    createTime: number;
    status: number;
    opRecommend: boolean;
    highQuality: boolean;
    newImported: boolean;
    updateTime: number;
    trackCount: number;
    specialType: number;
    privacy: number;
    trackUpdateTime: number;
    commentThreadId: string;
    playCount: number;
    trackNumberUpdateTime: number;
    subscribedCount: number;
    cloudTrackCount: number;
    ordered: boolean;
    description: string | null;
    tags: string[];
    updateFrequency: string | null;
    backgroundCoverId: number;
    backgroundCoverUrl: string | null;
    titleImage: number;
    titleImageUrl: string | null;
    detailPageTitle: string | null;
    englishTitle: string | null;
    officialPlaylistType: string | null;
    copied: boolean;
    relateResType: string | null;
    coverStatus: number;
    creator: Creator;
    tracks: any;
    videoIds: any;
    videos: any;
    trackIds: TrackId[];
    bannedTrackIds: any;
    mvResourceInfos: any;
    shareCount: number;
    commentCount: number;
    remixVideo: any;
    newDetailPageRemixVideo: any;
    sharedUsers: any;
    historySharedUsers: any;
    gradeStatus: string;
    score: number | null;
    algTags: any;
    distributeTags: any[];
    trialMode: number;
    displayTags: any;
    displayUserInfoAsTagOnly: boolean;
    playlistType: string;
    bizExtInfo: any;
}
