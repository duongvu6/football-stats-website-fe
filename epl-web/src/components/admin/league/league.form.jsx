import { Form, Input } from "antd";
import { useEffect } from "react";

const LeagueForm = ({ form, initialValues = {}, formName = "leagueForm" }) => {
    // Initialize form with values if in edit mode
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            form.setFieldsValue({
                name: initialValues.name
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
                rules={[{ required: true, message: 'Please enter league name' }]}
            >
                <Input placeholder="Enter league name" />
            </Form.Item>
        </Form>
    );
};

export default LeagueForm;