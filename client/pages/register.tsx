import { FormEvent, useState, useEffect, useContext } from "react";
import axios from "axios";
// toast for error messages
import { toast } from "react-toastify";
//loading spinner
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import router from "next/router";
import PasswordStrengthBar from "react-password-strength-bar";
//user context
import { UserContext } from "../contexts";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { state, dispatch } = useContext(UserContext);

	useEffect(() => {
		state.user !== null ? router.push("/") : null;
	}, [state.user]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			//.env.local will give ENV to client side via NEXT ssg/ssr
			const { data } = await axios.post(`/api/register`, {
				name,
				email,
				password,
			});
			toast.success("Registeration successful. Please login");
			setIsLoading(false);
		} catch (err) {
			toast.error(err.response.data);
			setIsLoading(false);
		}
	};

	return (
		<>
			<h1 className="jumbotron text-center bg-primary square">Register</h1>

			<div className="container col-md-4 offset-md-4 pb-5">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						className="form-control mb-4 p-4"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter name"
						required
						autoComplete="off"
					/>
					<input
						type="email"
						className="form-control mb-4 p-4"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter email"
						required
						autoComplete="off"
					/>
					<PasswordStrengthBar {...password} />
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
						disabled={!name || !password || !email || isLoading}
					>
						{isLoading ? <SyncOutlined /> : "Submit"}
					</button>
				</form>
				<p className="text-center p-3">
					Already registered? <Link href="/login">login</Link>
				</p>
			</div>
		</>
	);
};

export default Register;
