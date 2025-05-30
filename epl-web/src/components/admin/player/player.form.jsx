import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import {useEffect, useState} from "react";
import dayjs from 'dayjs';
import ImageUploader from "../../common/ImageUploader.jsx";

const PlayerForm = ({ form, initialValues = {}, formName = "playerForm" }) => {
    const [imageFileName, setImageFileName] = useState(initialValues?.imageUrl || null);
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log('Initial values received:', initialValues);

            const dateOfBirth = initialValues.dob ? dayjs(initialValues.dob) : null;

            form.setFieldsValue({
                name: initialValues.name,
                dob: dateOfBirth,
                marketValue: initialValues.marketValue,
                shirtNumber: initialValues.shirtNumber,
                citizenships: initialValues.citizenships,
                positions: initialValues.positions,
                imageUrl: initialValues.imageUrl
            });
            setImageFileName(initialValues.imageUrl);
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
                rules={[{ required: true, message: 'Please enter player name' }]}
            >
                <Input placeholder="Enter player name" />
            </Form.Item>

            <Form.Item
                name="dob"
                label="Date of birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
                tooltip="Age will be calculated automatically"
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select birth date"
                    format="YYYY-MM-DD"
                />
            </Form.Item>

            <Form.Item
                name="shirtNumber"
                label="Shirt Number"
                rules={[{ required: true, message: 'Please enter shirt number' }]}
            >
                <InputNumber min={1} max={99} style={{ width: '100%' }} placeholder="Enter shirt number" />
            </Form.Item>

            <Form.Item
                name="marketValue"
                label="Market Value(millions Euro)"
                rules={[{required: true, message: 'Please enter market value' }]}
            >
                <InputNumber step={0.1} precision={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="citizenships"
                label="Citizenships"
                rules={[{ required: true, message: 'Please select at least one citizenship' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter citizenships"
                />
            </Form.Item>

            <Form.Item
                name="positions"
                label="Positions"
                rules={[{ required: true, message: 'Please select at least one position' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Select positions"
                />
            </Form.Item>
            <Form.Item
                name="imageUrl"
                label="Player Image"
                tooltip="Upload a player photo (JPG or PNG format)"
            >
                <ImageUploader 
                    entityType="player" 
                    initialImageUrl={imageFileName} 
                    onImageUpload={handleImageUpload}
                />
            </Form.Item>
        </Form>
    );
};

export default PlayerForm;