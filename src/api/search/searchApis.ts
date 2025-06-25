import http from "../http.ts";
import type {SearchArtistResponse, SearchPlaylistResponse, SearchSongResponse} from "./SearchModel.ts";


/**
 * 搜索歌手
 * @param keywords 关键词
 * @param limit 返回数量
 * @param offset 偏移量
 * @param type 搜索类型
 * @see SearchType
 */
export async function searchArtists(keywords: string, limit: number | undefined = 30, offset: number | undefined = 0, type: number = 100): Promise<SearchArtistResponse> {
    return http.get("/cloudsearch", {
        params: {keywords, limit, offset, type},
    })
}

/**
 * 搜索歌曲
 * @param keywords
 * @param limit
 * @param offset
 * @param type
 */
export async function searchSongs(keywords: string, limit: number | undefined = 30, offset: number | undefined = 0, type: number = 1): Promise<SearchSongResponse> {
    return http.get("/cloudsearch", {
        params: {keywords, limit, offset, type},
    })
}

/**
 * 搜索歌单
 * @param keywords
 * @param limit
 * @param offset
 * @param type
 */
export async function searchPlaylist(keywords: string, limit: number | undefined = 30, offset: number | undefined = 0, type: number = 1000): Promise<SearchPlaylistResponse> {
    return http.get("/cloudsearch", {
        params: {keywords, limit, offset, type},
    })
}