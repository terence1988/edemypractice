import { useContext, useState } from "react";
import { UserContext } from "../contexts";
import { Button } from "antd";
import axios, { AxiosResponse } from "axios";
import {
	SettingOutlined,
	UserSwitchOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { IUser } from "@Itypes/User";

const BecomeInstructor = () => {
	const [loading, setLoading] = useState(false);
	const {
		state: { user },
	} = useContext<{ state: { user: IUser } }>(UserContext);

	const becomeInstructor = () => {
		setLoading(true);
		axios
			.post("/api/make-instructor", {})
			.then((res: AxiosResponse) => {
				console.log(res);
				window.location.href = res.data;
				window.history.pushState({ state: res.data }, "");
			})
			.catch((err) => {
				toast("Stripe onboarding failed.");
				setLoading(false);
			});
		// MDN https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
		// const url = new URL(window.location);
		// url.searchParams.set("foo", "bar");
		// window.history.pushState({}, "", url);
	};

	return (
		<>
			<h1 className="jumbotron text-center square">Become Instructor</h1>
			<div className="container">
				<div className="col-md-6 offset-md-3 text-center">
					<div className="pt-4">
						<UserSwitchOutlined className="display-1 pb-3" />
						<br />
						<h2>Setup payout to publish courses on Edemy</h2>
						<p className="lead text-warning">
							Edemy parnters with stripe to transfer earnigs to your bank
						</p>
						<Button
							className="mb-3"
							type="primary"
							block
							shape="round"
							icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
							size="large"
							onClick={becomeInstructor}
							disabled={user?.role?.includes("Instructor") || loading}
						>
							{loading ? "Processing" : "Payout Setup"}
						</Button>
						<p className="lead">
							You will be redirected to stripe to complete onboarding process.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default BecomeInstructor;
