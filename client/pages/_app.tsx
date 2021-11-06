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
//context

function MyApp({ Component, pageProps }) {
	// https://stackblitz.com/edit/listen-to-changes-in-localstorage-c8mzxn-khk6k6?file=index.tsx
	useEffect(() => {
		//React is probably not available
		window.addEventListener("storage", () => {
			const user = localStorage.getItem("x-next-user");
			//React hooks are not available
			const logout = async () => {
				window.localStorage.removeItem("x-next-user");
				const { data } = await axios.get("/api/logout");
				localStorage.setItem('Hook_logoutLog',JSON.stringify(data))
				window.location.assign("/login");
			};
			if (!user) {
				logout();
			}
		});
	}, []);

	return (
		<UserProvider>
			{/* Need to pass props down the line */}
			<ToastContainer position={"top-center"} />
			<TopNav />
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default MyApp;
