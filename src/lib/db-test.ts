import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // Create a test organization
        const org = await prisma.organization.create({
            data: {
                name: 'Test Organization',
                clickupWorkspaceId: 'test-workspace',
            },
        })
        console.log('Created organization:', org)

        // Create a test user
        const user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                role: 'ADMIN',
                organizationId: org.id,
            },
        })
        console.log('Created user:', user)

        // Create a test task
        const task = await prisma.task.create({
            data: {
                title: 'Test Task',
                description: 'This is a test task',
                status: 'todo',
                clickupTaskId: 'test-task-1',
                organizationId: org.id,
            },
        })
        console.log('Created task:', task)

        // Add a comment to the task
        const comment = await prisma.comment.create({
            data: {
                content: 'Test comment',
                taskId: task.id,
                userId: user.id,
                clickupCommentId: 'test-comment-1',
            },
        })
        console.log('Created comment:', comment)

        // Fetch task with relations
        const taskWithRelations = await prisma.task.findUnique({
            where: { id: task.id },
            include: {
                organization: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        console.log('Retrieved task with relations:', taskWithRelations)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main() 