import React, { useEffect, useMemo, useState } from "react";
import {
  Box, IconButton, Typography, Chip, Button, useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloudIcon from "@mui/icons-material/Cloud";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { useTranslation } from "react-i18next";
import CommentSection from "../components/CommentSection";
import EditVideoModal from "../components/EditVideoModal";
import DeleteVideoModal from "../components/DeleteVideoModal";
import AdminAddVideoModal from "../components/AdminAddVideoModal";
import LazyVideoPlayer from "../components/LazyVideoPlayer";
import i18n from "../i18n/i18n";
import { useSyncUserAfterSubscription } from "../utils/useSyncUserAfterSubscription";

export interface Timecode {
  time: string;
  label: string;
}

export interface Post {
  id: number;
  type: "video";
  title: string;
  date: { ua: string; us: string };
  createdAt: { ua: string; us: string } | null;
  previewUrl: string | File;
  videoUrl: string | File;
  description: string;
  hashtags: string[];
  likes: number;
  comments: number;
  timecodes: Timecode[];
  likedBy: number[];
  materials: {
    title: string;
    url: string;
    allowedRoles: string[];
  }[];
  min_subscription_level: string;
  isAccessible: boolean;
}
const FeedScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("feed");
  const isDark = theme.palette.mode === "dark";

  const [videos, setVideos] = useState<Post[]>([]);
  const [editVideo, setEditVideo] = useState<Post | null>(null);
  const [deleteVideoId, setDeleteVideoId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [showAllTimecodes, setShowAllTimecodes] = useState<Record<number, boolean>>({});
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const subscriptionLevels = ["Free", "Junior", "Chilli", "Powerful SEO"];

  const [currentUser, setCurrentUser] = useState<any>(() =>
    JSON.parse(localStorage.getItem("currentUser") || "{}")
  );
  const userId = currentUser?.id;
  const userRole = currentUser?.role;
  const lang: 'ua' | 'us' = i18n.language.startsWith("uk") ? "ua" : "us";
   useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "currentUser" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setCurrentUser(updated);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useSyncUserAfterSubscription(setCurrentUser);

const normalizeLevel = (level: string): string => {
  const map: Record<string, string> = {
    "price_1RDBbICBzupUl6DZvborkf3k": "Junior",
    "price_1RDBhUCBzupUl6DZnaT7g5HH": "Chilli",
    "price_1RDBibCBzupUl6DZd9ojFaDE": "Powerful SEO",
    "price_FREE": "Free",
    "chilli": "Chilli",
    "chillimiddle":  "Chilli",   
    "powerfulseo": "Powerful SEO",
    "junior": "Junior",
    "free": "Free",
  };

  if (map[level]) return map[level];

   const key = level.toLowerCase().replace(/\s+/g,"").replace(/-/g,"");
    return map[key] ?? level;
};



const mappedLevel = useMemo(() => {
  const raw = currentUser?.subscription_status === "active"
    ? currentUser?.subscription_name
    : "price_FREE";

  return normalizeLevel(raw || "Free");
}, [currentUser]);


  const toAbsoluteUrl = (url: string | File | null | undefined): string => {
    if (!url) return ""; 
    if (url instanceof File) return URL.createObjectURL(url);
    if (typeof url === "string" && url.startsWith("http")) return url;
    return `https://codecaveback2.onrender.com/${url.startsWith("/") ? "" : "/"}${url}`;
  };
 const isAccessibleLevel = (userLevel: string, requiredLevel: string): boolean => {
  if (userRole === "admin") return true;

  const u = normalizeLevel(userLevel);
  const r = normalizeLevel(requiredLevel);

  const ui = subscriptionLevels.findIndex(l => l === u);
  const ri = subscriptionLevels.findIndex(l => l === r);
  return ui >= ri;
};
  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://codecaveback2.onrender.com/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem("currentUser", JSON.stringify(user));
          setCurrentUser(user);
        }
      } catch (err) {
        console.error( err);
      }
    };

    syncUser();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("subscribed") === "true" || window.location.pathname === "/success") {
      setTimeout(syncUser, 1000); 
    }
  }, []);



useEffect(() => {
  if (!userId) return;

  fetch("https://codecaveback2.onrender.com/api/videos/")
    .then((res) => res.json())
    .then((raw) => {
      const data: Post[] = raw.map((v: any) => {
        const videoLevel = v.min_subscription_level || "Free";
        const accessible = isAccessibleLevel(mappedLevel, videoLevel);

        return {
          id: v.id,
          type: "video",
          title: v.title,
          date: { ua: "", us: "" },
          createdAt: { ua: v.created_at, us: v.created_at },
          previewUrl: toAbsoluteUrl(v.preview),
          videoUrl: toAbsoluteUrl(v.video),
          description: v.description,
          hashtags: Array.isArray(v.hashtags)
            ? v.hashtags
            : typeof v.hashtags === "string"
            ? v.hashtags.split(",").map((h: string) => h.trim()).filter(Boolean)
            : [],
          likes: v.likes ?? 0,
          comments: 0,
          timecodes: v.timecodes ?? [],
          likedBy: v.likedBy ?? [],
          materials: v.materials ?? [],
          min_subscription_level: videoLevel,
          isAccessible: accessible,
        };
      });

      setVideos(data);

      const liked: Record<number, boolean> = {};
      data.forEach((v) => {
        liked[v.id] = v.likedBy.includes(userId);
      });
      setLikedMap(liked);
    })
    .catch((err) => {
      console.error("❌ Failed to load videos:", err);
    });
}, [mappedLevel, userId, userRole]);



  useEffect(() => {
    fetch("https://codecaveback2.onrender.com/api/comments-count/")
      .then(res => res.json())
      .then((data) => setCommentCounts(data));
  }, []);

  const handleCommentAdded = (videoId: number) => {
    setCommentCounts(prev => ({
      ...prev,
      [videoId]: (prev[videoId] || 0) + 1
    }));
  };
const toggleLike = async (videoId: number) => {
  const already = likedMap[videoId];
  const current = videos.find(v => v.id === videoId);
  if (!current || !userId) return;

  const ids = already
    ? current.likedBy.filter(id => id !== userId)
    : [...current.likedBy, userId];

  const formData = new FormData();
  ids.forEach(id => formData.append("liked_by", id.toString()));

  await fetch(`https://codecaveback2.onrender.com/api/videos/${videoId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: formData,
  });

  setVideos(v => v.map(it =>
    it.id === videoId ? { ...it, likedBy: ids, likes: ids.length } : it
  ));
  setLikedMap(v => ({ ...v, [videoId]: !already }));
};

  
  const handleAddVideo = async (formData: FormData) => {
    const res = await fetch("https://codecaveback2.onrender.com/api/videos/", { method: "POST", body: formData });
    const saved = await res.json();
    const newVideo: Post = {
      id: saved.id,
      type: "video",
      title: saved.title,
      date: { ua: saved.date_ua, us: saved.date_us },
      createdAt: saved.created_at_ua || saved.created_at_us ? { ua: saved.created_at_ua, us: saved.created_at_us } : null,
      previewUrl: toAbsoluteUrl(saved.preview),
      videoUrl: toAbsoluteUrl(saved.video),
      description: saved.description,
      hashtags: saved.hashtags ?? [],
      likes: 0,
      comments: 0,
      timecodes: saved.timecodes ?? [],
      likedBy: [],
      materials: saved.materials ?? [],
      min_subscription_level: saved.min_subscription_level || "Free",
      isAccessible: isAccessibleLevel(mappedLevel, saved.min_subscription_level || "Free"),
      
    };
    setVideos(prev => [newVideo, ...prev]);
    
    
  };
//   const handleAddVideo = async (formData: FormData) => {
//   const saved: any = Object.fromEntries(formData.entries());

//   const newVideo: Post = {
//     id: Date.now(), // временный ID (можно заменить, если сервер вернет настоящий)
//     type: "video",
//     title: saved.title,
//     date: { ua: saved.date_ua, us: saved.date_us },
//     createdAt: {
//       ua: saved.created_at_ua ?? "",
//       us: saved.created_at_us ?? ""
//     },
//     previewUrl: saved.preview, // ссылка из Cloudinary
//     videoUrl: saved.video,     // ссылка из Cloudinary
//     description: saved.description ?? "",
//     hashtags: JSON.parse(saved.hashtags ?? "[]"),
//     likes: 0,
//     comments: 0,
//     timecodes: JSON.parse(saved.timecodes ?? "[]"),
//     likedBy: [],
//     materials: JSON.parse(saved.materials ?? "[]"),
//     min_subscription_level: saved.min_subscription_level || "Free",
//     isAccessible: isAccessibleLevel(mappedLevel, saved.min_subscription_level || "Free")
//   };

//   setVideos(prev => [newVideo, ...prev]);
// };

  const handleSaveEdit = async (updated: Post) => {
    const formData = new FormData();
    const createdAt = {
      ua: updated.createdAt?.ua ?? "",
      us: updated.createdAt?.us ?? ""
    };

    formData.append("title", updated.title);
    formData.append("description", updated.description);
    formData.append("date_ua", updated.date.ua);
    formData.append("date_us", updated.date.us);
    formData.append("created_at_ua", createdAt.ua);
    formData.append("created_at_us", createdAt.us);
    formData.append("hashtags", JSON.stringify(updated.hashtags));
    formData.append("timecodes", JSON.stringify(updated.timecodes));
    formData.append("materials", JSON.stringify(updated.materials));
    console.log("hashtags", updated.hashtags, JSON.stringify(updated.hashtags));

    if (typeof updated.previewUrl !== "string") {
      formData.append("preview", updated.previewUrl);
    }

    if (typeof updated.videoUrl !== "string") {
      formData.append("video", updated.videoUrl);
    }

    const res = await fetch(`https://codecaveback2.onrender.com/api/videos/${updated.id}/`, {
      method: "PATCH",
      body: formData,
    });
    const saved = await res.json();
    setVideos(prev => prev.map(v => v.id === saved.id ? saved : v));
    setEditVideo(null);
  };

  const handleDelete = async (id: number) => {
    await fetch(`https://codecaveback2.onrender.com/api/videos/${id}/`, {
      method: "DELETE",
    });
    setVideos(prev => prev.filter(v => v.id !== id));
    setDeleteVideoId(null);
  };
  const toggleFilter = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleShowTimecodes = (id: number) => {
    setShowAllTimecodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVideos = activeFilters.length === 0
    ? videos
    : videos.filter(v => activeFilters.every(tag => v.hashtags.includes(tag)));
  
  const getLinkIcon = (url:string)=>{
    if(url.includes("github.com")) return<GitHubIcon fontSize="small"/>;
    if(url.includes("drive.google.com")) return<CloudIcon fontSize="small"/>;
    if(url.includes("/\.pdf(\?.*)?$/i")) return<PictureAsPdfIcon fontSize="small"/>;
    if(url.includes("youtube.com") || url.includes("youtu.be"))return<YouTubeIcon fontSize="small"/>;
  };
  const formatDate = (iso: string | undefined): string => {
    if (!iso) return "–";
    const lang = i18n.language;
    const date = new Date(iso);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString(lang === "en" ? "en-US" : "uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">{t("title")}</Typography>
        {userRole === "admin" && (
          <IconButton onClick={() => setAddModalOpen(true)} sx={{ color: "#f7266e","&:focus": {
              outline: "none",
              boxShadow: "none",
            },}}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        )}
      </Box>

      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
          {activeFilters.map(tag => (
            <Chip
              key={tag}
              label={tag.startsWith('#') ? tag : `#${tag}`}
              onDelete={() => toggleFilter(tag)}
              sx={{
                bgcolor: isDark ? "#333" : "#e0e0e0",
                color: isDark ? "#fff" : "#000",
              }}
            />
          ))}
        </Box>
      )}

      {filteredVideos.map(v => (
        <Box key={v.id} sx={{ position: "relative", mb: 6, borderRadius: 2 }}>
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: isDark ? "#1c1c1c" : "#f4f4f4",
              boxShadow: isDark
                ? "0 0 60px 30px rgba(255, 12, 89, 0.05)"
                : "0px 2px 10px rgba(0,0,0,0.08)",
            }}
          >
          {v.isAccessible ? (
              <LazyVideoPlayer
                videoUrl={toAbsoluteUrl(v.videoUrl)}
                poster={toAbsoluteUrl(v.previewUrl)}
                videoId={v.id}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isDark ? "#1e1e1e" : "#f0f0f0",
                  borderRadius: 2,
                }}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    sx={{ color: isDark ? "#fff" : "#000", mb: 1 }}
                  >
                    {t("requiredLevel")}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? "#ccc" : "#555", mb: 2 }}
                  >
                    {t("upgradeToWatch", {
                      level: t(`roles.${v.min_subscription_level}`)
                    })}
                  </Typography>

                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<span style={{ fontSize: "18px" }}>🔒</span>}
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      textTransform: "none",
                      backgroundColor: "#f7266e"
                    }}
                    onClick={() => window.location.href = "/subscriptions"}
                  >
                    {t("upgradeLevel")}
                  </Button>
                </Box>

              </Box>
            )}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">{v.title}</Typography>
              <Typography variant="body2">
                {v.createdAt?.[lang] ? formatDate(v.createdAt[lang]) : ""}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mb: 2, color: isDark ? "#fff" : "#222" }}>
                {v.description}
              </Typography>

              {v.materials && v.materials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    {t("additionalMaterials") !== "additionalMaterials"
                      ? t("additionalMaterials")
                      : "Додаткові матеріали"}
                  </Typography>
                    {v.materials.map((m, idx) => {
                      const hasAccess =
                      userRole === "admin" ||
                      m.allowedRoles.length === 0 ||
                      m.allowedRoles.map(normalizeLevel).includes(mappedLevel);
                      console.log("Materials", m.title, "Roles:", m.allowedRoles, "Mapped:", mappedLevel);
                    return (
                      <Box key={idx} sx={{ mb: 2 }}>
                        {hasAccess ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              {m.title} –
                            </Typography>
                            {getLinkIcon(m.url)}
                            <Typography
                              component="a"
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#f7266e",
                                textDecoration: "underline",
                                fontSize: "0.85rem",
                                wordBreak: "break-all",
                              }}
                            >
                              {m.url}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              backgroundColor: "#1e1e1e",
                              borderRadius: 2,
                              px: 2,
                              py: 1.5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              maxWidth: 300,
                            }}
                          >
                           <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
                          {t("requiredLevel")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#fff", mb: 1 }}>
                        {m.allowedRoles.map((role, i) =>
                            t(`roles.${normalizeLevel(role)}`) +
                              (i < m.allowedRoles.length - 1 ? ` ${t("or")} ` : "")
                        )}
                        </Typography>
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<span style={{ fontSize: "18px" }}>🔒</span>}
                          sx={{
                            color:"#fff",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            textTransform: "none",
                            backgroundColor:"#f7266e"
                          }}
                          onClick={() => {
                            window.location.href = "/subscriptions";
                          }}
                        >
                          {t("upgradeLevel")}
                        </Button>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}
              {v.timecodes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{t("timecodes")}</Typography>
                  {(showAllTimecodes[v.id] ? v.timecodes : v.timecodes.slice(0, 3)).map((tc, i) => (
                    <Typography key={i} variant="body2">{tc.time} – {tc.label}</Typography>
                  ))}
                  {v.timecodes.length > 3 && (
                    <Button size="small" onClick={() => toggleShowTimecodes(v.id)} sx={{ color: "#f7266e","&:focus": {
                    outline: "none",
                    boxShadow: "none",
                    }}}>
                      {showAllTimecodes[v.id] ? t("hide") : t("showMore")}
                    </Button>
                  )}
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {v.hashtags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag.startsWith("#") ? tag : `#${tag}`}
                    clickable
                    onClick={() => toggleFilter(tag.replace(/^#+/, ''))}
                    sx={{
                      bgcolor: isDark ? "#2a2a2a" : "#e0e0e0",
                      color: isDark ? "#fff" : "#000",
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton onClick={() => toggleLike(v.id)} sx={{ color: likedMap[v.id] ? "red" : "#aaa","&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },}}>
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                  <Typography>{v.likes}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography>{commentCounts[v.id] || 0}</Typography>
                </Box>
              </Box>

              <CommentSection videoId={v.id} onCommentAdded={handleCommentAdded} />

              {userRole === "admin" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1 }}>
                  <IconButton onClick={() => setEditVideo(v)} sx={{ color: "#aaa","&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  }, }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteVideoId(v.id)} sx={{ color: "#aaa","&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  }, }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}

      {editVideo && (
        <EditVideoModal open={!!editVideo} video={editVideo} onClose={() => setEditVideo(null)} onSave={handleSaveEdit} />
      )}

      {deleteVideoId !== null && (
        <DeleteVideoModal open={true} videoId={deleteVideoId} onClose={() => setDeleteVideoId(null)} onConfirm={() => handleDelete(deleteVideoId)} />
      )}

      {userRole === "admin" && (
        <AdminAddVideoModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddVideo} />
      )}
    </Box>
  );
};

export default FeedScreen;
