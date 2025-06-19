import type {SongDetailResponse} from "./SongDetailResponse.ts";
import http from "../http.ts";
import type {MusicDataResponse} from "./MusicDataResponse.ts";


/**
 * 获取歌曲详情
 * @param ids 歌曲id列表
 */
export async function getSongDetail(ids: string[]): Promise<SongDetailResponse> {
    return http.get("/song/detail", {
        params: {
            ids: ids.join(","),
        },
    })
}


/**
 * 获取歌曲url
 * @param ids 歌曲id列表
 * @param level 播放音质等级, 分为 standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res, jyeffect => 高清环绕声, sky => 沉浸环绕声, dolby => 杜比全景声, jymaster => 超清母带
 */
export async function getMusicData(ids: string[], level: string = "standard"): Promise<MusicDataResponse> {
    return http.get("/song/url/v1", {
        params: {
            ids: ids.join(","),
            level: level,
        },
    })
}