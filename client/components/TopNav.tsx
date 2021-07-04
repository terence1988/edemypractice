import { useState, useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { AppstoreOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const { Item } = Menu;

const TopNav = () => {
	const [currentPage, setCurrentPage] = useState("");

	useEffect(() => {
		process.browser && setCurrentPage(window.location.pathname);
	}, [process.browser && window.location.pathname]);
	//as Next uses ssg

	return (
		<Menu mode="horizontal" selectedKeys={[currentPage]}>
			<Item key="/" icon={<AppstoreOutlined />} onClick={(e) => setCurrentPage(e.key as string)}>
				<Link href="/">
					<a>App</a>
				</Link>
			</Item>

			<Item key="/login" icon={<LoginOutlined />} onClick={(e) => setCurrentPage(e.key as string)}>
				<Link href="/login">
					<a>Login</a>
				</Link>
			</Item>

			<Item
				key="/register"
				icon={<UserAddOutlined />}
				onClick={(e) => setCurrentPage(e.key as string)}
			>
				<Link href="/register">
					<a>Register</a>
				</Link>
			</Item>
		</Menu>
	);
};

export default TopNav;
