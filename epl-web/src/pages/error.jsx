import { Link, useRouteError } from "react-router-dom";
import '../styles/error/error.css'
import {Button, Result} from "antd";
import Paragraph from "antd/es/typography/Paragraph.js";
import {CloseCircleOutlined} from "@ant-design/icons";
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    return (

        <>
            <div>
                <Result
                    status="error"
                    title="Oops!"
                    subTitle="Sorry, an unexpected error has occurred."
                    extra={[
                        <Button><Link to={"/"}>Back to homepage</Link></Button>
                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <CloseCircleOutlined className="site-result-demo-error-icon" /> Error: {error.statusText || error.message}

                        </Paragraph>
                    </div>
                </Result>
            </div>
        </>
    );
}