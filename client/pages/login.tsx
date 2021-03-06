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
			const { data } = await axios.post("/api/login", {
				email,
				password,
			});
			console.log(data);
			dispatch({ type: "LOGIN", payload: data });
			window.localStorage.setItem(`x-next-user`, JSON.stringify(data));
			//redirect
			toast.success("Login successfully");
			setIsLoading(false);
			setTimeout(() => toast.success("You will be redirected to the dashboard, please wait"), 5000);
			setTimeout(() => router.push("/user"), 10000);
		} catch (err) {
			toast.error(err.response.result);
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
						autoComplete="off"
					/>
					<input
						type="password"
						className="form-control mb-4 p-4"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						required
						minLength={8}
						autoComplete="off"
					/>

					<button
						type="submit"
						className="btn btn-block btn-primary"
						disabled={!password || !email || isLoading}
					>
						{isLoading ? <SyncOutlined /> : "Submit"}
					</button>
				</form>
				<p className="text-center pt-2">
					Not yet registered? <Link href="/register">Register</Link>
				</p>
				<p className="text-center">
					<Link href="/forgot-password">Reset Password</Link>
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


// In JavaScript, super refers to the parent class constructor. (In our example, it points to the React.Component implementation.)