import { Modal } from "antd";
import ReactPlayer from "react-player";

const PreviewModal = ({ preview, showModal, setShowModal }) => {
	return (
		<>
			<Modal
				className="wrapper"
				title="Course Preview"
				visible={showModal}
				onCancel={() => {
					setShowModal(!showModal);
				}}
				width={720}
				footer={null}
			>
				<ReactPlayer
					url={preview}
					playing={showModal}
					controls
					width="100%"
					height="100%"
				/>
			</Modal>
		</>
	);
};

export default PreviewModal;
