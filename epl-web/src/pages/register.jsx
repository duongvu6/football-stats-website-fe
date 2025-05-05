import { Button, Input, Form, notification, Row, Col, Divider  } from "antd";
import { registerUserAPI } from "../services/api.service";
import { useNavigate, Link} from "react-router-dom";
const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = async (values) =>{

        const res =  await registerUserAPI(
            values.fullName,
            values.email,
            values.password);

        if(res.data){
            notification.success({
                message: "Register user",
                description: "Register user successfully "
            });
            navigate("/login");
        }else{
            notification.error({
                message: "Error while registering user!",
                description: JSON.stringify(res.message)
            })
        }


    }
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}

            autoComplete="off"
            style={{margin:"30px"}}
        >
            <h3 style={{textAlign:"center"}}>Register</h3>
            <Row justify={"center"}>
                <Col xs={24} md = {8}>
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={"center"}>
                <Col xs={24} md = {8}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={"center"}>
                <Col xs={24} md = {8}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md = {8}>
                    <div>
                        <Button
                            onClick={()=> form.submit()}
                            type="primary">
                            Register
                        </Button>
                    </div>
                    <Divider />
                    <div>Already have account ? <Link to={"/login"}>Login here</Link></div>
                </Col>
            </Row>


        </Form>
    );
};
export default RegisterPage;