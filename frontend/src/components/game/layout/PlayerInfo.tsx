interface PlayerInfoProps {
  nickname: string;
  onLogout: () => void;
}

export const PlayerInfo = ({ nickname, onLogout }: PlayerInfoProps) => {
  return (
    <div className="p-4 border-t border-gray-700">
      <p className="text-xs text-gray-400 mb-1">{nickname}</p>
      <button
        onClick={onLogout}
        className="text-xs text-red-400 hover:text-red-300"
      >
        Sair
      </button>
    </div>
  );
};
