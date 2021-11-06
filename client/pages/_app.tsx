import React, { useContext, useState, useEffect, Fragment } from "react";
import TopNav from "../components/TopNav";
import { useRouter } from "next/router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { UserContext, UserProvider } from "../contexts";
//
import { ToastContainer } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import { IUser } from "@Itypes/User";
import { Hidden } from "@mui/material";
//context

const AppWrapper = ({ children }) => {
	// frame alwyas thinks all uppercase functions are components
	const { state, dispatch } = useContext(UserContext);
	const router = useRouter();

	const [auth, setAuth] = useState<unknown>();

	useEffect(() => {
		window.addEventListener("storage", () => {
			const user = localStorage.getItem("x-next-user");
			const logout = async () => {
				dispatch({ type: "LOGOUT" });
				window.localStorage.removeItem("x-next-user");
				const { data } = await axios.get("/api/logout");
				console.log("Log out user from wrapper");
				router.push("/login");
			};
			setAuth(user);
			if (!user) {
				logout();
			}
		});
	}, []);
// https://stackblitz.com/edit/listen-to-changes-in-localstorage-c8mzxn-khk6k6?file=index.tsx
	return (
		<div>
			{children}
		</div>
	);
};

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			{/* Need to pass props down the line */}
				<ToastContainer position={"top-center"} />
				<TopNav />
				<Component {...pageProps} />WW
		</UserProvider>
	);
}

export default MyApp;
