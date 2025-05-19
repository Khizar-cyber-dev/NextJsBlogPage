import getUser from '@/app/action/getUser';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('blogId');
        if (blogId) {
            const blog = await prisma.post.findUnique({
                where: { id: blogId },
                include: { author: true },
            });
            return NextResponse.json(blog, { status: 200 });
        } else {
            const blogs = await prisma.post.findMany({
                include: { author: true },
            });
            return NextResponse.json(blogs, { status: 200 });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const author = await getUser();
        const { title, content, image } = body;
        if (!author) {
            return NextResponse.json({ error: "Author not found" }, { status: 401 });
        }
        const newBlog = await prisma.post.create({
            data: {
                title,
                content,
                image,
                authorId: author.id,
            },
        });
        return NextResponse.json(newBlog, { status: 201 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('blogId');
        const body = await request.json();
        const { title, content, image } = body;
        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }
        const updatedBlog = await prisma.post.update({
            where: { id: blogId },
            data: { title, content, image },
        });
        return NextResponse.json(updatedBlog, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('blogId');
        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }
        const deleteblog = await prisma.post.delete({
            where: { id: blogId },
        });
        return NextResponse.json(deleteblog, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}