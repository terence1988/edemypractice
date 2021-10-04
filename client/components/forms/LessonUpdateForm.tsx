import { Button, Progress, Tooltip, Switch } from "antd";
import { MouseEventHandler, useEffect, Dispatch, SetStateAction } from "react";
import { FormEvent, ChangeEventHandler, FormEventHandler } from "react";
import toast from "react-toastify";
import { ILesson } from "../../types/Lesson";
import ReactPlayer from "react-player";
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

// Don’t call Hooks inside loops, conditions, or nested functions.
//As this is a conditional rendered modal, so yes ??, the hooks should not be here
interface LessonCreateFormProps {
	editLesson: { modalvisible: boolean; editLessonId: ILesson };
	loading: boolean;
	setEditLesson: Dispatch<SetStateAction<{}>>;
	handleUpdateLesson: FormEventHandler<any>;
	videoUploadText: string;
	setVideoUploadText: Function;
	handleUpdateVideo: ChangeEventHandler<HTMLInputElement>;
	progress: number;
}

const LessonUpdateForm = ({
	editLesson,
	loading,
	setEditLesson,
	handleUpdateLesson,
	videoUploadText,
	setVideoUploadText,
	handleUpdateVideo,
	progress,
}: LessonCreateFormProps) => {
	useEffect(() => {
		if (editLesson.editLessonId.video)
			setVideoUploadText(`Change ${editLesson.editLessonId.title}'s video`);
	}, []);
	return (
		<div className="container pt-3">
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<input
					type="text"
					className="form-control square"
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setEditLesson({
							...editLesson,
							editLessonId: {
								...editLesson.editLessonId,
								title: e.currentTarget.value,
							},
						})
					}
					value={editLesson.editLessonId.title}
					placeholder="Title"
					autoFocus
					/*auto keyboard focus, good for modals */
					required
				/>
				<textarea
					className="form-control mt-3"
					cols={7}
					rows={7}
					value={editLesson.editLessonId.content}
					onChange={(e) => {
						setEditLesson({
							...editLesson,
							editLessonId: {
								...editLesson.editLessonId,
								content: e.currentTarget.value,
							},
						});
					}}
				/>

				<div className="d-flex justify-content-center">
					<label className="btn btn-dark btn-block text-left mt-3">
						{videoUploadText}
						<input
							type="file"
							accept="video/*"
							hidden
							onChange={handleUpdateVideo}
						/>
					</label>
				</div>

				{!loading && editLesson.editLessonId && editLesson.editLessonId.video && (
					<div className="pt-2 d-flex justify-content-center">
						<ReactPlayer
							url={`${editLesson.editLessonId.video.Location}`}
							width={`${640}px`}
							height={`${360}px`}
							controls
						/>
					</div>
				)}
				{/* Progress is a Web API provided Object(browser API) so it does not show upload to s3 */}
				{progress > 0 ? (
					<Progress
						className="d-flex justify-content-center pt-2"
						percent={progress}
						steps={10}
					/>
				) : null}

				<div className="d-flex justify-content-between">
					<span className="pt-3 badge">
						Free Preview? {editLesson.editLessonId.free_preview ? "Yes" : "No"}
					</span>
					<Switch
						className="float-right mt-2"
						disabled={loading}
						defaultChecked={editLesson.editLessonId.free_preview}
						title="Free Preview"
						onChange={(v) =>
							setEditLesson({
								...editLesson,
								editLessonId: { ...editLesson.editLessonId, free_preview: v },
							})
						}
					/>
				</div>

				<Button
					type="primary"
					shape="round"
					className="col mt-3"
					size="large"
					onClick={handleUpdateLesson}
					disabled={
						!Boolean(editLesson.editLessonId.title) ||
						!Boolean(editLesson.editLessonId.content)
					}
					loading={loading}
				>
					Save
				</Button>
			</form>
		</div>
	);
};

export default LessonUpdateForm;
