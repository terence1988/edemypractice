import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
//
import { ToastContainer } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
//context
import { UserProvider } from "../contexts";

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<ToastContainer position={"top-center"} />
			<TopNav SSRuser={undefined} />
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default MyApp;
