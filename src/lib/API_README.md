# Simple API Module

A clean, simple API module using axios for making HTTP requests in React applications.

## 🚀 Features

- ✅ GET, POST, PUT, PATCH, DELETE methods
- ✅ React hooks for easy integration
- ✅ Infinite query for videos
- ✅ Automatic authentication token handling
- ✅ Request cancellation on component unmount
- ✅ Simple error handling

## 🛠️ Setup

1. Add your API base URL to `.env`:
```env
VITE_API_BASE_URL=https://your-api.com/api
```

2. Import and use:
```jsx
import { useFetch, usePost, useInfiniteVideos } from '@/lib/api';
```

## 📖 Basic Usage

### GET Request
```jsx
import { useFetch } from '@/lib/api';

function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useFetch(`/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### POST Request
```jsx
import { usePost } from '@/lib/api';

function CreateUser() {
  const { mutate: createUser, loading, error } = usePost();

  const handleSubmit = async (userData) => {
    try {
      await createUser('/users', userData);
      alert('User created!');
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={() => handleSubmit({ name: 'John' })} disabled={loading}>
      {loading ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

### PUT/PATCH Request
```jsx
import { usePut, usePatch } from '@/lib/api';

function UpdateUser({ userId }) {
  const { mutate: updateUser, loading } = usePut();
  // or const { mutate: patchUser, loading } = usePatch();

  const handleUpdate = async () => {
    await updateUser(`/users/${userId}`, { name: 'New Name' });
  };

  return (
    <button onClick={handleUpdate} disabled={loading}>
      {loading ? 'Updating...' : 'Update'}
    </button>
  );
}
```

### DELETE Request
```jsx
import { useDelete } from '@/lib/api';

function DeleteUser({ userId }) {
  const { mutate: deleteUser, loading } = useDelete();

  const handleDelete = async () => {
    if (confirm('Delete user?')) {
      await deleteUser(`/users/${userId}`);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Infinite Videos Query
```jsx
import { useInfiniteVideos } from '@/lib/api';

function VideosList() {
  const { 
    videos, 
    loading, 
    loadingMore, 
    hasMore, 
    loadMore, 
    refresh 
  } = useInfiniteVideos('/videos', 12); // 12 videos per page

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      
      {videos.map(video => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      ))}
      
      {hasMore && (
        <button onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## 🔧 Direct API Usage

For more control, use the API object directly:

```jsx
import { api } from '@/lib/api';

// GET request
const users = await api.get('/users');
const userWithParams = await api.get('/users', { page: 1, limit: 10 });

// POST request
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await api.put('/users/1', { name: 'Jane' });

// PATCH request
const patchedUser = await api.patch('/users/1', { email: 'jane@example.com' });

// DELETE request
await api.delete('/users/1');
```

## 🔐 Authentication

Set authentication token:

```jsx
import { setAuthToken } from '@/lib/api';

// Set token (will be included in all future requests)
setAuthToken('your-jwt-token');

// Clear token
setAuthToken(null);
```

The token will be automatically included in the `Authorization: Bearer <token>` header for all requests.

## 📱 API Response Format

The module expects API responses in this format:

### For regular requests:
```json
{
  "data": { ... },
  "message": "Success"
}
```

### For infinite videos:
```json
{
  "videos": [...],     // or "data": [...]
  "totalPages": 10,
  "total": 120,
  "page": 1
}
```

## ⚙️ Configuration

You can customize the axios instance by modifying `src/lib/api.js`:

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,        // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🛡️ Error Handling

All hooks return an `error` object when requests fail:

```jsx
const { data, loading, error } = useFetch('/users');

if (error) {
  console.error(error.message);
  console.error(error.response?.status); // HTTP status code
  console.error(error.response?.data);   // Server error details
}
```

## 🚨 Notes

- Requests are automatically cancelled when components unmount
- 401 errors automatically clear the auth token
- All hooks handle loading states automatically
- The infinite videos hook is specifically optimized for video pagination

That's it! Simple and effective API handling for your React app. 🎉 