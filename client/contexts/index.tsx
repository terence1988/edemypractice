import { useReducer, createContext, FC, useEffect } from "react"; /// redux style
import { useRouter } from "next/router";

import axios from "axios";
import { IUser } from "../types/User";

enum UserActionsType {
	"LOGIN" = "LOGIN",
	"LOGOUT" = "LOGOUT",
}

interface defaultUserContext {
	user: IUser;
}

interface LoginAction {
	type: UserActionsType.LOGIN;
	payload: string;
}

interface LogoutAction {
	type: UserActionsType.LOGOUT;
}

type Actions = LoginAction | LogoutAction;

//Same as redux -- initial state
const initialState: defaultUserContext = {
	user: null,
};

// if auth is found in localstorage, use that as default value
if (process.browser && window.localStorage.getItem("x-next-user")) {
	initialState.user = JSON.parse(window.localStorage.getItem("x-next-user"));
}

//create context
const UserContext = createContext<any>({ state: initialState });

//reducer

const userRootReducer = (state: defaultUserContext, actions: Actions) => {
	switch (actions.type) {
		case UserActionsType.LOGIN:
			return { ...state, user: actions.payload };
		case UserActionsType.LOGOUT:
			return { ...state, user: null };
		default:
			return { ...state };
	}
};

const UserProvider = ({ children }) => {
	const [state, dispatch] = useReducer(userRootReducer, initialState);
	//const memoizedUser = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	const router = useRouter();
	//check if logged in
	useEffect(() => {
		//when browser is closed, the window.localStorage get cleared!!!
		const currentUser = window.localStorage.getItem("x-next-user");
		dispatch({
			type: UserActionsType.LOGIN,
			payload: JSON.parse(currentUser),
		});
	}, []);

	axios.interceptors.response.use(
		function (response) {
			//any 2xx code will trigger this function to just clear auth record, act as middleware

			return response;
		},
		function (err) {
			//any other error status code //!res.config.__isRetryRequest
			let res = err.response;
			if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
				return new Promise((resolve, reject) => {
					axios
						.get("/api/logout")
						.then((data) => {
							console.log("401 => logout", data);
							dispatch({ type: UserActionsType.LOGOUT });
							window.localStorage.removeItem("x-next-user");
							router.push("/login");
						})
						.catch((err) => {
							console.log("Axios Interceptors err", err);
							reject(err);
						});
				});
			}
			return Promise.reject(err);
		}
	);
	//auth csrf token
	useEffect(() => {
		const getCsrfToken = async () => {
			const { data } = await axios.get("/api/csrfToken");
			//console.log("CSRF: ==>", data);
			axios.defaults.headers.common["X-CSRF-Token"] = data.csrfToken;
			//axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
		};
		//https://github.com/axios/axios/issues/1346
		getCsrfToken();
	}, []);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
