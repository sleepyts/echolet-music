import type {AlbumDetailResponse} from "./AlbumDetailModel.ts";
import http from "../http.ts";


/**
 * 获取专辑详情
 * @param id 专辑id
 */
export async function getAlbumDetail(id: number): Promise<AlbumDetailResponse> {
    return http.get("/album", {
        params: {
            id: id
        }
    })
}