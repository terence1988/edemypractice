import { FormEvent, useContext, useState } from "react";
import axios from "axios";
// toast for error messages
import { toast } from "react-toastify";
//loading spinner
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
//context
import { UserContext } from "../contexts";

//redirection
import { useRouter } from "next/router";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	//state
	const { state, dispatch } = useContext(UserContext); //dispatch is not typed on context, //TODO

	//router
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			//.env.local will give ENV to client side via NEXT ssg/ssr
			const { data } = await axios.post(`/api/login`, {
				email,
				password,
			});
			console.log("User response", data);
			dispatch({ type: "LOGIN", payload: data });
			window.localStorage.setItem(`x-next-user`, JSON.stringify(data));
			//redirect
			router.push("/");
			toast.success("Login successfully");
			setIsLoading(false);
		} catch (err) {
			toast.error(err.response.data);
			setIsLoading(false);
		}
	};

	return (
		<>
			<h1 className="jumbotron text-center bg-primary square">Login</h1>
			<div className="container col-md-4 offset-md-4 pb-5">
				<form onSubmit={handleSubmit}>
					<input
						type="email"
						className="form-control mb-4 p-4"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter email"
						required
					/>
					<input
						type="password"
						className="form-control mb-4 p-4"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						required
						minLength={8}
					/>

					<button
						type="submit"
						className="btn btn-block btn-primary"
						disabled={!password || !email || isLoading}
					>
						{isLoading ? <SyncOutlined /> : "Submit"}
					</button>
				</form>
				<p className="text-center p-3">
					Not yet registered? <Link href="/register">Register</Link>
				</p>
			</div>
		</>
	);
};

export default Login;

// {
// 	"email":"fayer@gmail.com",
// 	"password":"13231323Zxcv."
// }
