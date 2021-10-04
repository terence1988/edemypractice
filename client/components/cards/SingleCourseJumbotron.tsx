import { Badge } from "antd";
import ReactPlayer from "react-player";
import { IMongoCourse } from "@Itypes/Course";
import { currencyFormatter } from "utils/helpers";
import ReactMarkdown from "react-markdown";

interface SingleCourseJumbotronPros {
	course: IMongoCourse;
	showModal: boolean;
	setShowModal: Function;
	preview: string;
	setPreview: Function;
}

function SingleCourseJumbotron({
	course,
	showModal,
	setShowModal,
	preview,
	setPreview,
}: SingleCourseJumbotronPros) {
	const {
		name,
		description,
		category,
		instructor,
		paid,
		lessons,
		image,
		updatedAt,
		price,
	} = course;
	return (
		<div className="jumbotron bg-primary square container-fluid">
			<div className="row">
				<div className="col-md-8">
					<h1 className="text-light font-weight-bold">{name}</h1>
					<p className="lead">
						{description && description.substring(0, 40)}...
					</p>
					<Badge
						count={category}
						style={{ backgroundColor: "#03a9f4" }}
						className="pb-4 mr-2"
					/>
					<p>Created by {instructor.name}</p>
					<p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
					<h4 className="text-light">
						{paid
							? currencyFormatter({ currency: "usd", amount: price })
							: "Free"}
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
					<p>Show Enrol</p>
				</div>
			</div>
		</div>
	);
}

export default SingleCourseJumbotron;
