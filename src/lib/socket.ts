import { Server } from 'socket.io'
import { auth } from '@clerk/nextjs'

declare global {
    var io: Server | undefined
}

let io: Server

if (process.env.NODE_ENV !== 'production') {
    // In development, create a new instance if it doesn't exist
    if (!global.io) {
        global.io = new Server({
            cors: {
                origin: process.env.NEXT_PUBLIC_APP_URL,
                methods: ['GET', 'POST'],
            },
        })
        global.io.listen(parseInt(process.env.SOCKET_PORT || '3001'))
    }
    io = global.io as Server
} else {
    // In production (Vercel), we don't need to create a server
    io = new Server({
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL,
            methods: ['GET', 'POST'],
        },
    })
}

// Authentication middleware
io.use(async (socket, next) => {
    try {
        const { userId } = auth()
        if (!userId) {
            return next(new Error('Unauthorized'))
        }
        // Join user's room
        socket.join(`user_${userId}`)
        next()
    } catch (error) {
        next(new Error('Authentication failed'))
    }
})

export { io } 