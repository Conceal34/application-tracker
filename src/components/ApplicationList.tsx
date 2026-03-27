"use client";
import { Application } from "@prisma/client";
import StatusBadge from "./StatusBadge";

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
  const currentDate = new Date();

  if (applications.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl">No applications yet</p>
        <p className="text-sm mt-2">
          Click "Add New Application" to get started
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg">{app.company}</p>
              <p className="text-gray-400 text-sm">{app.role}</p>
              {app.platform && (
                <p className="text-gray-500 text-xs mt-1">{app.platform}</p>
              )}
            </div>
            <StatusBadge status={app.status} />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-xs">
                Applied {app.appliedDate.toLocaleDateString()}
              </p>
              {app.followUpDate && (
                <p
                  className={
                    currentDate.getTime() > app.followUpDate.getTime()
                      ? "text-red-500 text-xs font-medium"
                      : ""
                  }
                >
                  Follow-up: {app.followUpDate.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(app)}
                className="text-sm px-3 py-1 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(app.id)}
                className="text-sm px-3 py-1 rounded-lg border border-red-900 text-red-400 hover:bg-red-950 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// better UI but the above oe will do it for nmow as this one needs a little refinement

// "use client";
// import { Application } from "@prisma/client";
// import StatusBadge from "./StatusBadge";
// import { useState, useEffect } from "react";

// type Props = {
//   applications: Application[];
//   onEdit: (app: Application) => void;
//   onDelete: (id: number) => void;
// };

// export default function ApplicationList({
//   applications,
//   onEdit,
//   onDelete,
// }: Props) {
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);

//   const handleDelete = async (id: number) => {
//     await fetch(`/api/applications/${id}`, {
//       method: "DELETE",
//     });
//     onDelete(id);
//   };

//   const currentDate = new Date();

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClick = () => setOpenMenuId(null);
//     window.addEventListener("click", handleClick);
//     return () => window.removeEventListener("click", handleClick);
//   }, []);

//   if (applications.length === 0) {
//     return (
//       <div className="text-center py-20 text-gray-400">
//         <p className="text-xl">No applications yet</p>
//         <p className="text-sm mt-2">
//           Click "Add New Application" to get started
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//       {applications.map((app) => {
//         const hasLongNotes = app.notes && app.notes.length > 20;
//         const hasUrl = app.appliedUrl && app.appliedUrl.trim() !== "";

//         return (
//           <div
//             key={app.id}
//             className="bg-gray-900 border border-gray-800 rounded-xl p-4"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="font-semibold text-lg">{app.company}</p>
//                 <p className="text-gray-400 text-sm">{app.role}</p>

//                 {app.platform && (
//                   <p className="text-gray-500 text-xs mt-1">{app.platform}</p>
//                 )}
//               </div>

//               <StatusBadge status={app.status} />
//             </div>

//             {/* Notes Preview + 3 dots */}
//             <div className="relative mt-3">
//               {app.notes && (
//                 <p className="text-gray-400 text-sm line-clamp-2">
//                   {app.notes}
//                 </p>
//               )}

//               {(hasLongNotes || hasUrl) && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setOpenMenuId(openMenuId === app.id ? null : app.id);
//                   }}
//                   className="absolute top-0 right-0 text-gray-400 hover:text-white text-lg"
//                 >
//                   ⋮
//                 </button>
//               )}

//               {/* Dropdown */}
//               {openMenuId === app.id && (
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 z-10 space-y-2"
//                 >
//                   {/* URL */}
//                   {hasUrl && (
//                     <a
//                       href={app.appliedUrl!}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="block text-blue-400 text-sm underline break-all"
//                     >
//                       🔗 View Job Posting
//                     </a>
//                   )}

//                   {/* Notes */}
//                   {app.notes && (
//                     <p className="text-gray-300 text-sm whitespace-pre-wrap">
//                       {app.notes}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="flex justify-between items-center mt-4">
//               <div className="flex flex-col gap-1">
//                 <p className="text-gray-500 text-xs">
//                   Applied {new Date(app.appliedDate).toLocaleDateString()}
//                 </p>

//                 {app.followUpDate &&
//                 currentDate.getTime() > new Date(app.followUpDate).getTime() ? (
//                   <p className="text-xs text-red-500 font-medium">
//                     Follow-up: {new Date(app.followUpDate).toLocaleDateString()}
//                   </p>
//                 ) : (
//                   <p className="text-xs text-gray-400">
//                     Follow-up:{" "}
//                     {app.followUpDate
//                       ? new Date(app.followUpDate).toLocaleDateString()
//                       : "—"}
//                   </p>
//                 )}
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => onEdit(app)}
//                   className="text-sm px-3 py-1 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(app.id)}
//                   className="text-sm px-3 py-1 rounded-lg border border-red-900 text-red-400 hover:bg-red-950 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
