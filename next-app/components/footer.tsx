export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4 text-center">
      <p className="text-sm text-white">
        This app is currently in alpha stage. &copy; Jadon Knight 2022-
        {new Date().getFullYear()}
      </p>
      <div className="mt-2">
        <a
          href="mailto:jadon.knight@outlook.com"
          className="text-blue-500 underline"
        >
          Report Bugs and Issues
        </a>
        <span className="mx-2 text-gray-500">|</span>
        <a
          href="https://github.com/JadonKnight/basic-workout-tracker/issues"
          className="text-blue-500 underline"
        >
          GitHub Issues
        </a>
      </div>
    </footer>
  );
}
