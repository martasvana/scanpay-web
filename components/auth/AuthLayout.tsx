import { AuthForm } from "./AuthForm";
import { Testimonial } from "./Testimonial";

interface AuthLayoutProps {
  type: "signin" | "signup";
  onSubmit?: (email: string) => void;
}

export const AuthLayout = ({ type, onSubmit }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center py-10 px-4">
        <AuthForm type={type} onSubmit={onSubmit} />
      </div>
      
      <div className="hidden md:flex md:w-1/2 bg-gray-50 items-center justify-center p-8">
        <Testimonial />
      </div>
    </div>
  );
}; 