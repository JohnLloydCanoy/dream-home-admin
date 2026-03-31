import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/admin-user-repository';

export async function GET() {
    try {
        const user = await getCurrentAdminUser();

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Failed to fetch admin user', error);

        return NextResponse.json(
        { error: 'Failed to fetch admin user' },
        { status: 500 }
        );
    }
}
