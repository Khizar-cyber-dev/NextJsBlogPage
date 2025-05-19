import prisma from '@/libs/prismadb'

export async function getAllBlogs(){
    try{
        const blogs = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true
            }
        })
        return blogs
    }catch(e){
        console.log(e);
    }
}