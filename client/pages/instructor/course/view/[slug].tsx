import { useState, useEffect, ChangeEvent, FormEvent, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { Button, List, Tooltip, Avatar, Modal, Typography, Switch, Select } from "antd";
import { CheckOutlined, EditOutlined, QuestionOutlined, UploadOutlined } from "@ant-design/icons";
import LessonCreateForm from "@components/forms/LessonCreateForm";
import InstructorRoute from "@components/routes/InstructorRoute";
import CodeBlock from "@components/CodeBlock";
import { IMongoCourse } from "@Itypes/Course";
import { ILesson } from "@Itypes/Lesson";

const CourseView = () => {
	const [course, setCourse] = useState<IMongoCourse>();
	const [openModal, toggleOpenModal] = useState(false);
	const [lessonData, setLessonData] = useState<ILesson>({
		title: "",
		content: "",
		video: null,
		free_preview: false,
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

	const tooglePublish = async (e: SyntheticEvent, courseId: string) => {
		try {
			let answer = window.confirm(
				`Are you sure to ${course.published ? "un" : null}publish this course?`
			);
			if (!answer) return;

			const { data } = await axios.put(`/api/course/publish/${courseId}`);
			setCourse(data);
			toast("Congrats!");
		} catch (err) {
			toast("Try again later.");
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
								<div className="col-8">
									<h5 className="mt-2 text-primary">{course.name}</h5>
									<p style={{ marginTop: "-1em" }}>
										{course.lessons && course.lessons.length} Lessons
									</p>
									<p style={{ marginTop: "-1rem", fontSize: "0.8rem" }}>{course.category}</p>
								</div>
								<div className="d-flex col-4">
									<div className="mr-4">
										<Select defaultValue={`${course.published}`}>
											<Select.Option value="true">Published</Select.Option>
											<Select.Option value="false">Not Published</Select.Option>
										</Select>
									</div>
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
									{course.lessons && course.lessons.length < 5 ? (
										<Tooltip
											title="Minimal 5 lessons are required to publish"
											children={<QuestionOutlined className="h5 pointer text-danger mr-4" />}
										/>
									) : (
										<Tooltip
											title="Published"
											children={<CheckOutlined className="h5 pointer text-warning mr-4" />}
										/>
									)}
								</div>
							</div>
							<hr />
							<div className="row justify-content-center">
								<div>
									<ReactMarkdown components={CodeBlock}>{course.description}</ReactMarkdown>
									{/* description can now in MD format with basic html stylings*/}
								</div>
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
												<List.Item>
													<List.Item.Meta
														avatar={<Avatar>{index + 1}</Avatar>}
														title={item.title}
													></List.Item.Meta>
												</List.Item>
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
