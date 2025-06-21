interface ArtistInfo {
    img1v1Id: number;
    topicPerson: number;
    picId: number;
    musicSize: number;
    albumSize: number;
    briefDesc: string;
    picUrl: string;
    img1v1Url: string;
    followed: boolean;
    trans: string;
    alias: string[];
    name: string;
    id: number;
    img1v1Id_str: string;
}

export interface HotAlbum {
    songs: any[]; // 如果有具体结构可以进一步定义
    paid: boolean;
    onSale: boolean;
    mark: number;
    awardTags: any;
    displayTags: any;
    copyrightId: number;
    artists: ArtistInfo[];
    picId: number;
    artist: ArtistInfo;
    briefDesc: string;
    publishTime: number;
    company: string;
    picUrl: string;
    commentThreadId: string;
    blurPicUrl: string;
    companyId: number;
    pic: number;
    status: number;
    subType: string;
    alias: string[];
    description: string;
    tags: string;
    name: string | null;
    id: number;
    type: string;
    size: number;
    picId_str: string;
    isSub: boolean;
}
