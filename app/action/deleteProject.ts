import prisma from "@/libs/prismadb"

export async function deleteProject(id: string) {
    try{
        const project = await prisma.post.delete({
            where: {
                id: id
            }
        });
        return project;
    }catch(e){
        console.log(e);
    }
}