import { Menu, message, notification } from "antd";
import { AliwangwangOutlined, HomeOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { logoutAPI } from "../../services/api.service.js";
import { AuthContext } from "../context/auth.context.jsx";
import { AdminIcon, ClubIcon, CoachIcon, PlayerIcon } from "../icons/icons.jsx";

const Header = () => {
  const [current, setCurrent] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const handleLogout = async () => {
    const res = await logoutAPI();
    console.log(res);
    if (res.data) {
      // clear data
      localStorage.removeItem("access_token");
      let logoutUser = {
        email: "",
        name: "",
        role: "",
        id: "",
      };
      setUser(logoutUser);
      message.success("Logout successfully");
      // redirect to home
      navigate("/");
    } else {
      if (res.message) {
        notification.error({
          message: "Log out failed!",
          description: JSON.stringify(res.message),
        });
      } else {
        notification.error({
          message: "Log out failed!",
        });
      }
    }
  };
  const items = [
    {
      label: <Link to={"/"}>Home</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={user.role === "ADMIN" ? "/admin/players" : "/players"}>Player</Link>,
      key: "players",
      icon: <PlayerIcon />,
    },
    {
      label: <Link to={"/clubs"}>Club</Link>,
      key: "clubs",
      icon: <ClubIcon />,
    },
    {
      label: <Link to={"/coaches"}>Head Coach</Link>,
      key: "coaches",
      icon: <CoachIcon />,
    },
    ...(user.role === "ADMIN" ? [
      {
        label: <Link to={"/admin"}>Admin Dashboard</Link>,
        key: "admin",
        icon: <AdminIcon />
      }
    ] : []),
    ...(!user.id ? [
      {
        label: <Link to={"/login"}>Login</Link>,
        key: "login",
        icon: <LoginOutlined />,
      },
    ] : []),
    ...(user.id ? [
      {
        label: `Welcome ${user.name}`,
        key: "setting",
        icon: <AliwangwangOutlined />,
        children: [
          {
            label: <span onClick={() => handleLogout()}>Logout</span>,
            key: "logout",
          },
        ],
      },
    ] : [])
  ];
  return (
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};
export default Header;