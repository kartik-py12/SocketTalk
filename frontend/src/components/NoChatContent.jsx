import { MessageSquare } from "lucide-react"

const NoChatContent = () => {
  return (
        <div className='w-full flex flex-1  flex-col items-center text-center p-16 bg-base-100/50 justify-center'>
            <div className="max-w-md text-center space-y-6">
                <div className="flex justify-center gap-4 mb-4">
                    {/* <div className="relative"> */}
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce p-2">
                            <MessageSquare className='size-20 text-primary '/>
                        </div>
                    {/* </div> */}
                </div>

        {/* <div className="mx-auto flex-col flex gap-y-2 "> */}
            <h1 className='font-bold text-primary text-2xl'>Welcome to SocketTalk</h1>
            <p className='text-primary/50 text-md '>Select a conversation from the sidebar to start chatting</p>
        {/* </div> */}
            </div>
    </div>

    )
}

export default NoChatContent