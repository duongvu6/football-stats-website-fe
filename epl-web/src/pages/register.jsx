import { Button, Input, Form, notification, Row, Col, Divider  } from "antd";
import { registerUserAPI } from "../services/api.service";
import { useNavigate, Link} from "react-router-dom";
const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();


    const onFinish = async (values) =>{
        // call apivalues.
        const res =  await registerUserAPI(
            values.fullName,
            values.email,
            values.password);

        if(res.data){
            notification.success({
                message: "Register user",
                description: "Đăng ký user thành công "
            });
            navigate("/login");
        }else{
            notification.error({
                message: "Register user error",
                description: JSON.stringify(res.message)
            })
        }


    }
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{margin:"30px"}}
        >
            <h3 style={{textAlign:"center"}}>Đăng ký tài khoản</h3>
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

                        {/* <Button
                    onClick={() =>{
                      form.setFieldsValue({
                        email: "hoidanit@gmail.com",
                        fullName: "eric"
                      })
                      console.log(">>> Check form :",  form.getFieldsValue())

                    }}
                    >Test</Button> */}
                    </div>
                    <Divider />
                    <div>Đã có tài khoản ? <Link to={"/login"}>Đăng nhập tại đây</Link></div>
                </Col>
            </Row>


        </Form>
    );
};
export default RegisterPage;