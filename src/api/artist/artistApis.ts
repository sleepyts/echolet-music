import type {ArtistDetailResponse} from "./ArtistDetailModel.ts";
import http from "../http.ts";
import type {Song} from "../track/SongDetailResponse.ts";


/**
 * 获取歌手详情
 * @param id 歌手id
 */
export async function getArtistDetail(id: number): Promise<ArtistDetailResponse> {
    return http.get("/artist/detail", {
        params: {
            id: id
        }
    })
}

/**
 * 获取歌手热门歌曲 最多50首
 * @param id 歌手id
 */
export async function getArtistHotSongs(id: number): Promise<Song[]> {
    const res = await http.get("/artists", {
        params: {id: id}
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return res.hotSongs;
}