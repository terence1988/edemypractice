import { FormEvent, useState } from "react";
import axios from "axios";

//
import { toast } from "react-toastify";

//
import { SyncOutlined } from "@ant-design/icons";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			//.env.local will give ENV to client side via NEXT ssg/ssr
			const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}`, {
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
					/>
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
						disabled={!name || !password || !email || isLoading}
					>
						{isLoading ? <SyncOutlined /> : "Submit"}
					</button>
				</form>
			</div>
		</>
	);
};

export default Register;
