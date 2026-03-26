import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ApplicationList from "@/components/ApplicationList";
import ApplicationPage from "@/components/ApplicationPage";

export default async function Home() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Current Applications</h1>
      <ApplicationPage initialApplications={applications} />
    </main>
  );
}
