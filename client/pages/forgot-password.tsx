import { useState, useContext, useEffect, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../contexts";
import { useRouter } from "next/router";
import validator from "validator";
import { useDebouncedCallback } from "use-debounce";

const ForgotPassword = () => {
	//state
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [retypedNewPassword, setRetypedNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	// force user back to other page if logged in
	const {
		state: { user },
	} = useContext(UserContext);
	const router = useRouter();
	//redirect user if logged in
	useEffect(() => {
		if (user !== null) router.push("/");
	}, [user]);

	//debounces input
	const checkPassword = () => {
		console.log(newPassword);
		if (!validator.isStrongPassword(newPassword)) toast("Need stronger password");
	};

	const comparePasswords = () => {
		if (!newPassword || !retypedNewPassword) return;
		if (newPassword !== retypedNewPassword) toast("New passwords don't match");
	};

	const debouncedCheck = useDebouncedCallback(
		checkPassword,
		500,
		// The maximum time func is allowed to be delayed before it's invoked:
		{ maxWait: 2000 }
	);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post("/api/forgetPassword", { email });
			setSuccess(true);
			toast("Check your email for the secret code");
			setLoading(false);
		} catch (err) {
			setLoading(false);
			toast(err.response.data);
		}
	};

	const handleResetPassword = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post("/api/resetPassword", { email, code, newPassword });
			setEmail("");
			setCode("");
			setNewPassword("");
			setRetypedNewPassword("");
			toast("You can now login to your new password");
			setLoading(false);
			setTimeout(() => {
				toast("You will be redirected to the log in");
			}, 8000);
			setTimeout(() => {
				router.push("/login");
			}, 10000);
		} catch (err) {
			setLoading(false);
			toast(err.response.data);
		}
	};
	return (
		<>
			<h1 className="jumbotron text-center bg-primary square">Forgot Password</h1>
			<div className="container col-md-4 offset-md-4 pb-5">
				<form onSubmit={success ? handleResetPassword : handleSubmit}>
					{success ? (
						<>
							<p className="display-5 text-center mb-4">{email}</p>
							<input
								type="text"
								className="form-control mb-4 p-4"
								value={code}
								onChange={(e) => setCode(e.currentTarget.value)}
								placeholder="Enter Code"
								autoComplete="off"
								required
							/>
							<input
								type="password"
								className="form-control mb-4 p-4"
								value={newPassword}
								onChange={(e) => setNewPassword(e.currentTarget.value)}
								onBlur={debouncedCheck}
								placeholder="Enter New Password"
								autoComplete="off"
								required
							/>
							<input
								type="password"
								className="form-control mb-4 p-4"
								value={retypedNewPassword}
								onChange={(e) => setRetypedNewPassword(e.currentTarget.value)}
								placeholder="Enter New Password again"
								onBlur={comparePasswords}
								autoComplete="off"
								required
							/>
							<button
								className="btn btn-primary btn-block p-2"
								disabled={loading || !(newPassword === retypedNewPassword)}
							>
								{loading ? <SyncOutlined spin /> : "Update Password"}
							</button>
						</>
					) : (
						<>
							<input
								type="email"
								className="form-control mb-4 p-4"
								value={email}
								onChange={(e) => setEmail(e.currentTarget.value)}
								placeholder="Enter Email"
								autoComplete="off"
								required
							/>
							<br />
							<button
								className="btn btn-primary btn-block p-2"
								disabled={loading || !validator.isEmail(email)}
							>
								{loading ? <SyncOutlined spin /> : "Submit"}
							</button>
						</>
					)}
				</form>
			</div>
		</>
	);
};

export default ForgotPassword;
//Request reset -> verify email -> generate temp pass(encoded in lin) -> email user
//User click link -> link contains temp pass/ pass reset code -> set new pass
