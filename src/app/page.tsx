export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ApplicationPage from "@/components/ApplicationPage";

export default async function Home() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Application Tracker</h1>
        <ApplicationPage initialApplications={applications} />
      </div>
    </main>
  );
}
