import { Badge } from "antd";
import { Button } from "@mui/material";
import ReactPlayer from "react-player";
import { IMongoCourse } from "@Itypes/Course";
import { currencyFormatter } from "utils/helpers";
import ReactMarkdown from "react-markdown";
import { IUser } from "@Itypes/User";
import { SetStateAction, MouseEventHandler } from "react";
import { LoadingOutlined, SafetyCertificateFilled, SafetyOutlined } from "@ant-design/icons";

interface SingleCourseJumbotronPros {
	course: IMongoCourse;
	showModal: boolean;
	setShowModal: Function;
	preview: string;
	setPreview: Function;
	user: IUser;
	loading: boolean;
	setLoading: React.Dispatch<SetStateAction<boolean>>;
	handlePaidEnrollment: MouseEventHandler;
	handleFreeEnrollment: MouseEventHandler;
	enrolled: { status: boolean; course: any[] };
}

function SingleCourseJumbotron({
	course,
	showModal,
	setShowModal,
	preview,
	setPreview,
	loading,
	user,
	setLoading,
	handleFreeEnrollment,
	handlePaidEnrollment,
	enrolled
}: SingleCourseJumbotronPros) {
	const { name, description, category, instructor, paid, lessons, image, updatedAt, price } =
		course;
	return (
		<div className="jumbotron bg-primary square container-fluid">
			<div className="row">
				<div className="col-md-8">
					<h1 className="text-light font-weight-bold">{name}</h1>
					<p className="lead">{description && description.substring(0, 40)}...</p>
					<Badge count={category} style={{ backgroundColor: "#03a9f4" }} className="pb-4 mr-2" />
					<p>Created by {instructor.name}</p>
					<p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
					<h4 className="text-light">
						{paid ? currencyFormatter({ currency: "usd", amount: price }) : "Free"}
					</h4>
				</div>
				<div className="col-md-4">
					{lessons[0].video && lessons[0].video.Location ? (
						<div
							onClick={() => {
								setPreview(lessons[0].video.Location);
								setShowModal(true);
							}}
						>
							<ReactPlayer
								className="react-player-div"
								url={lessons[0].video.Location}
								light={image.Location}
								width="100%"
								height="225px"
							/>
						</div>
					) : (
						<>
							<img src={image.Location} alt={name} className="img img-fluid" />
						</>
					)}
					{/* Enrol button */}
					{loading ? (
						<div className="d-flex justify-content-center">
							<LoadingOutlined className="h1 text-danger" />
						</div>
					) : (
						<Button
							fullWidth
							className="mb-3"
							variant="contained"
							endIcon={<SafetyCertificateFilled />}
							size="large"
							disabled={loading}
							onClick={paid ? handleFreeEnrollment : handleFreeEnrollment}
						>
							{user ? (enrolled.status ? "Go to course" : "Enrol") : "Login to enroll"}
						</Button>
					)}
					{/* Nested tenery true ? true ? res1:res2:res3(all false) */}
				</div>
			</div>
		</div>
	);
}

export default SingleCourseJumbotron;
