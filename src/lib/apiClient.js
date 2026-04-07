const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function apiClient(endpoint, { method = 'GET', body, headers = {} } = {}) {
    const token = localStorage.getItem('adminAccessToken');

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned a non-JSON response. Check the API URL.');
    }

    const data = await response.json();

    if (!response.ok) {
        const message = typeof data === 'object'
            ? Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(', ')}`).join('\n')
            : data.detail || 'Something went wrong.';
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export default apiClient;
