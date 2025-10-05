import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Stoned Idle Logo"
            width={300}
            height={300}
            className="mx-auto mb-4 drop-shadow-2xl"
            priority
          />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
