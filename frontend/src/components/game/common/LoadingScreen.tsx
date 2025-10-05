export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center">
      <div className="text-center text-green-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="text-lg">Carregando...</p>
      </div>
    </div>
  );
};
