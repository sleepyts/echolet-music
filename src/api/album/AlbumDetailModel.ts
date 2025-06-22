export interface AlbumDetailResponse {
    resourceState: boolean;
    songs: AlbumSong[];
    code: number;
    album: AlbumDetail;
}

interface FreeTrialPrivilege {
    resConsumable: boolean;
    userConsumable: boolean;
    listenType: any;
    cannotListenReason: any;
    playReason: any;
    freeLimitTagType: any;
}

interface ChargeInfo {
    rate: number;
    chargeUrl: string | null;
    chargeMessage: string | null;
    chargeType: number;
}

export interface AlbumDetail {
    songs: any[];
    paid: boolean;
    onSale: boolean;
    mark: number;
    awardTags: any;
    displayTags: any;
    copyrightId: number;
    artists: AlbumArtist[];
    picId: number;
    artist: AlbumArtist;
    publishTime: number;
    company: string;
    briefDesc: string;
    picUrl: string;
    commentThreadId: string;
    blurPicUrl: string;
    companyId: number;
    pic: number;
    alias: string[];
    status: number;
    subType: string;
    description: string;
    tags: string;
    name: string;
    id: number;
    type: string;
    size: number;
    picId_str: string;
    info: AlbumInfo;
}

interface AlbumArtist {
    img1v1Id: number;
    topicPerson: number;
    picId: number;
    briefDesc: string;
    musicSize: number;
    albumSize: number;
    picUrl: string;
    img1v1Url: string;
    followed: boolean;
    trans: string;
    alias: string[];
    name: string;
    id: number;
    img1v1Id_str: string;
    picId_str?: string;
}

interface AlbumInfo {
    commentThread: {
        id: string;
        resourceInfo: any;
        resourceType: number;
        commentCount: number;
        likedCount: number;
        shareCount: number;
        hotCount: number;
        latestLikedUsers: any;
        resourceId: number;
        resourceOwnerId: number;
        resourceTitle: any;
    };
    latestLikedUsers: any;
    liked: boolean;
    comments: any;
    resourceType: number;
    resourceId: number;
    commentCount: number;
    likedCount: number;
    shareCount: number;
    threadId: string;
}

interface AlbumBrief {
    id: number;
    name: string;
    pic_str: string;
    pic: number;
}


export interface AlbumSong {
    rtUrls: any[];
    ar: Artist[];
    al: AlbumBrief;
    st: number;
    noCopyrightRcmd: any;
    songJumpInfo: any;
    djId: number;
    no: number;
    fee: number;
    mv: number;
    cd: string;
    t: number;
    v: number;
    rtype: number;
    rurl: string | null;
    pst: number;
    alia: string[];
    pop: number;
    rt: string;
    mst: number;
    cp: number;
    crbt: any;
    cf: string;
    dt: number;
    h?: AudioQuality;
    sq?: AudioQuality;
    hr?: AudioQuality | null;
    l?: AudioQuality;
    rtUrl: string | null;
    ftype: number;
    a: any;
    m?: AudioQuality;
    name: string;
    id: number;
    privilege: Privilege;
}

interface AudioQuality {
    br: number;
    fid: number;
    size: number;
    vd: number;
    sr: number;
}

interface Artist {
    id: number;
    name: string;
}

interface Artist {
    id: number;
    name: string;
}

interface Privilege {
    id: number;
    fee: number;
    payed: number;
    st: number;
    pl: number;
    dl: number;
    sp: number;
    cp: number;
    subp: number;
    cs: boolean;
    maxbr: number;
    fl: number;
    toast: boolean;
    flag: number;
    preSell: boolean;
    playMaxbr: number;
    downloadMaxbr: number;
    maxBrLevel: string;
    playMaxBrLevel: string;
    downloadMaxBrLevel: string;
    plLevel: string;
    dlLevel: string;
    flLevel: string;
    rscl: any;
    freeTrialPrivilege: FreeTrialPrivilege;
    rightSource: number;
    chargeInfoList: ChargeInfo[];
    code: number;
    message: string | null;
    plLevels: any;
    dlLevels: any;
    ignoreCache: any;
}
