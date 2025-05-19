import React from 'react';
import { getAllBlogs } from '../action/getAllBlogs';
import { FiEdit, FiTrash2, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { DeleteButton } from './components/DeleteButton';

const Page = async () => {
  const posts = await getAllBlogs();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Blog Posts</h1>
          <p className="text-lg text-gray-600">Discover stories, ideas, and knowledge from our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
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
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {post.author?.name || 'Unknown Author'}
                    </span>
                  </div>
                  
                  {post.author && (
                    <div className="flex space-x-2">
                      <Link 
                        href={`/edit-blog/${post.id}`}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </Link>
                       <DeleteButton projectId={post.id}/>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <Link 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-500">No blog posts yet</h3>
            <Link 
              href="/add-blog" 
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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