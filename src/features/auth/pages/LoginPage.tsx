import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/login.schema';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('authRequired') === 'true') {
      toast.error('Debes iniciar sesión para continuar');
      searchParams.delete('authRequired');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values.email, values.password);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Credenciales inválidas. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <ControlledInput
              control={form.control}
              name="email"
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
            />
            <ControlledInput
              control={form.control}
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Ingresando...' : 'Acceder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
