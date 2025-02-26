import { ArrowRightOutlined } from "@ant-design/icons";
import {
    Button,
    Input,
    Form,
    Row,
    Col,
    Divider, notification, message,
} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {loginAPI} from "../services/api.service.js";
import {useContext, useState} from "react";
import {AuthContext} from "../components/context/auth.context.jsx";

const LoginPage = () => {
    const [form] = Form.useForm();
    const {setUser} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        const res = await loginAPI(values.email, values.password);
        if (res.data) {
            message.success("Login successfully");
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            navigate("/");
        } else {
            notification.error({
                message: "Login failed",
                description: JSON.stringify(res.message)
            });
        }
        setLoading(false);
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Login</legend>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                                {
                                    type: "email",
                                    message: "Email is not in correct format!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignContent: "center",
                                }}
                            >
                                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                    Login
                                </Button>
                                <Link to="/">
                                    Go to homepage <ArrowRightOutlined />
                                </Link>
                            </div>
                        </Form.Item>
                    </Form>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        <Link to={"/register"}>Create an account</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};
export default LoginPage;