import { useContext, useEffect, Dispatch } from "react";
import { UserContext } from "../contexts";
import { SyncOutlined } from "@ant-design/icons";
import { IUser } from "@Itypes/User";
import axios, { AxiosResponse } from "axios";

const StripeCallback = () => {
	const {
		state: { user },
		dispatch,
	} =
		useContext<{ state: { user: IUser }; dispatch: Dispatch<any> }>(
			UserContext
		);
	//works
	// const getCookie = (name: string) => {
	// 	if (!document.cookie) {
	// 		return null;
	// 	}

	// 	const xsrfCookies = document.cookie
	// 		.split(";")
	// 		.map((c) => c.trim())
	// 		.filter((c) => c.startsWith(name + "="));

	// 	if (xsrfCookies.length === 0) {
	// 		return null;
	// 	}
	// 	return decodeURIComponent(xsrfCookies[0].split("=")[1]);
	// };

	// const fetchUserDetails = useCallback(async () => {
	// 	const csrfToken = getCookie("_csrf");
	// 	const headers = new Headers({
	// 		"Content-Type": "x-www-form-urlencoded",
	// 		"X-CSRF-TOKEN": csrfToken,
	// 	});
	// 	if (user) {
	// 		let response = await (
	// 			await fetch("/api/get-account-status", {
	// 				method: "POST",
	// 				headers,
	// 				mode: "cors",
	// 				cache: "default",
	// 			})
	// 		).json();
	// 		// if userId changes, useEffect will run again
	// 		// if you want to run only once, just leave array empty []
	// 		console.log(response);
	// 		//window.location.href = "/instructor";
	// 	}
	// }, [user]);

	useEffect(() => {
		if (user) {
			axios.post("/api/getAccountStatus").then((res: AxiosResponse) => {
				//console.log(res);
				dispatch({
					type: "LOGIN",
					payload: res.data,
				});
				window.localStorage.setItem("x-next-user", JSON.stringify(res.data));
				window.location.href = "/instructor";
			});
		}
	}, [user]);
	return (
		<SyncOutlined
			spin
			className="d-flex justify-content-center display-1 text-danger p-5"
		/>
	);
};

export default StripeCallback;

//X-CSRF-Token has not been inclueds in the headers
