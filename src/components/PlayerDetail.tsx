import { Box, Drawer, ListItemButton, Typography } from "@mui/material";
import { useMusicStore } from "../store/MusicStore.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";
import {
  FontDownload,
  FontDownloadOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  MusicMainController,
  MusicSlider,
  RightController,
} from "./BottomPlayer.tsx";
import { useEffect, useRef, useState } from "react";
import { t } from "i18next";

/**
 * 播放详情组件 覆盖全盘 显示播放信息，操作按钮以及歌词
 */

interface PlayerDetailProps {
  expand: boolean;
  setExpand: (expand: boolean) => void;
}

export function PlayerDetail({ expand, setExpand }: PlayerDetailProps) {
  const currentMusicData = useMusicStore((state) => state.currentMusicData);
  return (
    <>
      <Drawer
        open={expand}
        anchor="bottom"
        onClose={() => setExpand(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }} p={2}>
          <RoundedIconButton
            icon={<KeyboardArrowDown />}
            onClick={() => {
              setExpand(false);
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box flex={0.5}></Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <MusicAvatar url={currentMusicData?.al?.picUrl} />

            <Box
              sx={{
                mt: 4,
                width: "50vh",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
              }}
            >
              <Box sx={{ mr: 2 }} flex={1}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: 16 }} noWrap>
                  {currentMusicData?.name || "未知歌曲"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: 12 }}
                  color="text.secondary"
                  noWrap
                >
                  {currentMusicData?.ar[0]?.name || "未知艺术家"} -{" "}
                  {currentMusicData?.al.name || "未知专辑"}
                </Typography>
              </Box>
              <Box flex={1}>
                <RightController canExpand={false} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "50vh ",
                alignItems: "center",
              }}
              mt={2}
            >
              <MusicSlider />
            </Box>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                mt: 2,
                width: "50vh",
              }}
            >
              <MusicMainController />
            </Box>
          </Box>

          <MusicLyric />
        </Box>
      </Drawer>
    </>
  );
}

function MusicLyric() {
  const lyric = useMusicStore((state) => state.lyric);
  const tlyric = useMusicStore((state) => state.tlyric);
  const rlyric = useMusicStore((state) => state.romalyric);
  const currentLyricIndex = useMusicStore((state) => state.currentLyricIndex);
  const seek = useMusicStore((state) => state.seek);
  const lyricsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showRoma, setShowRoma] = useState(false);
  useEffect(() => {
    const el = lyricsRefs.current[currentLyricIndex ?? 0];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center", // 可以是 'nearest', 'center', 'start', 'end'
      });
    }
  }, [currentLyricIndex]);
  return (
    <>
      <Box
        sx={{
          flex: 1.3,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 4,
          overflowY: "auto",
          position: "relative",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            m: "auto 0",
          }}
        >
          {lyric &&
            lyric.map(({ time, text }, index) => {
              const isActive =
                currentLyricIndex !== undefined && currentLyricIndex === index;

              return (
                <ListItemButton
                  key={time}
                  ref={(el) => {
                    lyricsRefs.current[index] = el;
                  }}
                  selected={isActive}
                  onClick={() => {
                    seek(time);
                  }}
                  sx={{
                    width: "100%",
                    alignItems: "flex-start",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent",
                    borderRadius: 2,
                    transition: "background-color 0.3s ease",
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: isActive ? 700 : 400,
                        transition: "all 0.3s ease",
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                        fontFamily: "Noto Sans",
                      }}
                    >
                      {text}
                    </Typography>
                    {!showRoma && tlyric != undefined && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mt: 0.5,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontFamily: "Noto Sans",
                        }}
                      >
                        {tlyric.find((t) => t.time === time)?.text}
                      </Typography>
                    )}
                    {showRoma && rlyric != undefined && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mt: 0.5,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontFamily: "Noto Sans",
                        }}
                      >
                        {rlyric.find((t) => t.time === time)?.text}
                      </Typography>
                    )}
                  </Box>
                </ListItemButton>
              );
            })}
        </Box>

        <Box
          sx={{
            position: "fixed",
            right: 0,
            top: "50%",
            p: 1,
          }}
        >
          {rlyric && rlyric.length > 0 && (
            <RoundedIconButton
              title={t("show-roma-lyrics")}
              icon={showRoma ? <FontDownload /> : <FontDownloadOutlined />}
              onClick={() => {
                setShowRoma(!showRoma);
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

function MusicAvatar({ url }: { url: string | undefined }) {
  return (
    <>
      <Box
        sx={{
          width: "50vh", // 调整大小以适应屏幕高度
          height: "50vh",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          boxSizing: "border-box",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // 阴影效果
        }}
      >
        <img
          src={url || "https://via.placeholder.com/300?text=No+Cover"}
          alt={"Album Cover"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "4px",
          }}
        />
      </Box>
    </>
  );
}
