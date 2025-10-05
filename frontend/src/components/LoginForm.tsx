'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '@/services/api';

export default function LoginForm() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      alert('Por favor, digite um nickname!');
      return;
    }

    setIsLoading(true);

    try {
      // Usar o serviço da API
      const data = await ApiService.login(nickname.trim());
      
      // Salvar dados do backend
      localStorage.setItem('playerNickname', nickname.trim());
      localStorage.setItem('playerId', data.playerId.toString());
      localStorage.setItem('token', data.token);
      
      // Redirecionar para o jogo
      router.push('/game');
      
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao conectar com o servidor. Verifique se o backend está rodando!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="nickname" 
            className="block text-sm font-medium text-green-100 mb-2"
          >
            Escolha seu nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            placeholder="Digite seu nickname..."
            maxLength={20}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !nickname.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Entrando...
            </>
          ) : (
            '🌿 Entrar no Jogo'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-green-200 text-sm">
          Primeira vez? Não se preocupe, é só escolher um nickname!
        </p>
      </div>
    </div>
  );
}