export default function Loading() {
  return (
    <div className="w-full h-full p-4 space-y-4 flex items-center justify-center">
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
