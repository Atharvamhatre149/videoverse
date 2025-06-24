import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePost } from '../../lib/api';
import { Input} from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUserStore from '../../store/useUserStore';

export default function Login() {
    const navigate = useNavigate();
    const { mutate: login, loading, error } = usePost();
    const setUser = useUserStore(state => state.setUser);
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
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

    const validateForm = () => {
        const errors = {};
        
        if (!formData.username.trim()) {
            errors.username = 'Username or email is required';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await login('/users/login', formData);
           
            if(response?.statusCode === 200) {
                setUser(response.data);
                navigate("/");
            }

        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleError = (error) => {
        if(error?.status === 400){
            return "User does not exist";
        }
        else if(error?.status === 401){
            return "Invalid user credentials";
        }
        return "";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-sm w-full space-y-8 p-2 shadow-input rounded-2xl">
                <div>
                    <h2 className="mt-7 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="on">
                    <div className="space-y-4">
                        {/* Username or Email Field */}
                        <div className='mx-4'>
                            <Label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                                Username or Email
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`appearance-none relative block w-full px-3 py-2 border ${
                                    formErrors.username ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your username or email"
                                data-form-type="login"
                            />
                            {formErrors.username && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className='mx-4'>
                            <Label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`appearance-none relative block w-full px-3 py-2 border ${
                                    formErrors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Enter your password"
                                data-form-type="login"
                            />
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* API Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-4">
                            <p className="text-sm text-red-600">
                                {handleError(error)}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='mx-4 mb-9'>
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
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}