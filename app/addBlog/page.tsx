'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

type PostFormInputs = {
  title: string;
  content: string;
  author: string;
  image: FileList;
};

export default function AddBlogPage() {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<PostFormInputs>();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const postId = useSearchParams().get('blogId');
  const router = useRouter();

  useEffect(() => {
    if (postId) {
      (async () => {
        try {
          const response = await axios.get(`/api/blogs?blogId=${postId}`);
          const post = response.data;
          setValue('title', post.title);
          setValue('content', post.content);
          setImage(post.image);
        } catch (error) {
          console.error('Error fetching blog post:', error);
          toast.error('Failed to fetch blog post');
        }
      })();
    }
  }, [postId, setValue]);

  const handleUpload = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PostFormInputs) => {
    setLoading(true);
    try {
      if (postId) {
        await axios.put(`/api/blogs?blogId=${postId}`, {
          title: data.title,
          content: data.content,
          image,
        });
        toast.success('Blog post updated!');
      } else {
        await axios.post('/api/blogs', { ...data, image });
        toast.success('Blog post added!');
      }
      reset();
      setImage(null);
      router.push('/home');
    } catch (error) {
      toast.error(postId ? 'Failed to update blog post' : 'Failed to add blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {postId ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h1>
          <button
            onClick={() => router.push('/home')}
            className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
          >
            <FiArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={6}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your content here..."
            />
            {errors.content && <span className="text-sm text-red-500">{errors.content.message}</span>}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Cover Image</label>
            <input
              type="file"
              {...register('image', { onChange: handleUpload })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="mt-4 rounded-lg w-full max-h-60 object-cover border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            {loading ? (postId ? 'Updating...' : 'Adding...') : postId ? 'Update Blog' : 'Add Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}
