import { useAppSelector } from "../../store/hooks";

export default function Loader() {
  const { isLoading, message } = useAppSelector((s) => s.loader);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white px-6 py-4 rounded shadow-md flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
