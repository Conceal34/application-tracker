import { Status } from "@prisma/client";

type Props = {
  status: Status;
};

const statusStyles: Record<Status, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Viewed: "bg-yellow-100 text-yellow-700",
  Interview: "bg-purple-100 text-purple-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
