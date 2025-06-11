"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    email: string;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    email: string;
  };
  post: {
    id: string;
    title: string;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    const isAdmin =
      session?.user?.role === "admin" || session?.user?.role === "root";
    if (!session || !isAdmin) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/posts"),
          fetch("/api/admin/comments"),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          console.log("Users data:", usersData);
          setUsers(usersData);
        }

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          console.log("Posts data:", postsData);
          setPosts(postsData);
        }

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          console.log("Comments data:", commentsData);
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const handleToggleRole = async (userId: string) => {
    if (!confirm("사용자의 역할을 변경하시겠습니까?")) return;

    try {
      console.log("Toggling role for user:", userId);
      const res = await fetch(`/api/admin/users/${userId}/toggle-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        console.log("Role updated successfully:", updatedUser);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
      } else {
        const errorText = await res.text();
        console.error("Toggle role error:", errorText);
        alert("역할 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error toggling role:", error);
      alert("역할 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      console.log("Deleting post:", postId);
      const res = await fetch(`/api/admin/posts/${postId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        console.log("Post deleted successfully");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        const errorData = await res.json();
        console.error("Delete post error:", errorData);
        alert(errorData.error || "게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      console.log("Deleting comment:", commentId);
      const res = await fetch(`/api/admin/comments/${commentId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        console.log("Comment deleted successfully");
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        const errorText = await res.text();
        console.error("Delete comment error:", errorText);
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              사용자 관리
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`${
                activeTab === "posts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              게시글 관리
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`${
                activeTab === "comments"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              댓글 관리
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">사용자 목록</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users
                .filter((user) => user.role !== "root")
                .map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          역할: {user.role}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleRole(user.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {user.role === "admin"
                          ? "일반 사용자로 변경"
                          : "관리자로 변경"}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "posts" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">게시글 목록</h2>
          {posts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <li key={post.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {post.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          작성자: {post.user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          작성일:{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === "comments" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">댓글 목록</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {comments.map((comment) => (
                <li key={comment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        작성자: {comment.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        게시글: {comment.post.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        작성일:{" "}
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
