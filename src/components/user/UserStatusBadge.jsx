import Badge from "@/components/common/Badge";

export default function UserStatusBadge({ user }) {
  if (user?.status === false)
    return <Badge variant="danger">Deactivated</Badge>;
  if (user?.isVerified === false)
    return <Badge variant="warning">Pending verification</Badge>;
  return <Badge variant="success">Active</Badge>;
}