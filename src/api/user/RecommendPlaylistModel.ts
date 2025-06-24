export interface RecommendPlaylist {
    id: number;
    type: number;
    name: string;
    copywriter: string;
    picUrl: string;
    canDislike: boolean;
    trackNumberUpdateTime: number;
    playCount: number;
    trackCount: number;
    highQuality: boolean;
    alg: string;
}

export interface RecommendPlaylistResponse {
    hasTaste: boolean;
    code: number;
    category: number;
    result: RecommendPlaylist[];
}
