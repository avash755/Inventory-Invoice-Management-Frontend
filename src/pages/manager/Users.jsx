import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SearchBar from "@/components/common/SearchBar";
import Select from "@/components/common/Select";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import UserStatusBadge from "@/components/user/UserStatusBadge";
import { ROUTES } from "@/constants/routes";

export default function Users() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => userService.list(), []);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => {
        if (q && !`${u.username} ${u.email}`.toLowerCase().includes(q)) return false;
        if (roleFilter !== "all" && u.role !== roleFilter) return false;
        return true;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [users, query, roleFilter]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage managers and employees."
        actions={
          <Button onClick={() => navigate(ROUTES.MANAGER.USER_NEW)}>+ Add user</Button>
        }
      />

      <Card className="mb-4 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by username or email…"
            className="flex-1"
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="sm:w-44"
          >
            <option value="all">All roles</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </Select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="p-10 grid place-items-center"><Spinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={users.length === 0 ? "No users yet" : "No matches"}
            description={
              users.length === 0
                ? "Add your first manager or employee."
                : "Try a different search or filter."
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Username</TH>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((u) => (
                <TR key={u._id}>
                  <TD className="font-medium text-ink-900">
                    <Link to={ROUTES.MANAGER.USER(u._id)} className="hover:text-brand-600">
                      {u.username}
                    </Link>
                  </TD>
                  <TD>{u.email}</TD>
                  <TD className="capitalize">{u.role}</TD>
                  <TD><UserStatusBadge user={u} /></TD>
                  <TD className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(ROUTES.MANAGER.USER_EDIT(u._id))}
                    >
                      Edit
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  );
}