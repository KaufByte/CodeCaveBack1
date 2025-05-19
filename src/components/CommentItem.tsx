// import React, { useState } from "react";
// import {
//   Avatar, Box, Typography, Button, Collapse, TextField, IconButton, useTheme
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useTranslation } from "react-i18next";

// interface Comment {
//   id: number;
//   parentId?: number;
//   text: string;
//   date: string;
//   user?: {
//     username: string;
//     email: string;
//     avatar?: string;
//   };
//   replies?: Comment[];
//   likedBy?: string[];
// }

// interface Props {
//   comment: Comment;
//   onReply: (parentId: number, text: string) => void;
//   onLikeUpdate: () => void;
//   onDelete: (id: number) => void;
// }

// const CommentItem: React.FC<Props> = ({ comment, onReply, onLikeUpdate, onDelete }) => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   const [showReply, setShowReply] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [showAllReplies, setShowAllReplies] = useState(false);
//   const { t } = useTranslation("comments");

//   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
//   const userEmail = currentUser.email || "";

//   const isLiked = comment.likedBy?.includes(userEmail);
//   const likeCount = comment.likedBy?.length || 0;

//   const handleLike = async () => {
//     const updatedLikedBy = isLiked
//       ? comment.likedBy?.filter((email) => email !== userEmail)
//       : [...(comment.likedBy || []), userEmail];

//     await fetch(`http://localhost:5000/comments/${comment.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ likedBy: updatedLikedBy }),
//     });

//     onLikeUpdate();
//   };

//   const handleReply = () => {
//     if (replyText.trim()) {
//       onReply(comment.id, replyText.trim());
//       setReplyText("");
//       setShowReply(false);
//     }
//   };

//   const username = comment?.user?.username?.trim() || "Anonymous";
//   const initial = username.charAt(0).toUpperCase();
//   const avatarSrc = comment?.user?.avatar?.startsWith("data:image") ? comment.user.avatar : undefined;

//   const replies = comment.replies || [];
//   const visibleReplies = showAllReplies ? replies : replies.slice(0, 1);

//   return (
//     <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
//       <Avatar
//         src={avatarSrc}
//         sx={{
//           bgcolor: avatarSrc ? "transparent" : isDark ? "#444" : "#ddd",
//           width: 36,
//           height: 36,
//           fontSize: 14,
//         }}
//       >
//         {!avatarSrc && initial}
//       </Avatar>

//       <Box sx={{ ml: 1.5, flex: 1 }}>
//         <Box
//           sx={{
//             background: isDark ? "#202020" : "#f1f1f1",
//             borderRadius: 2,
//             p: 1.2,
//             px: 2,
//             mb: 0.5,
//             position: "relative"
//           }}
//         >
//           <Typography variant="subtitle2" fontSize={13} fontWeight={600}>
//             {username}
//           </Typography>
//           <Typography variant="body2" fontSize={13} sx={{ mt: 0.5 }}>
//             {comment.text}
//           </Typography>

//           {comment.user?.email === userEmail && (
//             <IconButton
//               size="small"
//               onClick={() => onDelete(comment.id)}
//               sx={{
//                 position: "absolute",
//                 top: 6,
//                 right: 6,
//                 color: isDark ? "#888" : "#666",
//                 "&:focus": {
//                   outline: "none",
//                   boxShadow: "none",
//                 },
//               }}
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           )}
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Typography variant="caption" fontSize={11} color={isDark ? "gray" : "#555"}>
//             {comment.date}
//           </Typography>

//           <Button
//             onClick={handleLike}
//             disableRipple
//             sx={{
//               minWidth: 30,
//               height: 30,
//               p: 0,
//               borderRadius: "50%",
//               backgroundColor: "transparent",
//               color: isLiked ? "#f7266e" : isDark ? "#aaa" : "#666",
//               fontSize: 14,
//               "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
//               "&:focus": { outline: "none", boxShadow: "none" },
//             }}
//           >
//             ❤️ {likeCount}
//           </Button>

//           <Button
//             onClick={() => setShowReply(!showReply)}
//             size="small"
//             sx={{ fontSize: 11, textTransform: "none", color: isDark ? "#aaa" : "#666", pl: 0 ,"&:focus": {
//               outline: "none",
//               boxShadow: "none",
//             },}}
//           >
//             {t("reply")}
//           </Button>
//         </Box>

//         <Collapse in={showReply}>
//           <TextField
//             size="small"
//             fullWidth
//             placeholder="Write a reply..."
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//             sx={{
//               mt: 1,
//               "& input": { fontSize: 13 },
//               "& .MuiInputBase-root": {
//                 bgcolor: isDark ? "#2a2a2a" : "#f4f4f4",
//                 borderRadius: 2,
//               },
//             }}
//           />
//           <Button
//             onClick={handleReply}
//             variant="contained"
//             size="small"
//             sx={{ mt: 1, fontSize: 12, textTransform: "none" ,"&:focus": {
//               outline: "none",
//               boxShadow: "none",
//             },}}
//           >
//             {t("send")}
//           </Button>
//         </Collapse>

//         {visibleReplies.map((reply, i) => (
//           <Box key={reply.id || i} sx={{ ml: 4, mt: 1 }}>
//             <CommentItem
//               comment={reply}
//               onReply={onReply}
//               onLikeUpdate={onLikeUpdate}
//               onDelete={onDelete}
//             />
//           </Box>
//         ))}

//         {replies.length > 1 && !showAllReplies && (
//           <Button
//             size="small"
//             sx={{ fontSize: 11, textTransform: "none", ml: 4, mt: 0.5, color: "#f7266e" }}
//             onClick={() => setShowAllReplies(true)}
//           >
//             {t("showMoreReplies")}
//           </Button>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default CommentItem;
import React, { useState } from "react";
import {
  Avatar, Box, Typography, Button, Collapse, TextField, IconButton, useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { refreshAccessToken } from "../utils/authFetch";
import i18n from "../i18n/i18n";

interface Comment {
  id: number;
  parent?: number;
  text: string;
  date: string;
  user?: {
    username: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
  likedBy?: string[];
}

interface Props {
  comment: Comment;
  onReply: (parentId: number, text: string) => void;
  onLikeUpdate: () => void;
  onDelete: (id: number) => void;
}

const CommentItem: React.FC<Props> = ({ comment, onReply, onLikeUpdate, onDelete }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("comments");

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userEmail = currentUser?.email || "";

  const isLiked = comment.likedBy?.includes(userEmail); 
  const likeCount = comment.likedBy?.length || 0;

  const handleLike = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = currentUser?.id;
    if (!userId) return;
  
    const isLiked = comment.likedBy?.includes(userId);
    const updatedLikedBy = isLiked
      ? comment.likedBy?.filter((id) => id !== userId)
      : [...(comment.likedBy || []), userId];
  
    let token = localStorage.getItem("token");
  
    let res = await fetch(`http://localhost:8000/api/comments/${comment.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ liked_by: updatedLikedBy }),
    });
  
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return;
  
      token = newToken;
      res = await fetch(`http://localhost:8000/api/comments/${comment.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ liked_by: updatedLikedBy }),
      });
    }
  
    if (res.ok) {
      onLikeUpdate();
    } else {
      const data = await res.json();
      console.error("Failed to like comment", data);
    }
  };
  

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReply(false);
    }
  };
  const formatDate = (iso:string)=>{
    const lang = i18n.language;
    return new Date(iso).toLocaleString(lang==="en" ? "en-US" : "uk-UA",{
      year:"numeric",
      month:"long",
      day:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    })
  }
  const username = comment.user?.username?.trim() || "Anonymous";
  const initial = username.charAt(0).toUpperCase();
  const avatarSrc = comment.user?.avatar?.startsWith("data:image")
    ? comment.user.avatar
    : undefined;

  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 1);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
      <Avatar
        src={avatarSrc}
        sx={{
          bgcolor: avatarSrc ? "transparent" : isDark ? "#444" : "#ddd",
          width: 36,
          height: 36,
          fontSize: 14,
        }}
      >
        {!avatarSrc && initial}
      </Avatar>

      <Box sx={{ ml: 1.5, flex: 1 }}>
        <Box
          sx={{
            background: isDark ? "#202020" : "#f1f1f1",
            borderRadius: 2,
            p: 1.2,
            px: 2,
            mb: 0.5,
            position: "relative"
          }}
        >
          <Typography variant="subtitle2" fontSize={13} fontWeight={600}>
            {username}
          </Typography>
          <Typography variant="body2" fontSize={13} sx={{ mt: 0.5 }}>
            {comment.text}
          </Typography>

          {comment.user?.email === userEmail && (
            <IconButton
              size="small"
              onClick={() => onDelete(comment.id)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                color: isDark ? "#888" : "#666",
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption">{formatDate(comment.date)}</Typography>

          <Button
            onClick={handleLike}
            disableRipple
            sx={{
              minWidth: 30,
              height: 30,
              p: 0,
              borderRadius: "50%",
              backgroundColor: "transparent",
              color: isLiked ? "#f7266e" : isDark ? "#aaa" : "#666",
              fontSize: 14,
              "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
              "&:focus": { outline: "none", boxShadow: "none" },
            }}
          >
            ❤️ {likeCount}
          </Button>

          <Button
            onClick={() => setShowReply(!showReply)}
            size="small"
            sx={{ fontSize: 11, textTransform: "none", color: isDark ? "#aaa" : "#666", pl: 0 }}
          >
            {t("reply")}
          </Button>
        </Box>

        <Collapse in={showReply}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{
              mt: 1,
              "& input": { fontSize: 13 },
              "& .MuiInputBase-root": {
                bgcolor: isDark ? "#2a2a2a" : "#f4f4f4",
                borderRadius: 2,
              },
            }}
          />
          <Button
            onClick={handleReply}
            variant="contained"
            size="small"
            sx={{ mt: 1, fontSize: 12, textTransform: "none" }}
          >
            {t("send")}
          </Button>
        </Collapse>

        {visibleReplies.map((reply) => (
          <Box key={reply.id} sx={{ ml: 4, mt: 1 }}>
            <CommentItem
              comment={reply}
              onReply={onReply}
              onLikeUpdate={onLikeUpdate}
              onDelete={onDelete}
            />
          </Box>
        ))}

        {replies.length > 1 && !showAllReplies && (
          <Button
            size="small"
            sx={{ fontSize: 11, textTransform: "none", ml: 4, mt: 0.5, color: "#f7266e" }}
            onClick={() => setShowAllReplies(true)}
          >
            {t("showMoreReplies")}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
