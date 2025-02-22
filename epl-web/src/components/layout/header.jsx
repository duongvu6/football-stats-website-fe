
import { Menu} from "antd";
import {AliwangwangOutlined, HomeOutlined, LoginOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

const Header = () => {
  const handleLogout = () => {

  };
  const [current, setCurrent] = useState("");
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const items = [
    {
      label: <Link to={"/"}>Home</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    // ...(!user.id ? [{
    //   label: <Link to={"/login"}>Đăng nhập</Link>,
    //   key: 'login',
    //   icon:<LoginOutlined />,
    // }] : []),
    {
      label: <Link to={"/login"}>Đăng nhập</Link>,
      key: 'login',
      icon:<LoginOutlined />
    },

    // ...(user.id  ? [{
    //   label: `Welcome ${user.fullName}`,
    //   key: "setting",
    //   icon:<AliwangwangOutlined />,
    //  children: [
    //   {
    //     label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
    //     key: 'logout',
    //   },
    //  ]
    // },] : []),
    {
      label: `Welcome Duong`,
      key: "setting",
      icon:<AliwangwangOutlined />,
      children: [
        {
          label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
          key: 'logout',
        },
      ]
    }
  ];
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
export default Header;
