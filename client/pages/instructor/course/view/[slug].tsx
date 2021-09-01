import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import Avatar from "antd/lib/avatar/avatar";
import { IMongoCourse } from "../../../../types/Course";
import { Button, List, Tooltip } from "antd";
import { CheckOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import LessonCreateForm from "../../../../components/forms/LessonCreateForm";
import { ILesson } from "../../../../types/Lesson";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const CourseView = () => {
	const [course, setCourse] = useState<IMongoCourse>();
	const [openModal, toggleOpenModal] = useState(false);
	const [lessonData, setLessonData] = useState<ILesson>({
		title: "",
		content: "",
		video: null,
	});
	const [progress, setProgress] = useState(0);
	const [loading, isLoading] = useState(false);
	const [videoUploadText, setVideoUploadText] = useState("Upload Video");
	const router = useRouter();
	const { slug } = router.query;
	useEffect(() => {
		fetchCourse();
		console.log(slug);
	}, [slug]);

	const fetchCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setCourse(data);
	};
	const handleAddLesson = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`/api/course/lesson/${slug}/${course.instructor._id}`,
				lessonData
			);
			setLessonData({ ...lessonData, title: "", content: "", video: null });
			setCourse(data);
			setVideoUploadText("Upload Video");
			toggleOpenModal(false);
			toast("Lesson Added");
			setProgress(0);
		} catch (err) {
			console.log(err);
			setProgress(0);
		}
	};
	const handleVideo = async (e: ChangeEvent<HTMLInputElement>) => {
		isLoading(true);
		try {
			const file = e.currentTarget.files[0];
			setVideoUploadText(file.name);
			const videoData = new FormData();
			videoData.append("video", file, file.name);
			const { data } = await axios.post(
				`/api/course/video-upload/${course.instructor._id}`,
				videoData,
				{
					onUploadProgress: (e: ProgressEvent) => {
						setProgress(Math.round((100 * e.loaded) / e.total));
					},
				}
			);
			//once response received
			console.log(data);
			setLessonData({ ...lessonData, video: data });
			setVideoUploadText("Upload Success");
			setProgress(0);
			isLoading(false);
		} catch (err) {
			toast("Video upload failed", { autoClose: 3000 });
			setVideoUploadText("Upload failed");
			isLoading(false);
		}
	};

	const handleVideoRemove = async () => {
		isLoading(true);
		try {
			const { data } = await axios.post(
				`/api/course/video-remove/${course.instructor._id}`,
				lessonData.video
			);
			console.log(data);
			setLessonData({ ...lessonData, video: null });
			setVideoUploadText("Upload another video");
			isLoading(false);
		} catch (err) {
			toast("Video remove failed", { autoClose: 3000 });
			isLoading(false);
		}
	};

	const LessonCreateFormProps = {
		lessonData,
		setLessonData,
		handleAddLesson,
		videoUploadText,
		setVideoUploadText,
		loading,
		handleVideo,
		handleVideoRemove,
		progress,
	};

	return (
		<InstructorRoute>
			<div className="container-fluid pt-3">
				{course && (
					<div className="container-fluid pt-1">
						<Avatar size={80} src={course.image ? course.image.Location : "/course.png"} />
						<div className="media-body pl-2">
							<div className="row">
								<div className="col-10">
									<h5 className="mt-2 text-primary">{course.name}</h5>
									<p style={{ marginTop: "-1em" }}>
										{course.lessons && course.lessons.length} Lessons
									</p>
									<p style={{ marginTop: "-1rem", fontSize: "0.8rem" }}>{course.category}</p>
								</div>
								<div className="d-flex col-2">
									<Tooltip
										title="Edit"
										children={
											<EditOutlined
												className="h5 pointer text-warning mr-4"
												onClick={() => {
													router.push(`/instructor/course/edit/${slug}`);
												}}
											/>
										}
									/>
									<Tooltip
										title="Publish"
										children={<CheckOutlined className="h5 pointer text-warning mr-4" />}
									/>
								</div>
							</div>
							<hr />
							<div className="row">
								<ReactMarkdown className="col" children={course.description} />
								{/* description can now in MD format with basic html stylings*/}
							</div>
							<br />
							<div className="row">
								<Button
									onClick={() => {
										toggleOpenModal(true);
									}}
									className="col-md-6 offset-md-3 text-center"
									type="primary"
									shape="round"
									icon={<UploadOutlined />}
									size="large"
								>
									Add lesson
								</Button>
								{/* This is to open modal to add lessons */}
							</div>
							<Modal
								title="+ Add Lesson"
								visible={openModal}
								onCancel={() => {
									toggleOpenModal(false);
								}}
								footer={null}
								keyboard={true}
								maskClosable={true}
							>
								<LessonCreateForm {...LessonCreateFormProps} />
							</Modal>

							<div className="row pb-5">
								<div className="col lesson-list">
									<h4>{course && course.lessons && course.lessons.length} Lessons</h4>
									<List
										itemLayout="horizontal"
										dataSource={course && course.lessons}
										renderItem={(item, index) => {
											return (
												<Item>
													<Item.Meta
														avatar={<Avatar>{index + 1}</Avatar>}
														title={item.title}
													></Item.Meta>
												</Item>
											);
										}}
									></List>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</InstructorRoute>
	);
};

export default CourseView;
