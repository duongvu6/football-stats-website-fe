import {useContext} from "react";
import {AuthContext} from "../components/context/auth.context.jsx";
import {Button, Result} from "antd";
import {Link} from "react-router-dom";

const PrivateRoute = (props) => {
    const {user} = useContext(AuthContext);
    if (user && user.id && user.role === "ADMIN") {
        return (
            <>
                {props.children}
            </>
        );
    }
    return (
        <>
            {/* return <Navigate to="/login" replace />; */}
            <Result
                status="403"
                title="Unauthorize !"
                subTitle={"You need permission to access this url "}
                extra={<Button type="primary">
                    <Link to="/">
                        <span>Back to homepage</span>
                    </Link>
                </Button>}
            />
            );
        </>
    )
}
export default PrivateRoute;