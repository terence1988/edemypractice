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

//https://medium.com/young-developer/react-markdown-code-and-syntax-highlighting-632d2f9b4ada
//https://thetombomb.com/posts/adding-code-snippets-to-static-markdown-in-Next%20js
interface IEditCourseMetaData extends ICourseMetaData {
	slug: IMongoCourse["slug"];
	instructor: IMongoCourse["instructor"];
	lessons?: IMongoCourse["lessons"];
}

const EditCourse = () => {
	//@ts-ignore
	const [course, setCourse] = useState<IEditCourseMetaData>({
		name: "",
		description: "",
		price: 0,
		uploading: false,
		paid: "",
		loading: false,
		category: "",
		slug: "",
	});

	const [preview, setPreview] = useState("");
	const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
	const [image, setImage] = useState<any>("");
	const [editLesson, setEditLesson] = useState<{
		modalvisible: boolean;
		editLessonId: ILesson;
	}>({
		modalvisible: false,
		editLessonId: { title: "", content: "", video: null, free_preview: false },
	});

	const [progress, setProgress] = useState(0);
	const [loading, isLoading] = useState(false);
	const [videoUploadText, setVideoUploadText] = useState("Upload Video");

	// useEffect(() => {
	// 	console.log(editLesson); // log state after hook
	// }, [editLesson]);

	//router
	const router = useRouter();
	const slug =
		router.query.slug ||
		(process.browser && window.location.pathname.split("/").pop());

	//Effects
	useEffect(() => {
		fetchCourse();
	}, [slug]);

	const fetchCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setCourse(data);
	};

	const handleOnChange: ChangeEventHandler<any> = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setCourse({ ...course, [e.currentTarget.name]: e.currentTarget.value });
	};

	//most generic/base type SyntheticEvent
	const handleImage: ChangeEventHandler<any> = (e: SyntheticEvent) => {
		let file = (e.currentTarget as HTMLInputElement).files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadButtonText(file.name);
		setCourse({ ...course, loading: true });

		//resize image and store url in database
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
			try {
				let { data } = await axios.post("/api/course/upload-image", {
					image: uri,
				});
				console.log("Image Uploadeds", data);
				//Needs set image in state
				setImage(data);
				setCourse({ ...course, loading: false });
				//There was error regards payload is too large -- 500KB, body-parser normally handle text
			} catch (err) {
				console.log(err);
				setCourse({ ...course, loading: false });
				toast("Image upload failed. Try later");
			}
		});
	};

	const removeImage = async () => {
		try {
			setCourse({ ...course, loading: true });
			const res = await axios.post("/api/course/remove-image", { image });
			setImage({});
			setPreview("");
			setUploadButtonText("Upload Image");
			setCourse({ ...course, loading: false });
		} catch (err) {
			console.log(err);
			setCourse({ ...course, loading: false });
			toast("Image upload failed. Try later");
		}
	};

	const handleSubmitEdit: FormEventHandler<any> = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.put(
				`/api/course/${slug}`,
				{
					...course,
					image,
				},
				{ withCredentials: true }
			);
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
		let allLessons = [...course.lessons];
		let movingItem = allLessons[movingItemIndex];
		allLessons.splice(movingItemIndex, 1);
		allLessons.splice(targetItemIndex, 0, movingItem);
		setCourse({ ...course, lessons: [...allLessons] });
		console.log(course.lessons);
		const { data } = await axios.put(`/api/course/${slug}`, {
			...course,
			image,
		});
		//console.log("Course Updated =>", data);
		toast("Course updated successfully");
	};

	const handleUpdateVideo = async (e: ChangeEvent<HTMLInputElement>) => {
		isLoading(true);
		const file = e.currentTarget.files[0];
		try {
			if (
				editLesson.editLessonId.video &&
				editLesson.editLessonId.video.Location
			) {
				const res = await axios.post(
					`/api/course/video-remove/${course.instructor._id}`,
					editLesson.editLessonId.video
				);
				console.log("Removed ===>", res);
			}
		} catch (err) {
			toast("Video upload failed", { autoClose: 3000 });
			setVideoUploadText("Upload failed");
			isLoading(false);
		} finally {
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
			setEditLesson({
				...editLesson,
				editLessonId: { ...editLesson.editLessonId, video: data },
			});
			setVideoUploadText("Upload Success");
			setProgress(0);
			isLoading(false);
		}

		// try {
		// 	try_statements
		//   }
		//   catch (exception_var) {
		// 	catch_statements
		//   }
		//   finally {
		// 	finally_statements
		//   }
	};

	// const handleVideo = async (e: ChangeEvent<HTMLInputElement>) => {
	// 	isLoading(true);
	// 	try {
	// 		const file = e.currentTarget.files[0];
	// 		setVideoUploadText(file.name);
	// 		const videoData = new FormData();
	// 		videoData.append("video", file, file.name);
	// 		const { data } = await axios.post(
	// 			`/api/course/video-upload/${course.instructor._id}`,
	// 			videoData,
	// 			{
	// 				onUploadProgress: (e: ProgressEvent) => {
	// 					setProgress(Math.round((100 * e.loaded) / e.total));
	// 				},
	// 			}
	// 		);
	// 		//once response received
	// 		console.log(data);
	// 		setEditLesson({ ...editLesson, editLessonId: { ...editLesson.editLessonId, video: data } });
	// 		setVideoUploadText("Upload Success");
	// 		setProgress(0);
	// 		isLoading(false);
	// 	} catch (err) {
	// 		toast("Video upload failed", { autoClose: 3000 });
	// 		setVideoUploadText("Upload failed");
	// 		isLoading(false);
	// 	}
	// };

	// const handleVideoRemove = async () => {
	// 	isLoading(true);
	// 	console.log(course);
	// 	try {
	// 		const { data } = await axios.post(
	// 			`/api/course/video-remove/${course.instructor._id}`,
	// 			editLesson.editLessonId.video
	// 		);
	// 		console.log(data);
	// 		setEditLesson({ ...editLesson, editLessonId: { ...editLesson.editLessonId, video: null } });
	// 		setVideoUploadText("Upload another video");
	// 		isLoading(false);
	// 	} catch (err) {
	// 		toast("Video remove failed", { autoClose: 3000 });
	// 		isLoading(false);
	// 	}
	// };

	const handleAddLesson = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`/api/course/lesson/${course.slug}/${course.instructor._id}`,
				editLesson.editLessonId
			);
			setEditLesson({ ...editLesson, editLessonId: data });
			setVideoUploadText("Upload Video");
			setCourse(data);
		} catch (error) {
			console.log(error);
			setVideoUploadText("Upload Video again");
			setEditLesson({
				...editLesson,
				editLessonId: {
					title: "",
					content: "",
					video: null,
					free_preview: false,
				},
			});
			toast(error);
		}
	};

	const handleDeleteLesson = async (e: SyntheticEvent, index: number) => {
		e.stopPropagation();
		const confirmDelete = window.confirm("Do you really need to delete it?");
		if (!confirmDelete) return;

		let allLessons = [...course.lessons];
		const deleteItemIndex = allLessons.splice(index, 1).pop(); // splice does always return [], so needs pop
		setCourse({ ...course, lessons: [...allLessons] });
		try {
			const { data } = await axios.put(
				`/api/course/${slug}/${(deleteItemIndex as IMongoLesson)._id}`,
				course
			);
		} catch (err) {
			console.log(err);
		}
	};
	// There are setxxxAction and Effect types that can be used
	const handleUpdateLesson = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.put(
				`/api/course/lesson/${course.slug}/${course.instructor._id}`,
				editLesson.editLessonId
			);
			setVideoUploadText("Upload Video");
			setEditLesson({
				modalvisible: false,
				editLessonId: {
					title: "",
					content: "",
					video: null,
					free_preview: false,
				},
			});
			toast("Lesson updated");
			fetchCourse();
		} catch (error) {
			console.log(error);
		}
		// UI -> BE , BE update, UI <-- BE
	};

	const editFormProps = {
		handleSubmitEdit,
		handleOnChange,
		handleImage,
		courseMetaData: course,
		setCourseMetaData: setCourse,
		preview,
		uploadButtonText,
		setImage,
		removeImage,
		editPage: true,
	};

	const updateLessonProps = {
		editLesson,
		loading,
		setEditLesson,
		handleAddLesson,
		videoUploadText,
		setVideoUploadText,
		handleUpdateVideo,
		progress,
		handleUpdateLesson,
	};

	//JSX is normally on a different context

	return (
		<InstructorRoute>
			<h1 className="jumbotron text-center square">Edit Course</h1>
			<div className="pt-3 pb-3">
				<CourseCreateForm {...editFormProps} />
			</div>

			<div className="row pb-5">
				<div
					className="col lesson-list"
					onDragOver={(e: any) => e.preventDefault()}
				>
					<h4>{course && course.lessons && course.lessons.length} Lessons</h4>
					<List
						itemLayout="horizontal"
						dataSource={course && course.lessons}
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
										onClick={(e) => {
											handleDeleteLesson(e, index);
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
				footer={null}
				onCancel={() => {
					setEditLesson({ modalvisible: false, editLessonId: null });
				}}
			>
				update lesson form
				<LessonUpdateForm {...updateLessonProps} />
			</Modal>
		</InstructorRoute>
	);
};

export default EditCourse;

// try {
// 	myroutine(); // may throw three types of exceptions
//   } catch (e) {
// 	if (e instanceof TypeError) {
// 	  // statements to handle TypeError exceptions
// 	} else if (e instanceof RangeError) {
// 	  // statements to handle RangeError exceptions
// 	} else if (e instanceof EvalError) {
// 	  // statements to handle EvalError exceptions
// 	} else {
// 	  // statements to handle any unspecified exceptions
// 	  logMyErrors(e); // pass exception object to error handler
// 	}
//   }
// A common use case for this is to only catch (and silence) a small subset of
// expected errors, and then re-throw the error in other cases:

//https://dmitripavlutin.com/controlled-inputs-using-react-hooks/
