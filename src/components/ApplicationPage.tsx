"use client";
import { Application } from "@prisma/client";
import { useState, useEffect } from "react";
import ApplicationForm from "./ApplicationForm";
import ApplicationList from "./ApplicationList";
import { useRouter } from "next/navigation";

type Props = {
  initialApplications: Application[];
};

export default function ApplicationPage({ initialApplications }: Props) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<
    Application | undefined
  >(undefined);
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  return (
    <div>
      <button
        onClick={() => {
          setSelectedApplication(undefined);
          setShowForm(true);
        }}
      >
        Add NEW Application
      </button>

      {showForm && (
        <ApplicationForm
          application={selectedApplication}
          onSuccess={() => {
            setShowForm(false);
            setSelectedApplication(undefined);
            router.refresh();
          }}
        />
      )}

      <ApplicationList
        applications={applications}
        onEdit={(app) => {
          setSelectedApplication(app);
          setShowForm(true);
        }}
        onDelete={(id) => {
          setApplications(applications.filter((app) => app.id !== id));
        }}
      />
    </div>
  );
}
