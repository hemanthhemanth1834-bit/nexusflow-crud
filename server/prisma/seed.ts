import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const records = [
  {
    title: 'Project Kickoff Meeting',
    description: 'Schedule and prepare for the initial project kickoff meeting with all stakeholders',
    status: 'active',
    priority: 'high',
    category: 'project',
  },
  {
    title: 'Database Schema Design',
    description: 'Design and finalize the database schema for the new application',
    status: 'active',
    priority: 'critical',
    category: 'task',
  },
  {
    title: 'User Authentication Flow',
    description: 'Implement JWT-based authentication with refresh token rotation',
    status: 'draft',
    priority: 'high',
    category: 'task',
  },
  {
    title: 'Weekly Standup Notes',
    description: 'Notes from the weekly team standup - blockers discussed and action items assigned',
    status: 'archived',
    priority: 'low',
    category: 'note',
  },
  {
    title: 'Mobile App Redesign Concept',
    description: 'Brainstorm ideas for redesigning the mobile app with a focus on usability and modern aesthetics',
    status: 'draft',
    priority: 'medium',
    category: 'idea',
  },
  {
    title: 'API Rate Limiting Implementation',
    description: 'Add rate limiting middleware to protect API endpoints from abuse and excessive requests',
    status: 'active',
    priority: 'high',
    category: 'task',
  },
  {
    title: 'Q3 Performance Report',
    description: 'Compile and analyze performance metrics for the third quarter review',
    status: 'archived',
    priority: 'medium',
    category: 'general',
  },
  {
    title: 'CI/CD Pipeline Optimization',
    description: 'Reduce build times by optimizing the continuous integration and deployment pipeline',
    status: 'active',
    priority: 'medium',
    category: 'project',
  },
  {
    title: 'Feature Flag System',
    description: 'Research and propose a feature flag system for gradual rollouts and A/B testing',
    status: 'draft',
    priority: 'low',
    category: 'idea',
  },
  {
    title: 'Security Audit Preparation',
    description: 'Prepare documentation and access credentials for the upcoming third-party security audit',
    status: 'active',
    priority: 'critical',
    category: 'task',
  },
  {
    title: 'Component Library Documentation',
    description: 'Write comprehensive documentation for the shared component library including usage examples',
    status: 'archived',
    priority: 'low',
    category: 'note',
  },
  {
    title: 'Real-time Notifications',
    description: 'Implement WebSocket-based real-time notification system for live updates',
    status: 'draft',
    priority: 'high',
    category: 'project',
  },
]

async function main() {
  console.log('Seeding database...')

  const email = 'demo@nexusflow.app'
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email,
      },
    })
  }

  let project = await prisma.project.findFirst({
    where: { userId: user.id, name: 'Default Workspace' },
  })

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'Default Workspace',
        description: 'Primary workspace for all demo records',
        userId: user.id,
      },
    })
  }

  for (const record of records) {
    await prisma.record.create({ data: { ...record, projectId: project.id } })
  }

  console.log(`Created User (${user.email}), Project (${project.name}) and ${records.length} records`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
