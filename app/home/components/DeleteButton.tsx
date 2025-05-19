'use client';

import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

export function DeleteButton({ projectId }: { projectId: string }) {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/blogs?blogId=${projectId}`);
      
      if (!response) throw new Error('Failed to delete project');
      
      toast.success('Project deleted successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Delete error:', error);
    }
  };

  return (
    <button
      className="text-red-600 hover:text-red-700"
      onClick={handleDelete}
    >
      <FiTrash2 className="h-4 w-4 mr-2" />
      Delete
    </button>
  );
};