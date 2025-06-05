"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    email: string | null;
  };
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { data: session } = useSession();

  // 댓글 목록 조회
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to fetch comments: ${response.status} ${
            errorData?.error || response.statusText
          }${errorData?.details ? ` - ${errorData.details}` : ""}`
        );
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to create comment: ${response.status} ${
            errorData?.error || response.statusText
          }${errorData?.details ? ` - ${errorData.details}` : ""}`
        );
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to update comment: ${response.status} ${
            errorData?.error || response.statusText
          }`
        );
      }

      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: string) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to delete comment: ${response.status} ${
            errorData?.error || response.statusText
          }`
        );
      }

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">댓글</h2>

      {/* 댓글 작성 폼 */}
      {session && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full p-2 border rounded-lg mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "작성 중..." : "댓글 작성"}
          </button>
        </form>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {comment.user.email || "익명"}
                </span>
                <span className="text-gray-500 text-sm">
                  {format(new Date(comment.createdAt), "PPP", { locale: ko })}
                </span>
              </div>
              {session?.user?.email === comment.user.email && (
                <div className="flex gap-2">
                  {editingCommentId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {editingCommentId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
