import {useEffect, useState} from 'react';
import {Upload, Button, message, Image, notification} from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const ImageUploader = ({ entityType, onImageUpload, initialImageUrl }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (initialImageUrl) {
            setImageUrl(initialImageUrl);
        }
    }, [initialImageUrl]);

    const fullImageUrl = imageUrl;

    const customUpload = async (options) => {
        const { file, onSuccess, onError } = options;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', entityType); // 'player', 'coach', 'club', or 'league'

        setLoading(true);

        try {
            const response = await axios.post(
                `${backendUrl}/api/v1/files`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: localStorage.getItem('access_token')
                            ? `Bearer ${localStorage.getItem('access_token')}`
                            : '',
                    },
                }
            );
            console.log(response.data.data);
            if (response.data && response.data.statusCode === 200) {
                setImageUrl(response.data.data.fileUrl);
                onImageUpload(response.data.data.fileUrl);
                message.success('Image uploaded successfully');
                onSuccess(response, file);
            } else {
                notification.error(
                    {
                        message: 'Error uploading file',
                        description: response.data.message,
                    }
                )
                onError('Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            message.error('Error uploading image');
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        name: 'file',
        accept: '.jpg,.jpeg,.png',
        showUploadList: false,
        customRequest: customUpload,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
                return false;
            }
            return true;
        },
    };

    return (
        <div className="image-uploader">
            {fullImageUrl && (
                <div style={{ marginBottom: '10px' }}>
                    <Image
                        src={fullImageUrl}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                    />
                </div>
            )}

            <Upload {...uploadProps}>
                <Button
                    icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                    loading={loading}
                >
                    {loading ? 'Uploading' : (fullImageUrl ? 'Change Image' : 'Upload Image')}
                </Button>
            </Upload>
        </div>
    );
};

export default ImageUploader;