import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh+100px)] flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white">Bem-vindo à sua Lista de Tarefas</h1>
        <p className="mt-2 text-lg text-white/80">Organize seu dia, conquiste seus objetivos.</p>
      </div>
      <LoginForm />
    </div>
  );
}
