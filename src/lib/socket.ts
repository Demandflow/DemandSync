import { Server } from 'socket.io'
import { createServer } from 'http'
import { auth } from '@clerk/nextjs'
import prisma from './prisma/client'

// Initialize Socket.io server
const httpServer = createServer()
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST'],
    },
})

// Authentication middleware
io.use(async (socket, next) => {
    try {
        const { userId } = auth()
        if (!userId) {
            return next(new Error('Unauthorized'))
        }

        // Get user's organization
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { organization: true },
        })

        if (!user) {
            return next(new Error('User not found'))
        }

        // Join organization's room
        socket.join(`org_${user.organizationId}`)
        next()
    } catch (error) {
        next(new Error('Authentication failed'))
    }
})

// Start server if not already running
if (!global.socketServer) {
    httpServer.listen(process.env.SOCKET_PORT || 3001)
    global.socketServer = httpServer
}

export default io 