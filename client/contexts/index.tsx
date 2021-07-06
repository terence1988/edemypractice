import { useReducer, createContext, FC, useEffect } from "react"; /// reddux style

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
	user: {},
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
	useEffect(() => {
		dispatch({ type: "LOGIN", payload: JSON.parse(window.localStorage.getItem("x-next-user")) });
		return () => {};
	}, [state]);
	return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
