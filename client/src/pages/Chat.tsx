import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    newSocket.emit('join', 'chat-room')
    newSocket.on('connect', () => {
      console.log('Connected to chat room')
    })

    newSocket.on('message', (message: string) => {
      setMessages(prevMessages => [...prevMessages, message])
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat room')
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const Submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (input.trim() !== '') {
      if (socket) {
        socket.emit('message', {
          room: 'chat-room',
          message: input
        })
      }
      setInput('')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <h1 className='text-2xl font-bold mb-4'>Chat Room</h1>
      <div
        className='w-full max-w-md bg-white dark:bg-gray-800 rounded '
        style={{ height: '400px', overflowY: 'auto' }}
      >
        <ul className='p-4 space-y-2'>
          {[...new Set(messages)].map((msg, index) => (
            <li
              key={index}
              className='bg-gray-200 dark:bg-gray-700 p-2 rounded'
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
      <form
        className='w-full max-w-md mt-4 flex'
        onSubmit={e => {
          e.preventDefault()
          if (input.trim()) {
            setMessages([...messages, input])
            setInput('')

            Submit(e)
          }
        }}
      >
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          className='flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
          placeholder='Type your message...'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 dark:hover:bg-blue-400'
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
