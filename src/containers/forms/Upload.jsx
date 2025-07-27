import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload as UploadIcon } from '@/components/animate-ui/icons/upload';

export default function Upload() {
    const navigate = useNavigate();
    const { mutate: uploadVideo, loading } = usePost();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null
    });
    
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
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

        if (file) {
            if (type === 'thumbnail') {
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

                // Create thumbnail preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setThumbnailPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (type === 'videoFile') {
                if (file.size > 100 * 1024 * 1024) { // 100MB limit
                    setFormErrors(prev => ({
                        ...prev,
                        [type]: 'Video size should be less than 100MB'
                    }));
                    return;
                }

                if (!file.type.startsWith('video/')) {
                    setFormErrors(prev => ({
                        ...prev,
                        [type]: 'Please upload a video file'
                    }));
                    return;
                }

                // Create video preview URL
                const videoURL = URL.createObjectURL(file);
                setVideoPreview(videoURL);
            }

            setFormData(prev => ({
                ...prev,
                [type]: file
            }));

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
        
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        
        if (!formData.videoFile) {
            errors.videoFile = 'Video file is required';
        }
        
        if (!formData.thumbnail) {
            errors.thumbnail = 'Thumbnail is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('videoFile', formData.videoFile);
        formDataToSend.append('thumbnail', formData.thumbnail);

        try {
            const response = await uploadVideo('/videos/publish-video', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response?.data?._id) {              
                navigate(`/watch/${response.data._id}`);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setFormErrors(prev => ({
                ...prev,
                submit: err.message || 'Failed to upload video'
            }));
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Upload Video</h1>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Video Upload */}
                    <div className="space-y-4">
                        <Label htmlFor="videoFile">Video</Label>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {videoPreview ? (
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <UploadIcon size={48} className="text-gray-400 mb-2" />
                                    <span className="text-gray-500">Upload Video (Max 100MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="videoFile"
                                name="videoFile"
                                accept="video/*"
                                onChange={(e) => handleFileChange(e, 'videoFile')}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        {formErrors.videoFile && (
                            <p className="text-sm text-red-600">{formErrors.videoFile}</p>
                        )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-4">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <UploadIcon size={48} className="text-gray-400 mb-2" />
                                    <span className="text-gray-500">Upload Thumbnail (Max 5MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'thumbnail')}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        {formErrors.thumbnail && (
                            <p className="text-sm text-red-600">{formErrors.thumbnail}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter video title"
                        />
                        {formErrors.title && (
                            <p className="text-sm text-red-600">{formErrors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter video description"
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formErrors.description && (
                            <p className="text-sm text-red-600">{formErrors.description}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {formErrors.submit && (
                        <p className="text-sm text-red-600 text-center">{formErrors.submit}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </form>
            </div>
        </div>
    );
} 