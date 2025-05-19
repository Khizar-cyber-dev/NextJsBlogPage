import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

const getUser = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return null;
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) {
            return null;
        }

        return currentUser;
    } catch (err) {
        return null;
    }
};

export default getUser;