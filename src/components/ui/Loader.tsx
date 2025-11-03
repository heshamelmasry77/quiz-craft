import { useAppSelector } from "../../store/hooks";

export default function Loader() {
  const { isLoading, message } = useAppSelector((s) => s.loader);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 px-6 py-5 rounded-lg shadow-lg flex flex-col items-center gap-3 animate-fade-in">
        <div className="relative">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        {message && (
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
