import { Form, Input } from "antd";
import {useEffect, useState} from "react";
import ImageUploader from "../../common/ImageUploader.jsx";

const LeagueForm = ({ form, initialValues = {}, formName = "leagueForm" }) => {
    const [imageFileName, setImageFileName] = useState(initialValues?.imageUrl || null);
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            form.setFieldsValue({
                name: initialValues.name
            });
        }
    }, [initialValues, form]);
    const handleImageUpload = (fileName) => {
        setImageFileName(fileName);
        form.setFieldsValue({ imageUrl: fileName });
    };
    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter league name' }]}
            >
                <Input placeholder="Enter league name" />
            </Form.Item>
            <Form.Item
                name="imageUrl"
                label="League Logo"
                tooltip="Upload a league logo (JPG or PNG format)"
            >
                <ImageUploader
                    entityType="league"
                    initialImageUrl={imageFileName}
                    onImageUpload={handleImageUpload}
                />
            </Form.Item>
        </Form>
    );
};

export default LeagueForm;