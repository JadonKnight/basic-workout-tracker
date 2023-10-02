import User from "./User";
import Exercise from "./Exercise";

class Workout {
  private id: number;
  private name: string;
  private user: User;
  private exercises: Exercise[];

  constructor(id: number, name: string, user: User, exercises: Exercise[]) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.exercises = exercises;
  }
}

export default Workout;
