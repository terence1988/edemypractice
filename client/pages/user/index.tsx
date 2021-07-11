import { useContext } from "react";
import { UserContext } from "../../contexts";
import UserRoute from "../../components/routes/UserRoute";

//// file under the folder can make index.tsx directly available to the client
const UserIndex = () => {
	const {
		state: { user },
	} = useContext(UserContext);

	return (
		<UserRoute>
			<h1 className="jumbotron text-center square">
				<pre>{JSON.stringify(user, null, 4)}</pre>
			</h1>
		</UserRoute>
	);
};

export default UserIndex;

//moved to be used as wapper conponemt
