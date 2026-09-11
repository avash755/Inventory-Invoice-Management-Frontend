import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { customerService } from "@/services/customerService";
import { useAsync } from "@/hooks/useAsync";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SearchBar from "@/components/common/SearchBar";
import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export default function Customers() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => customerService.list(), []);
  const [query, setQuery] = useState("");

  const customers = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers
      .filter((c) =>
        !q ||
        `${c.name} ${c.company ?? ""} ${c.email ?? ""} ${c.phone ?? ""}`
          .toLowerCase()
          .includes(q)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, query]);

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage your customer directory."
        actions={
          <Button onClick={() => navigate(ROUTES.MANAGER.CUSTOMER_NEW)}>
            + Add customer
          </Button>
        }
      />

      <Card className="mb-4 p-3 sm:p-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, company, email, phone…"
        />
      </Card>

      <Card>
        {loading ? (
          <div className="p-10 grid place-items-center"><Spinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={customers.length === 0 ? "No customers yet" : "No matches"}
            description={
              customers.length === 0
                ? "Add your first customer to start creating invoices."
                : "Try a different search."
            }
            action={
              customers.length === 0 && (
                <Button onClick={() => navigate(ROUTES.MANAGER.CUSTOMER_NEW)}>
                  + Add customer
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Company</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((c) => (
                <TR key={c._id}>
                  <TD className="font-medium text-ink-900">
                    <Link
                      to={ROUTES.MANAGER.CUSTOMER(c._id)}
                      className="hover:text-brand-600"
                    >
                      {c.name}
                    </Link>
                  </TD>
                  <TD>{c.company || "—"}</TD>
                  <TD>{c.email || "—"}</TD>
                  <TD>{c.phone || "—"}</TD>
                  <TD className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(ROUTES.MANAGER.CUSTOMER_EDIT(c._id))}
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