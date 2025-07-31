import type { FC } from "react";
import type { Artist } from "../../api/track/SongDetailResponse";
import { Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ArtistLinkProps {
  artists: Artist[];
  maxSize?: number;
}

const ArtistLink: FC<ArtistLinkProps> = ({ artists, maxSize = 5 }) => {
  const navigate = useNavigate();
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        textTransform="capitalize"
        textAlign={"left"}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "10rem",
        }}
      >
        {artists
          .slice(0, Math.min(maxSize, artists.length))
          .map((artist, index, array) => (
            <span key={artist.id || artist.name}>
              <Link
                underline="hover"
                color="textSecondary"
                variant="caption"
                onClick={() => {
                  navigate("/artist/" + artist.id);
                }}
              >
                {artist.name}
              </Link>
              {index !== array.length - 1 && " / "}
            </span>
          ))}
      </Typography>
    </>
  );
};
export default ArtistLink;
