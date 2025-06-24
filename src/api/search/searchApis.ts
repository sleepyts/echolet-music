import http from "../http.ts";
import type {SearchArtistResponse} from "./SearchModel.ts";


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