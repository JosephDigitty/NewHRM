import { useToastContext } from '../Context/ToastContext';

const useToast = () => {
  return useToastContext();
};

export default useToast;