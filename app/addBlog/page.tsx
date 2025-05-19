'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type PostFormInputs = {
    title: string;
    content: string;
    author: string;
    image: FileList;
};

export default function AddBlogPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormInputs>();
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            await axios.post('/api/blogs', { ...data, image });
            reset();
            setImage(null);
            alert('Blog post added!');
        } catch (error) {
            alert('Failed to add blog post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter post title"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Content</label>
                    <textarea
                        {...register('content', { required: 'Content is required' })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter post content"
                        rows={6}
                    />
                    {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                </div>
               <input
                    type="file"
                    {...register("image", {
                        onChange: handleUpload
                    })}
                />
                {image && (
                    <img src={image} alt="Uploaded" className="mt-2 rounded w-full max-h-40 object-cover" />
                )}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}