const NotFoundPage = () => {
  return (
    <div className="!fixed z-[99999] top-0 left-0 bg-surface-base w-full h-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-4">Page not found</h1>
        <div className="mb-7 text-content-secondary">
          Sorry, but the requested page is not found
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
