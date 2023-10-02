import { UserRepository } from "../_repositories/User";

export class VerifyUserUseCase<T> {
  constructor(private _userRepository: UserRepository<T>) {}

  // Use methods from userRepository to interact with the database
  async execute(id: number) {
    const user = await this._userRepository.findUserById(id);
    // At the moment this just checks if the user exists, this should now solve
    // any issues where a user no longer exists and still attempts to access data.
    return user !== null;
  }
}
