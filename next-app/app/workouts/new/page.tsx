import CreateWorkout from "./create-workout";
export default async function Page() {

	return (
		<div className={"flex flex-col flex-grow-1 items-center"}>
			<div className="flex flex-col w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 p-3">
				<h2 className="text-2xl p-3 pl-0 text-white font-bold w-full">
					Create New Workout
				</h2>
				<CreateWorkout />
			</div>
		</div>
	);
}
