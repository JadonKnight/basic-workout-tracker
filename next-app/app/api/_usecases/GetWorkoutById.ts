import { WorkoutRepository } from "../_repositories/Workout";

export class GetUserWorkoutByIdUseCase<T> {
  constructor(private _workoutRepository: WorkoutRepository<T>) {}

  async execute(workoutId: number, userId: number) {
    const workout = this._workoutRepository.findActiveUserWorkoutById(
      workoutId,
      userId
    );

    return workout;
  }
}
