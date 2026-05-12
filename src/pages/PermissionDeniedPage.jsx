export default function PermissionDeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Permission Denied</h1>
      <p className="text-lg text-gray-600 mb-6">You do not have access to this page.</p>
      <a href="/" className="text-blue-600 hover:underline">Go Home</a>
    </div>
  );
}