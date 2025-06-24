import type {Song} from "../track/SongDetailResponse.ts";

export interface RecommendReason {
    songId: number;
    reason: string;
    reasonId: string;
    targetUrl: string | null;
}

export interface DailyRecommendSongResponse {
    code: number;
    data: {
        fromCache: boolean;
        dailySongs: Song[];
        orderSongs: any[];
        recommendReasons: RecommendReason[];
        mvResourceInfos: any | null;
        demote: boolean;
        dailyRecommendInfo: any | null;
    };
}
