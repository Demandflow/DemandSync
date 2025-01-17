import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
})

async function main() {
    try {
        // Create a test organization
        console.log('Creating test organization...')
        const org = await prisma.organization.create({
            data: {
                name: 'Test Organization',
                clickupWorkspaceId: 'test-workspace',
            },
        })
        console.log('Created organization:', org)

        // Create a test user with a unique email
        console.log('Creating test user...')
        const uniqueEmail = `test-${Date.now()}@example.com`
        const user = await prisma.user.create({
            data: {
                email: uniqueEmail,
                role: 'ADMIN',
                organizationId: org.id,
            },
        })
        console.log('Created user:', user)

        // Create a test task
        console.log('Creating test task...')
        const task = await prisma.task.create({
            data: {
                title: 'Test Task',
                description: 'This is a test task',
                status: 'todo',
                clickupTaskId: `test-task-${Date.now()}`,
                organizationId: org.id,
            },
        })
        console.log('Created task:', task)

        // Verify we can fetch the task
        console.log('Fetching tasks...')
        const tasks = await prisma.task.findMany({
            where: { organizationId: org.id },
            include: {
                organization: true,
            },
        })
        console.log('Retrieved tasks:', tasks)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main() 