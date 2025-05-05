import {useEffect} from "react";
import dayjs from "dayjs";
import {DatePicker, Form, Input, InputNumber, Select} from "antd";

const CoachForm = ({ form, initialValues = {}, formName = "coachForm" }) => {

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log('Initial values received:', initialValues);

            const dateOfBirth = initialValues.dob ? dayjs(initialValues.dob) : null;

            form.setFieldsValue({
                name: initialValues.name,
                dob: dateOfBirth,
                citizenships: initialValues.citizenships,
            });
        }
    }, [initialValues, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            name={formName}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter head coach name' }]}
            >
                <Input placeholder="Enter head coach name" />
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
        </Form>
    );
};

export default CoachForm;