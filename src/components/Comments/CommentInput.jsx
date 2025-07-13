import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../lib/api';
import useUserStore from '../../store/useUserStore';

export default function CommentInput({ videoId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { mutate: addComment } = usePost();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      textarea.style.height = `${Math.max(textarea.scrollHeight, 24)}px`; // Set new height (24px is min-height)
    }
  };

  // Adjust height on content change
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!content.trim()) return;

    try {
      const response = await addComment(`/comments/${videoId}`, { content });
      if (response?.data) {
        onCommentAdded(response.data);
        setContent(''); // Clear input after successful comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="flex items-start gap-3">
            <img 
              src={user?.avatar} 
              alt={user?.username || 'Channel avatar'}
              className="w-12 h-12 rounded-full object-cover bg-gray-300"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48x48?text=' + (user?.username?.charAt(0).toUpperCase() || 'U');
              }}
            />
      </div>
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 dark:bg-gray-800 border-b border-black dark:border-gray-700 focus:outline-none focus:border-b-2 resize-none overflow-hidden min-h-[24px]"
        rows={1}
      />
      {content.trim() && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setContent('')}
            className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className={`px-4 py-2 rounded-full ${
              content.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Comment
          </button>
        </div>
      )}
    </form>
    </div>
  );
}
