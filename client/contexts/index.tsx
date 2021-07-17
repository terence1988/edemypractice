import { useReducer, createContext, FC, useEffect } from "react"; /// redux style
import { useRouter } from "next/router";

import axios from "axios";
import { rejects } from "assert/strict";

enum UserActionsType {
	"LOGIN" = "LOGIN",
	"LOGOUT" = "LOGOUT",
}

interface defaultUserContext {
	user: Object;
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

//create context
const UserContext = createContext<any>({ state: initialState });

//reducer

const userRootReducer = (state: defaultUserContext, actions: Actions) => {
	switch (actions.type) {
		case UserActionsType.LOGIN:
			console.log(actions.payload);
			return { ...state, user: actions.payload };
		case UserActionsType.LOGOUT:
			return { ...state, user: undefined };
		default:
			return { ...state };
	}
};

const UserProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(userRootReducer, initialState);
	//const memoizedUser = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	const router = useRouter();
	useEffect(() => {
		dispatch({
			type: UserActionsType.LOGIN,
			payload: JSON.parse(window.localStorage.getItem("x-next-user")),
		});
	}, []);

	axios.interceptors.response.use(
		function (response) {
			//any 2xx code will trigger this function to just clear auth record, act as middleware

			return response;
		},
		function (err: any) {
			//any other error status code //!res.config.__isRetryRequest
			let res = err.response;
			console.log(err);
			if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
				return new Promise((resolve, reject) => {
					axios
						.get("api/logout")
						.then((data) => {
							console.log("401 => logout");
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

	return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };