interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-red-800 text-lg font-semibold">Error</h2>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
} 