function normalizeAdminUser(payload) {
    const rawUser = payload?.user ?? payload;

    if (!rawUser || typeof rawUser !== 'object') {
        return null;
    }

    return {
        id: rawUser.id ?? null,
        fullName: rawUser.fullName ?? rawUser.full_name ?? null,
        role: rawUser.role ?? null,
        branchCode: rawUser.branchCode ?? rawUser.branch_code ?? null,
    };
}

export async function getCurrentAdminUser(request) {
    const baseUrl = process.env.DJANGO_API_BASE_URL;
    const endpointPath = process.env.DJANGO_ADMIN_ME_PATH ?? '/api/admin/me/';

    if (!baseUrl) {
        throw new Error('DJANGO_API_BASE_URL is not configured');
    }

    const djangoUrl = `${baseUrl.replace(/\/$/, '')}${endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`}`;
    const cookieHeader = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');

    const response = await fetch(djangoUrl, {
        method: 'GET',
        headers: {
            ...(cookieHeader ? { cookie: cookieHeader } : {}),
            ...(authHeader ? { authorization: authHeader } : {}),
            accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (response.status === 401 || response.status === 403 || response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Django user endpoint failed with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeAdminUser(data);
}
