import type {Song} from "../track/SongDetailResponse.ts";

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

export interface SearchSongResponse {
    code: number;
    result: {
        searchQcReminder: any;
        songCount: number;
        songs: Song[];
    };
}

export interface SearchPlaylistResponse {
    code: number;
    result: {
        searchQcReminder: null;
        playlists: SearchPlaylist[];
        playlistCount: number;
    }
}

export interface SearchPlaylist {
    id: number;
    name: string;
    coverImgUrl: string;
    creator: Creator;
    subscribed: boolean;
    trackCount: number;
    userId: number;
    playCount: number;
    bookCount: number;
    specialType: number;
    officialTags: string[] | null;
    action: any;
    actionType: any;
    recommendText: string | null;
    score: number | null;
    description: string;
    highQuality: boolean;
}

export interface Creator {
    nickname: string;
    userId: number;
    userType: number;
    avatarUrl: string | null;
    authStatus: number;
    expertTags: string[] | null;
    experts: any;
}
