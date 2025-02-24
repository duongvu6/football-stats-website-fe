
import { Menu} from "antd";
import {AliwangwangOutlined, HomeOutlined, LoginOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useState} from "react";

const Header = () => {
  const handleLogout = () => {

  };
  const [current, setCurrent] = useState("");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const items = [
    {
      label: <Link to={"/"}>Home</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={"/login"}>Đăng nhập</Link>,
      key: 'login',
      icon:<LoginOutlined />
    },
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
