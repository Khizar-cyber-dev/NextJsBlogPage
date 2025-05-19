import bcrypt from 'bcrypt';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        if (!name || !email || !password || !confirmPassword) {
            return new NextResponse('Name, email, password, and confirmPassword are required', { status: 400 });
        }

        if (password !== confirmPassword) {
            return new NextResponse('Passwords do not match', { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new NextResponse('Email already in use', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPassword
            }
        });

        return NextResponse.json(user);
    }
    catch (e: any) {
        console.error(e); 
        return new NextResponse("Internal Error", { status: 500 });
    }
}