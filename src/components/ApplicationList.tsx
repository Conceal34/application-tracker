"use client";
import { Application } from "@prisma/client";

type Props = {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
};

export default function ApplicationList({
  applications,
  onEdit,
  onDelete,
}: Props) {
  const handleDelete = async (id: number) => {
    await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
    onDelete(id);
  };
  return (
    <div className="grid grid-cols-3 w-full ">
      {applications.map((app) => (
        <div key={app.id} className="border-r-2 border-stone-300 p-2">
          <div className="flex justify-between">
            <p>{app.role}</p>
            <p>{app.company}</p>
          </div>
          <p>{app.appliedDate.toLocaleDateString()}</p>
          <p>{app.status}</p>
          <button onClick={() => onEdit(app)}>Edit</button>
          <button onClick={() => handleDelete(app.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
