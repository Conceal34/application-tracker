"use client";

import { useEffect, useState } from "react";
import { Application, Status } from "@prisma/client";

type Props = {
  application?: Application;
  onSuccess: () => void;
};

export default function ApplicationForm({ application, onSuccess }: Props) {
  const getDefaultFollowUpDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  };

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [followUpDate, setFollowUpDate] = useState(getDefaultFollowUpDate());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      const oneWeekAfter = new Date(application.appliedDate);
      oneWeekAfter.setDate(oneWeekAfter.getDate() + 7);

      setCompany(application.company);
      setRole(application.role);
      setPlatform(application.platform ?? "");
      setUrl(application.url ?? "");
      setStatus(application.status);
      setFollowUpDate(
        application.followUpDate
          ? new Date(application.followUpDate).toISOString().split("T")[0]
          : oneWeekAfter.toISOString().split("T")[0],
      );
      setNotes(application.notes ?? "");
    }
  }, [application]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = { company, role, platform, url, status, followUpDate, notes };

    try {
      if (application) {
        await fetch(`/api/applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`/api/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      onSuccess();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="company"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
          }}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="platform"
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
          }}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="JOB url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as Status);
          }}
          className="border p-2 rounded"
        >
          <option value="Applied">Applied</option>
          <option value="Viewed">Viewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => {
            e.target.value;
          }}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="notes"
          value={notes}
          onChange={(e) => {
            e.target.value;
          }}
          className="border p-2 rounded"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : application
              ? "Update Application"
              : "Add Application"}
        </button>
      </form>
    </div>
  );
}
