const Error500Page = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          500 - Internal Server Error!
        </h1>
        <p className="text-gray-600">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        <div className="py-1 mt-4 border-t">
          <small>
            If this issue persists, or you would like to report this error,
            please{"\u00A0"}
            <a
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
            >
              contact us.
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Error500Page;
