import { CheckCircle2Icon, CircleX } from "lucide-react";

export const SuccessAlert = ({ message = "Successful!" }: { message: string }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-green-200 text-green-800 rounded-md shadow-md max-w-md">
      <CheckCircle2Icon size={24} className="flex-shrink-0" />
      <span className="text-lg font-medium">{message}</span>
    </div>
  );
};

export const FailureAlert = ({ message = "Something went wrong" }: { message: string }) => {
  return (
    <div className="flex items-center gap-3 px-24 py-2 bg-red-200 text-red-800 rounded-md shadow-md max-w-md">
      <CircleX size={24} className="flex-shrink-0" />
      <span className="text-lg font-medium">{message}</span>
    </div>
  );
};