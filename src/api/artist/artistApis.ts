import type {ArtistDetailResponse} from "./ArtistDetailModel.ts";
import http from "../http.ts";
import type {Song} from "../track/SongDetailResponse.ts";
import type {HotAlbum} from "./ArtistAlbumModel.ts";
import type {ArtistSongsResponse} from "./ArtistSongsResponse.ts";


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

/**
 * 获取歌手专辑
 * @param id 歌手 id
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 * @param limit 取出数量
 */
export async function getArtistHotAlbums(id: number, offset: number | undefined = undefined, limit: number | undefined = 100): Promise<HotAlbum[]> {
    const res = await http.get("/artist/album", {
        params: {id: id, offset: offset, limit: limit},
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return res.hotAlbums
}

/**
 * 获取歌手全部歌曲
 * @param id 歌手id
 * @param limit 取出歌单数量 , 默认为 20
 * @param offset  偏移数量 , 用于分页 , 如 :( 评论页数 -1)*limit
 * @param order hot ,time 按照热门或者时间排序
 */
export async function getArtistSongs(id: number, limit: number | undefined = 20, offset: number | undefined = undefined, order: string | undefined = "hot"): Promise<ArtistSongsResponse> {
    return http.get("/artist/songs", {
        params: {id: id, limit: limit, offset: offset, order: order}
    })
}