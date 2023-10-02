import { NextResponse } from "next/server";
import getUserSession from "@/lib/user-session";
import hashid from "@/lib/hashid";

// TODO: Fix this up so we can have imports like above...
import { PrismaWorkoutRepository } from "../../_repositories/Workout";
import { PrismaUserRepository } from "../../_repositories/User";
import { GetUserWorkoutByIdUseCase } from "../../_usecases/GetWorkoutById";
import { VerifyUserUseCase } from "../../_usecases/VerifyUser";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userSession = await getUserSession();
  const { id: workoutId } = params;

  // TODO: Figure a way to further extract these responses
  if (userSession == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userSession.id;

  const workoutIdNumber = Number(hashid.decode((workoutId)));
  const userIdNumber = Number(userId);

  // Setup repositories (data access layer)
  const userRepository = new PrismaUserRepository();
  const workoutRepository = new PrismaWorkoutRepository();

  // Setup use cases
  const veryifyUserUseCase = new VerifyUserUseCase(userRepository);
  const getWorkoutByIdUseCase = new GetUserWorkoutByIdUseCase(
    workoutRepository
  );

  // Depending on the use case result return information as required
  try {
    const isUserValid = await veryifyUserUseCase.execute(userIdNumber);
    if (!isUserValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workout = await getWorkoutByIdUseCase.execute(
      workoutIdNumber,
      userIdNumber
    );
    if (workout) {
      return NextResponse.json(workout);
    } else {
      return NextResponse.json({ error: "Workout not found", status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal Error", status: 500 });
  }
}
