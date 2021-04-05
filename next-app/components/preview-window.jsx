export default function PreviewWindow({
  title = "Preview Window",
  children,
  ...rest
}) {
  return (
    <div
      className="mb-4 max-h-96 h-96"
      aria-hidden="true"
      aria-describedby={title}
    >
      <div className="absolute left-0 w-screen px-6">
        <div className="flex flex-col w-full mx-auto subpixel-antialiased rounded shadow-2xl max-h-96 h-96">
          <div className="flex items-center h-6 text-center text-black bg-gray-100 border-b border-gray-500 rounded-t">
            <div className="flex items-center w-3 h-3 ml-2 text-center bg-red-500 border-red-900 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 ml-2 bg-yellow-500 border-yellow-900 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 ml-2 bg-green-500 border-green-900 rounded-full shadow-inner"></div>
            <div className="pr-16 mx-auto">
              <p className="text-sm text-center">{title}</p>
            </div>
          </div>
          <div className="h-full overflow-y-auto" {...rest}>
            <div className="h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
