import { useState } from 'react';
import { usePatch, useDelete } from '../../lib/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

dayjs.extend(relativeTime);

export default function Comment({ comment, onDelete, onUpdate, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showOptions, setShowOptions] = useState(false);
  const { mutate: updateComment } = usePatch();
  const { mutate: deleteComment } = useDelete();

  const handleUpdate = async () => {
    try {
      const response = await updateComment(`/comments/c/${comment._id}`, {
        content: editContent
      });
      if (response?.data) {
        onUpdate(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(`/comments/c/${comment._id}`);
      onDelete(comment._id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="flex gap-3 group">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full object-cover"
        onError={(e) => {
          e.target.src = `https://via.placeholder.com/40x40?text=${comment.owner?.username?.charAt(0).toUpperCase() || 'U'}`;
        }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.owner?.username}</span>
          <span className="text-xs text-gray-500">{dayjs(comment.createdAt).fromNow()}</span>
          
          {isOwner && (
            <div className="relative ml-auto">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-1 py-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-1 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border-b outline-none focus:border-b-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              rows={1}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1 text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-1">{comment.content}</p>
        )}
      </div>
    </div>
  );
} 