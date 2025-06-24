import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePost } from '../../lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUserStore from '../../store/useUserStore';
import { Upload } from '@/components/animate-ui/icons/upload';

export default function Register() {
    const navigate = useNavigate();
    const { mutate: register, loading, error } = usePost();
    const setUser = useUserStore(state => state.setUser);
    
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null
    });
    
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        console.log(file);
        
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFormErrors(prev => ({
                    ...prev,
                    [type]: 'Image size should be less than 5MB'
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setFormErrors(prev => ({
                    ...prev,
                    [type]: 'Please upload an image file'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                [type]: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') {
                    setAvatarPreview(reader.result);
                } else {
                    setCoverPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);

            // Clear error
            if (formErrors[type]) {
                setFormErrors(prev => ({
                    ...prev,
                    [type]: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.fullname.trim()) {
            errors.fullname = 'Full name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.avatar) {
            errors.avatar = 'Avatar is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Create FormData for multipart/form-data
        const formDataToSend = new FormData();
        
        // Add text fields
        formDataToSend.append('username', formData.username);
        formDataToSend.append('fullname', formData.fullname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        
        // Add files with field names matching multer
        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar); // This will be req.files.avatar
        }
        
        if (formData.coverImage) {
            formDataToSend.append('coverImage', formData.coverImage); // This will be req.files.coverImage
        }

        try {
            const response = await register('/users/register', formDataToSend);
            console.log(response);
            
            if(response?.statusCode === 201) {
                setUser(response.data);
                navigate("/");
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const handleError = (error) => {
        if(error?.status === 409) {
            return "Username or email already exists";
        }
        return "Registration failed. Please try again.";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 p-8 shadow-input rounded-2xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-400 hover:text-blue-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-7">
                        {/* Cover Image Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                {coverPreview ? (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <Upload size={32} className="text-gray-400" />
                                        <span className="ml-2 text-gray-400">Upload Cover Image (Optional)</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="coverImage"
                                    name="coverImage"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'coverImage')}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="coverImage"
                                    className="absolute bottom-2 right-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2 cursor-pointer shadow-lg"
                                >
                                    <Upload size={16} />
                                </label>
                            </div>
                            {formErrors.coverImage && (
                                <p className="text-sm text-red-600">{formErrors.coverImage}</p>
                            )}
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-24 h-24">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <Upload size={32} className="text-gray-400" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="avatar"
                                    className="absolute bottom-0 right-0 bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2 cursor-pointer shadow-lg"
                                >
                                    <Upload size={16} />
                                </label>
                            </div>
                            {formErrors.avatar && (
                                <p className="text-sm text-red-600">{formErrors.avatar}</p>
                            )}
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Username Field */}
                            <div>
                                <Label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`${formErrors.username ? 'border-red-300' : ''}`}
                                    placeholder="Choose a username"
                                />
                                {formErrors.username && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                                )}
                            </div>

                            {/* Full Name Field */}
                            <div>
                                <Label htmlFor="fullname" className="mb-1 block text-sm font-medium text-gray-700">
                                    Full Name
                                </Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className={`${formErrors.fullname ? 'border-red-300' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                {formErrors.fullname && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.fullname}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`${formErrors.email ? 'border-red-300' : ''}`}
                                    placeholder="Enter your email"
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`${formErrors.password ? 'border-red-300' : ''}`}
                                    placeholder="Create a password"
                                />
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* API Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-600">
                                {handleError(error)}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}