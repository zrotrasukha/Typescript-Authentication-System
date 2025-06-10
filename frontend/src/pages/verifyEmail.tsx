import { Loader2 } from "lucide-react"

import { useQuery } from "@tanstack/react-query"
import { verifyEmail } from "@/lib/api"
import { Link, useParams } from "react-router-dom"
import { FailureAlert, SuccessAlert } from "@/components/ui/alerts"

export function VerifyCode() {
    const { code } = useParams();
    const { isPending, isError } = useQuery({
        queryKey: ['lwdakey', code],
        queryFn: () => verifyEmail(code as string),
    })
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-zinc-950">
            <div className="w-fit h-fit items-center justify-center flex flex-col ">
                {isPending ? (<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />) :
                    (isError ? (
                        <>
                            <FailureAlert message="Verification failed" />
                            <div className="flex flex-col items-center justify-center mt-2">
                                <p>The link is either invalid or expired.
                                    <Link to={'/'}
                                        replace className="font-bold text-blue-300 underline hover:text-blue-100 ml-1">Forgot Password </Link>
                                </p>
                                <Link to={'/'} replace className="font-bold underline text-blue-300 hover:text-blue-100 ">
                                    Back to Home
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <SuccessAlert message="Verification successful" />
                            <Link to={'/'}> Back to Home</Link>
                        </>
                    )
                    )}
            </div>
        </div>
    )
}