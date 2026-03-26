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

  const stats = {
    total: initialApplications.length,
    interviews: initialApplications.filter((app) => app.status === "Interview")
      .length,
    offers: initialApplications.filter((app) => app.status === "Offer").length,
    rejectionRate:
      (initialApplications.filter((app) => app.status === "Rejected").length /
        initialApplications.length) *
      100,
  };

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  return (
    <div>
      {/*application statitistics container*/}
      {initialApplications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No applications yet</p>
          <p className="text-sm mt-2">
            Not enough applications yet to have statistics
          </p>
          <p className="text-sm mt-2">Try adding an application</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm mt-1">Total Applied</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">
              {stats.interviews}
            </p>
            <p className="text-gray-400 text-sm mt-1">Interviews</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{stats.offers}</p>
            <p className="text-gray-400 text-sm mt-1">Offers</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {stats.rejectionRate}%
            </p>
            <p className="text-gray-400 text-sm mt-1">Rejection Rate</p>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setSelectedApplication(undefined);
          setShowForm(true);
        }}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        + Add New Application
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
          router.refresh();
        }}
      />
    </div>
  );
}
