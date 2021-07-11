import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
	AppstoreOutlined,
	CoffeeOutlined,
	DotChartOutlined,
	LoginOutlined,
	LogoutOutlined,
	UserAddOutlined,
} from "@ant-design/icons";

import { UserContext } from "../contexts";

//logout request
import axios from "axios";
import { toast } from "react-toastify";
import router from "next/router";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
	const [currentPage, setCurrentPage] = useState("");

	const { state, dispatch } = useContext(UserContext);
	const { user } = state;

	useEffect(() => {
		process.browser && setCurrentPage(window.location.pathname);
	}, [process.browser && window.location.pathname]);
	//as Next uses ssg

	const logout = async () => {
		dispatch({ type: "LOGOUT" });
		window.localStorage.removeItem("x-next-user");
		const { data } = await axios.get("/api/logout");
		toast(data.messages);
		router.push("/login");
	};

	return (
		<Menu mode="horizontal" selectedKeys={[currentPage]}>
			<Item key="/" icon={<AppstoreOutlined />} onClick={(e) => setCurrentPage(e.key as string)}>
				<Link href="/">
					<a>Home</a>
				</Link>
			</Item>

			{!user && (
				<>
					<Item
						key="/login"
						icon={<LoginOutlined />}
						onClick={(e) => setCurrentPage(e.key as string)}
					>
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
				</>
			)}

			{user && (
				<SubMenu icon={<CoffeeOutlined />} title={user ? user.name : null} className="float-right">
					<ItemGroup>
						<Item key="/user" icon={<DotChartOutlined />} onClick={logout}>
							<Link href="/user">
								<a>Dashboard</a>
							</Link>
						</Item>
						<Item key="/logout" icon={<LogoutOutlined />} onClick={logout}>
							<Link href="/">
								<a>logout</a>
							</Link>
						</Item>
					</ItemGroup>
				</SubMenu>
			)}
		</Menu>
	);
};

export default TopNav;
