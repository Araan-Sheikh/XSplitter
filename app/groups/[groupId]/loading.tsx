export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-center text-gray-500">Loading group...</p>
      </div>
    </div>
  );
} 