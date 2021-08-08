import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
	AppstoreOutlined,
	CarryOutOutlined,
	CoffeeOutlined,
	DotChartOutlined,
	LoginOutlined,
	LogoutOutlined,
	TaobaoSquareFilled,
	TeamOutlined,
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

	const goDashboard = async () => {
		router.push("/user");
	};

	return (
		<Menu mode="horizontal" selectedKeys={[currentPage]}>
			<Item key="/" icon={<AppstoreOutlined />} onClick={(e) => setCurrentPage(e.key as string)}>
				<Link href="/">
					<a>Home</a>
				</Link>
			</Item>
			{/* The selected keys activate links provied by antd */}
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
			{user && user.role?.includes("Instructor") ? (
				<Item
					key="/inctructor/course/create"
					icon={<CarryOutOutlined />}
					onClick={(e) => setCurrentPage(e.key as string)}
				>
					<Link href="/inctructor/course/create">
						<a>Create Course</a>
					</Link>
				</Item>
			) : (
				user && (
					<Item
						key="/user/become-instructor"
						icon={<TeamOutlined />}
						onClick={(e) => setCurrentPage(e.key as string)}
					>
						<Link href="/user/become-instructor">
							<a>Become Instructor</a>
						</Link>
					</Item>
				)
			)}

			{user && (
				<SubMenu icon={<CoffeeOutlined />} title={user ? user.name : null} className="float-right">
					<ItemGroup>
						<Item key="/user" icon={<DotChartOutlined />} onClick={goDashboard}>
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

			{user && user.role?.includes("Instructor") ? (
				<Item
					className="float-right"
					key="/inctructor"
					icon={<TeamOutlined />}
					onClick={(e) => setCurrentPage(e.key as string)}
				>
					<Link href="/inctructor">
						<a>Instructor Dashboard</a>
					</Link>
				</Item>
			) : null}
		</Menu>
	);
};

export default TopNav;
