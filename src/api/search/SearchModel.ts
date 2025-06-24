
export enum SearchType {
    single = 1,
    album = 10,
    artist = 100,
    playlist = 1000,
    user = 1002,
    mv = 1004,
    lyric = 1006,
    djradio = 1009,
    video = 1014,
    combine = 1018
}

export interface SearchArtist {
    id: number;
    name: string;
    picUrl: string | null;
    alias: string[];
    albumSize: number;
    picId: number;
    fansGroup: any | null;
    img1v1Url: string;
    accountId?: number;
    img1v1: number;
    mvSize: number;
    followed: boolean;
    alia?: string[]; // 有些 artist 有 alia
    transNames?: string[]; // 有些 artist 有 transNames
    trans?: string | null;
}

export interface SearchArtistResponse {
    result: {
        artistCount: number;
        artists: SearchArtist[];
    };
}
