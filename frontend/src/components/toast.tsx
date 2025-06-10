import toast from "react-hot-toast";

export function errorToast(error: any) {
    toast.error(error?.message,{
        position: "bottom-center"
    });
}

export function successToast(condition: Promise<any>, message: string) {
    toast.promise(condition, {
        loading: 'Loading...',
        success: message,
        error: (error) => {
            return error?.message || 'An error occurred';
        },
    }
        
    );
}