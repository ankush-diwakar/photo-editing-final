const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobOpenings = [
    {
      title: 'Photo Editor',
      description: 'Responsible for editing and retouching product images for e-commerce clients. Requires proficiency in Photoshop and a keen eye for detail.',
      imageUrl: 'https://placehold.co/70x70?text=PE'
    },
    {
      title: 'Team Lead – Photo Editing',
      description: 'Lead a team of editors, manage project workflows, and ensure quality standards. Prior experience in team management is a plus.',
      imageUrl: 'https://placehold.co/70x70?text=TL'
    },
    {
      title: 'Senior Color Grading Specialist',
      description: 'Specialize in color correction and grading for high-end photography. Must have 3+ years experience in professional color work.',
      imageUrl: 'https://placehold.co/70x70?text=CG'
    }
  ];

  for (const job of jobOpenings) {
    await prisma.jobOpening.create({
      data: job
    });
    console.log(`Created job opening: ${job.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });