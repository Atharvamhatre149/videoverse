import { useState, useEffect } from 'react';
import { useFetch } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import CommentInput from './CommentInput';
import Comment from './Comment';

export default function CommentSection({ videoId }) {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const { user } = useUserStore();
  const [commentCount, setCommentCount] = useState(0);
  
  const { data: commentsData, loading, error } = useFetch(
    videoId ? `/comments/${videoId}?page=${page}&limit=10` : null
  );

  useEffect(() => {
    
    if (commentsData?.data?.docs) {
      if (page === 1) {
        setComments(commentsData.data.docs);
      } else {
        setComments(prev => [...prev, ...commentsData.data.docs]);
      }
      setCommentCount(commentsData?.data?.totalDocs)
    }
  }, [commentsData]);

  const handleCommentAdded = (newComment) => {
    console.log("new comment: ",newComment);

    setComments(prev => [newComment, ...prev]);
    setCommentCount(prev => prev+1)
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    setCommentCount(prev => prev-1)
  };

  const loadMore = () => {
    if (commentsData?.data?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">
        Comments {commentCount ? `(${commentCount})` : ''}
      </h3>
      
      <CommentInput videoId={videoId} onCommentAdded={handleCommentAdded} />

      <div className="mt-8 space-y-4">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            isOwner={user?._id === comment.owner?._id}
            onDelete={handleCommentDeleted}
            onUpdate={handleCommentUpdated}
          />
        ))}
      </div>

      {loading && <div className="text-center py-4">Loading comments...</div>}
      
      {error && (
        <div className="text-center py-4 text-red-500">
          Error loading comments: {error.message}
        </div>
      )}

      {commentsData?.data?.hasNextPage && (
        <button
          onClick={loadMore}
          className="mt-4 w-full py-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          Load more comments
        </button>
      )}
    </div>
  );
} 