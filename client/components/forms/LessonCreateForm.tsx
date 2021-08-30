import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Progress, Tooltip } from "antd";
import { MouseEventHandler } from "react";
import { FormEvent, ChangeEventHandler, FormEventHandler } from "react";
import { ILesson } from "../../types/Lesson";

// Don’t call Hooks inside loops, conditions, or nested functions.
//As this is a conditional rendered modal, so yes, the hooks should not be here
interface LessonCreateFormProps {
	lessonData: ILesson;
	loading: boolean;
	setLessonData: Function;
	handleAddLesson: FormEventHandler<any>;
	videoUploadText: string;
	handleVideo: ChangeEventHandler<HTMLInputElement>;
	progress: number;
	handleVideoRemove: MouseEventHandler<HTMLSpanElement>;
}
const LessonCreateForm = ({
	lessonData,
	loading,
	setLessonData,
	handleAddLesson,
	videoUploadText,
	handleVideo,
	progress,
	handleVideoRemove,
}: LessonCreateFormProps) => {
	return (
		<div className="container pt-3">
			<form onSubmit={handleAddLesson}>
				<input
					type="text"
					className="form-control square"
					onChange={(e: FormEvent<HTMLInputElement>) =>
						setLessonData({ ...lessonData, title: e.currentTarget.value })
					}
					value={lessonData.title}
					placeholder="Title"
					autoFocus
					/*auto keyboard focus, good for modals */
					required
				/>
				<textarea
					className="form-control mt-3"
					cols={7}
					rows={7}
					onChange={(e) => {
						setLessonData({ ...lessonData, content: e.currentTarget.value });
					}}
				/>

				<div className="d-flex justify-content-center">
					<label className="btn btn-dark btn-block text-left mt-3">
						{videoUploadText}
						<input type="file" accept="video/*" hidden onChange={handleVideo} />
					</label>
					{!loading && lessonData.video.Location && (
						<Tooltip title="remove" className="pt-1 pl-3">
							<span onClick={handleVideoRemove}>
								<CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
							</span>
						</Tooltip>
					)}
				</div>
				{/* Progress is a Web API provided Object(browser API) so it does not show upload to s3 */}
				{progress > 0 ? (
					<Progress className="d-flex justify-content-center pt-2" percent={progress} steps={10} />
				) : null}
				<Button
					type="primary"
					shape="round"
					className="col mt-3"
					size="large"
					onClick={handleAddLesson}
					loading={loading}
				>
					Save
				</Button>
			</form>
		</div>
	);
};

export default LessonCreateForm;
