// epl-web/src/components/admin/league-season/league.season.form.jsx
import { DatePicker, Form, Input, notification } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

const LeagueSeasonForm = ({ form, initialValues = {}, formName = "leagueSeasonForm" }) => {
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            form.setFieldsValue({
                name: initialValues.name,
                startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
                endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null
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
                label="Season Name"
                rules={[{ required: true, message: 'Please enter season name' }]}
            >
                <Input placeholder="Enter season name (e.g., 2023/2024)" />
            </Form.Item>

            <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                />
            </Form.Item>

            <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select end date' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                />
            </Form.Item>
        </Form>
    );
};

export default LeagueSeasonForm;