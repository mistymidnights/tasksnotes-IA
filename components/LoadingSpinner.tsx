import { Spinner } from '@heroui/react';

export default function LoadingSpinner() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Spinner size='lg' color='primary' />
      <span className='ml-2 text-white'>Cargando...</span>
    </div>
  );
}
