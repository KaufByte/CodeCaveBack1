// import React, { useEffect, useState } from "react";
// import { Box, Typography, Button } from "@mui/material";
// import CommentItem from "./CommentItem";
// import CommentInput from "./CommentInput";
// import { useTranslation } from "react-i18next";

// interface Comment {
//   id: number;
//   parentId?: number;
//   videoId: number;
//   text: string;
//   date: string;
//   user: {
//     username: string;
//     email: string;
//     avatar?: string;
//   };
//   replies?: Comment[];
//   likedBy?: string[];
// }

// interface Props {
//   videoId: number;
//   onCommentAdded? : (videoId: number)=>void;
// }

// const CommentSection: React.FC<Props> = ({ videoId,onCommentAdded }) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [visibleCount, setVisibleCount] = useState(2);
//   const { t } = useTranslation("comments");

//   const fetchComments = async () => {
//     const res = await fetch("http://localhost:5000/comments");
//     const data: Comment[] = await res.json();

//     const topLevel = data.filter((c) => !c.parentId && c.videoId === videoId);
//     const withReplies = topLevel.map((comment) => ({
//       ...comment,
//       replies: data.filter((r) => r.parentId === comment.id),
//     }));
//     setComments(withReplies);
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [videoId]);

//   const handleAddComment = async (parentId: number | undefined, text: string) => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
//     const newComment: Omit<Comment, "id"> = {
//       text,
//       date: new Date().toLocaleString(),
//       user: {
//         username: currentUser.username || "anonymous",
//         email: currentUser.email || "",
//         avatar: currentUser.avatar,
//       },
//       videoId,
//       likedBy: [],
//       ...(parentId !== undefined ? { parentId } : {}),
//     };

//     const res = await fetch("http://localhost:5000/comments", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newComment),
//     });
//     await res.json();
//     fetchComments();
//     if(onCommentAdded) onCommentAdded(videoId);
//   };
//   const handleDeleteComment = async (id:number)=>{
//      await fetch(`http://localhost:5000/comments/${id}`,{
//        method:"DELETE",
//      });
//      setComments(prev=>prev.filter(c=>c.id !== id));
//   };
//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//       {t("comments")} ({comments.length})
//       </Typography>

//       {comments.slice(0, visibleCount).map((comment) => (
//         <CommentItem
//           key={comment.id}
//           comment={comment}
//           onReply={handleAddComment}
//           onLikeUpdate={fetchComments} 
//           onDelete={handleDeleteComment}
//         />
//       ))}

//       {comments.length > visibleCount && (
//         <Button
//           variant="text"
//           onClick={() => setVisibleCount(comments.length)}
//           sx={{ color: "#f7266e", textTransform: "none", mt: 1,"&:focus": {
//               outline: "none",
//               boxShadow: "none",
//             },}}
//         >
//           {t("showMoreComments")}
//         </Button>
//       )}

//       <Box sx={{ mt: 3 }}>
//         <CommentInput onSubmit={(text) => handleAddComment(undefined, text)} />
//       </Box>
//     </Box>
//   );
// };

// export default CommentSection;
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useTranslation } from "react-i18next";
import { refreshAccessToken } from "../utils/authFetch";

interface Comment {
  id: number;
  parent?: number;
  video: number;
  text: string;
  date: string;
  user?: {
    username: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
  likedBy?: number[];
}

interface Props {
  videoId: number;
  onCommentAdded?: (videoId: number) => void;
}

const CommentSection: React.FC<Props> = ({ videoId, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const { t } = useTranslation("comments");

  const fetchComments = async () => {
    const res = await fetch(`https://codecaveback2.onrender.com/api/comments/?video=${videoId}`);
    const data: Comment[] = await res.json();

    const topLevel = data.filter((c) => !c.parent);
    const withReplies = topLevel.map((comment) => ({
      ...comment,
      replies: data.filter((r) => r.parent === comment.id),
    }));

    setComments(withReplies);
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (parentId: number | undefined, text: string) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const payload = {
      text,
      video: videoId,
      parent: parentId || null,
      user_email: currentUser.email,
    };

    const res = await fetch("https://codecaveback2.onrender.com/api/comments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchComments();
      if (onCommentAdded) onCommentAdded(videoId);
    } else {
      console.error("Failed to post comment");
    }
  };

  const handleDeleteComment = async (id: number) => {
    let token = localStorage.getItem("token");
  
    let res = await fetch(`https://codecaveback2.onrender.com/api/comments/${id}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        console.error("Unable to refresh token");
        return;
      }
  
      token = newToken;
  
      res = await fetch(`https://codecaveback2.onrender.com/api/comments/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  
    if (res.ok) {
      fetchComments();
    } else {
      const data = await res.json();
      console.error("Failed to delete comment", data);
    }
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        {t("comments")} ({comments.length})
      </Typography>

      {comments.slice(0, visibleCount).map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={handleAddComment}
          onLikeUpdate={fetchComments}
          onDelete={handleDeleteComment}
          level={0}
        />
      ))}

      {comments.length > visibleCount && (
        <Button
          variant="text"
          onClick={() => setVisibleCount(comments.length)}
          sx={{
            color: "#f7266e",
            textTransform: "none",
            mt: 1,
            "&:focus": { outline: "none", boxShadow: "none" },
          }}
        >
          {t("showMoreComments")}
        </Button>
      )}

      <Box sx={{ mt: 3 }}>
        <CommentInput onSubmit={(text) => handleAddComment(undefined, text)} />
      </Box>
    </Box>
  );
};

export default CommentSection;
