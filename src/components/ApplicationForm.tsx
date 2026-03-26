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
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold mb-2">
          {application ? "Edit Application" : "New Application"}
        </h2>
        <input
          type="text"
          placeholder="Company *"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Role *"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Platform (LinkedIn, Internshala...)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="url"
          placeholder="Job URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="Applied">Applied</option>
          <option value="Viewed">Viewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-sm">Follow-up Date</label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-500"
          rows={3}
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : application
                ? "Update Application"
                : "Add Application"}
          </button>
          <button
            type="button"
            onClick={() => onSuccess()}
            className="border border-gray-700 hover:bg-gray-800 text-gray-400 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
