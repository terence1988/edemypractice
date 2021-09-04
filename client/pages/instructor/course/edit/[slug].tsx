import {
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	FormEventHandler,
	ChangeEventHandler,
	SyntheticEvent,
} from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import InstructorRoute from "@components/routes/InstructorRoute";
import CourseCreateForm from "@components/forms/CourseCreateForm";
import LessonUpdateForm from "@components/forms/LessonUpdateForm";

import { ICourseMetaData, IMongoCourse } from "@Itypes/Course";

import { ILesson, IMongoLesson } from "@Itypes/Lesson";

interface IEditCourseMetaData extends ICourseMetaData {
	lessons?: IMongoCourse["lessons"];
}

const EditCourse = () => {
	const [courseMetaData, setCourseMetaData] = useState<IEditCourseMetaData>({
		name: "",
		description: "",
		price: 0,
		uploading: false,
		paid: "free",
		loading: false,
		category: "",
		lessons: [],
	});
	const [course, setCourse] = useState<IMongoCourse>();

	const [preview, setPreview] = useState("");
	const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
	const [image, setImage] = useState<any>({});
	const [editLesson, setEditLesson] = useState({
		modalvisible: false,
		editLessonId: {},
	});

	const [lessonData, setLessonData] = useState<ILesson>({
		title: "",
		content: "",
		video: null,
	});
	const [progress, setProgress] = useState(0);
	const [loading, isLoading] = useState(false);
	const [videoUploadText, setVideoUploadText] = useState("Upload Video");

	// useEffect(() => {
	// 	console.log(editLesson); // log state after hook
	// }, [editLesson]);

	//router
	const router = useRouter();
	const slug = router.query.slug || (process.browser && window.location.pathname.split("/").pop());

	//Effects
	useEffect(() => {
		fetchCourse();
	}, [slug]);

	const fetchCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setCourseMetaData(data);
	};

	const handleOnChange: ChangeEventHandler<any> = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCourseMetaData({ ...courseMetaData, [e.currentTarget.name]: e.currentTarget.value });
	};

	//most generic/base type SyntheticEvent
	const handleImage: ChangeEventHandler<any> = (e: SyntheticEvent) => {
		let file = (e.currentTarget as HTMLInputElement).files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadButtonText(file.name);
		setCourseMetaData({ ...courseMetaData, loading: true });

		//resize image and store url in database
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
			try {
				let { data } = await axios.post("/api/course/upload-image", {
					image: uri,
				});
				console.log("Image Uploadeds", data);
				//Needs set image in state
				setImage(data);
				setCourseMetaData({ ...courseMetaData, loading: false });
				//There was error regards payload is too large -- 500KB, body-parser normally handle text
			} catch (err) {
				console.log(err);
				setCourseMetaData({ ...courseMetaData, loading: false });
				toast("Image upload failed. Try later");
			}
		});
	};

	const removeImage = async () => {
		try {
			setCourseMetaData({ ...courseMetaData, loading: true });
			const res = await axios.post("/api/course/remove-image", { image });
			setImage({});
			setPreview("");
			setUploadButtonText("Upload Image");
			setCourseMetaData({ ...courseMetaData, loading: false });
		} catch (err) {
			console.log(err);
			setCourseMetaData({ ...courseMetaData, loading: false });
			toast("Image upload failed. Try later");
		}
	};

	const handleSubmit: FormEventHandler<any> = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.put(
				`/api/course/${slug}`,
				{
					...courseMetaData,
					image,
				},
				{ withCredentials: true }
			);
			console.log(data);
			toast("Course updated");
			setTimeout(() => router.push(`/instructor/course/view/${slug}`), 5000);
		} catch (err) {
			console.log(err);
			toast(err);
		}
	};

	const handleDrag = (e: DragEvent, index: number) => {
		//console.log(index);
		e.dataTransfer.setData("ItemIndex", index.toString());
	};

	const handleDrop = async (e: DragEvent, index: number) => {
		//console.log(index);
		const movingItemIndex = Number(e.dataTransfer.getData("ItemIndex"));
		const targetItemIndex = index;
		let allLessons = [...courseMetaData.lessons];
		let movingItem = allLessons[movingItemIndex];
		allLessons.splice(movingItemIndex, 1);
		allLessons.splice(targetItemIndex, 0, movingItem);
		setCourseMetaData({ ...courseMetaData, lessons: [...allLessons] });
		console.log(courseMetaData.lessons);
		const { data } = await axios.put(`/api/course/${slug}`, {
			...courseMetaData,
			image,
		});
		//console.log("Course Updated =>", data);
		toast("Course updated successfully");
	};

	const handleAddLesson = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`/api/course/lesson/${course.slug}/${course.instructor._id}`,
				lessonData
			);
			setLessonData({ title: "", content: "", video: null });
			toggleOpenModal(false);
			setVideoUploadText("Upload Video");
			setCourse(data);
		} catch (error) {
			console.log(error);
			setVideoUploadText("Upload Video");
			setLessonData({ ...lessonData, title: "", content: "", video: null });
			toast(error);
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
				`/api/course/video-upload/${course.slug}/${course.instructor._id}`,
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
			toast("Video Uploaded");
			setVideoUploadText("Upload Another Video");
			setProgress(0);
			isLoading(false);
		} catch (err) {
			toast("Video upload failed", { autoClose: 3000 });
			setVideoUploadText("Upload Video again");
			setProgress(0);
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

	const handleDeleteLesson = async (index: number) => {
		const confirmDelete = window.confirm("Do you really need to delete it?");
		if (!confirmDelete) return;

		let allLessons = [...courseMetaData.lessons];
		const deleteItemIndex = allLessons.splice(index, 1).pop(); // splice does always return [], so needs pop
		setCourseMetaData({ ...courseMetaData, lessons: [...allLessons] });
		const { data } = await axios.put(
			`/api/course/${slug}/${(deleteItemIndex as IMongoLesson)._id}`,
			courseMetaData
		);
	};

	const handleUpdateLesson = async () => {};

	const editFormProps = {
		handleSubmit,
		handleOnChange,
		handleImage,
		courseMetaData,
		setCourseMetaData,
		preview,
		uploadButtonText,
		setImage,
		removeImage,
		editPage: true,
	};

	const updateLessonProps = {
		lessonData,
		loading,
		setLessonData,
		handleAddLesson,
		videoUploadText,
		handleVideo,
		progress,
		handleUpdateLesson,
		handleVideoRemove,
	};

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Edit Course</h1>
			<div className="pt-3 pb-3">
				<CourseCreateForm {...editFormProps} />
			</div>

			<div className="row pb-5">
				<div className="col lesson-list" onDragOver={(e: any) => e.preventDefault()}>
					<h4>
						{courseMetaData && courseMetaData.lessons && courseMetaData.lessons.length} Lessons
					</h4>
					<List
						itemLayout="horizontal"
						dataSource={courseMetaData && courseMetaData.lessons}
						renderItem={(item: ILesson, index) => {
							return (
								<List.Item
									onClick={() => {
										setEditLesson({
											modalvisible: true,
											editLessonId: item,
										});
									}}
									key={item.title + index}
									draggable={true}
									onDragStart={(e: any) => {
										handleDrag(e, index);
									}}
									onDrop={(e: any) => {
										handleDrop(e, index);
									}}
								>
									<List.Item.Meta
										avatar={<Avatar>{index + 1}</Avatar>}
										title={item.title}
									></List.Item.Meta>
									<DeleteOutlined
										onClick={() => {
											handleDeleteLesson(index);
										}}
										className="text-danger float-right"
									/>
								</List.Item>
							);
						}}
					></List>
				</div>
			</div>

			<Modal
				title="Update the lesson"
				centered
				visible={editLesson.modalvisible}
				onCancel={() => {
					setEditLesson({ modalvisible: false, editLessonId: {} });
				}}
			>
				update lesson form
				<LessonUpdateForm {...updateLessonProps} />
			</Modal>
		</InstructorRoute>
	);
};

export default EditCourse;
