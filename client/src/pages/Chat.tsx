import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string
  text: string
}

const SOCKET_URL = 'http://localhost:3000'
const ROOM = 'chat-room'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Setup socket connection and listeners
  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    socket.emit('join', ROOM)

    socket.on('connect', () => setIsConnected(true))

    socket.on('disconnect', () => setIsConnected(false))

    socket.on('connect_error', err => {
      console.error('Connection error:', err)
      setIsConnected(false)
    })

    socket.on('connect_timeout', () => {
      console.error('Connection timed out')
      setIsConnected(false)
    })

    socket.on('message', (message: string) => {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: message
        }
      ])
    })

    return () => {
      socket.emit('leave', ROOM)
      socket.off('connect')
      socket.off('disconnect')
      socket.off('message')
      socket.disconnect()
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }, [messages])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (input.trim() && socketRef.current && isConnected) {
        socketRef.current.emit('message', {
          room: ROOM,
          message: input
        })
        setInput('')
      }
    },
    [input, isConnected]
  )

  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        Chat Room {isConnected ? '🟢' : '🔴'}
      </h1>
      <div
        className='w-full max-w-md bg-white dark:bg-gray-800 rounded'
        style={{ height: '400px', overflowY: 'auto' }}
        ref={messagesEndRef}
      >
        <ul className='p-4 space-y-2'>
          {messages.map(msg => (
            <li
              key={msg.id}
              className='bg-gray-200 dark:bg-gray-700 p-2 rounded'
            >
              {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <form className='w-full max-w-md mt-4 flex' onSubmit={handleSubmit}>
        <input
          type='text'
          value={input}
          onChange={handleInputChange}
          className='flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
          placeholder={isConnected ? 'Type your message...' : 'Connecting...'}
          disabled={!isConnected}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 dark:hover:bg-blue-400'
          disabled={!isConnected || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
