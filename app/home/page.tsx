

import React from 'react';
import { getAllBlogs } from '../action/getAllBlogs';
import { FiEdit, FiUser, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { DeleteButton } from './components/DeleteButton';

const Page = async () => {
  const posts = await getAllBlogs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">All Blog Posts</h1>
            <p className="text-lg text-gray-600">Discover stories, ideas, and knowledge from our community.</p>
          </div>

          <Link
            href="/addBlog"
            className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all"
          >
            <FiPlus className="mr-2" />
            Create New Post
          </Link>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
          >
            {post.image && (
              <div className="h-52 rounded-t-3xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {'image' in (post.author ?? {}) && (post.author as any).image ? (
                    <img
                      src={(post.author as any).image}
                      alt={post.author.name ?? 'Author'}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800">
                    {post.author?.name || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/addBlog?blogId=${post.id}`}
                    className="px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    title="Edit"
                  >
                    <FiEdit className="inline mr-1" />
                    Edit
                  </Link>
                  <DeleteButton projectId={post.id} />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>



        {posts?.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium text-gray-500">No blog posts yet</h3>
            <Link
              href="/addBlog"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
