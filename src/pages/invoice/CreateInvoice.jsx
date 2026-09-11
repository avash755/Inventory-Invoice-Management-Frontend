import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { customerService } from "@/services/customerService";
import { productService } from "@/services/productService";
import { invoiceService } from "@/services/invoiceService";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/common/ToastProvider";
import { getErrorMessage } from "@/services/api";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import FormField from "@/components/common/FormField";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import InvoiceItemsTable from "@/components/invoice/InvoiceItemsTable";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import { calculateTotals } from "@/utils/invoiceCalculations";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { formatCurrency } from "@/utils/formatCurrency";

import NewCustomerModal from "@/components/customer/NewCustomerModal";

const EMPTY_ITEM = { productId: "", description: "", quantity: "1", unitPrice: "" };

export default function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const isManager = user?.role === ROLES.MANAGER;
  const basePath = isManager ? "/manager/invoices" : "/employee/invoices";

  const customers = useAsync(() => customerService.list(), []);
  const products = useAsync(() => productService.list(), []);

  const [customerId, setCustomerId] = useState("");
  const [billTo, setBillTo] = useState({ contactName: "", companyName: "", address: "", phone: "", email: "" });
  const [shipTo, setShipTo] = useState({ name: "", companyName: "", address: "", phone: "" });
  const [paymentTerms, setPaymentTerms] = useState("Due on receipt");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ discount: "", taxRate: "", shipping: "", amountPaid: "" });
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customersList, setCustomersList] = useState([]);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);

  // Sync fetched customers into local list
  useEffect(() => {
    if (customers.data) setCustomersList(customers.data);
  }, [customers.data]);

  function handleCustomerCreated(created, fresh) {
    if (fresh) setCustomersList(fresh);
    if (created?._id) setCustomerId(created._id);
  }

  // Auto-fill billTo/shipTo when customer changes
  useEffect(() => {
    if (!customerId) return;
    const c = customersList.find((x) => x._id === customerId);
    if (!c) return;
    setBillTo({
      contactName: c.name || "",
      companyName: c.company || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    });
    setShipTo({
      name: c.name || "",
      companyName: c.company || "",
      address: c.address || "",
      phone: c.phone || "",
    });
  }, [customerId, customersList]);

  const totals = useMemo(
    () =>
      calculateTotals({
        items: items.map((it) => ({ quantity: it.quantity, unitPrice: it.unitPrice })),
        discount: summary.discount,
        taxRate: summary.taxRate,
        shipping: summary.shipping,
        amountPaid: summary.amountPaid,
      }),
    [items, summary]
  );

  function addItem() {
    setItems((arr) => [...arr, { ...EMPTY_ITEM }]);
  }
  function updateItem(index, next) {
    setItems((arr) => arr.map((it, i) => (i === index ? next : it)));
  }
  function removeItem(index) {
    setItems((arr) => arr.filter((_, i) => i !== index));
  }

  function validate() {
    if (!customerId) return "Please select a customer.";
    if (items.length === 0) return "Add at least one item.";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.productId) return `Item ${i + 1}: select a product.`;
      if (!it.quantity || Number(it.quantity) < 1) return `Item ${i + 1}: quantity must be ≥ 1.`;
      if (it.unitPrice === "" || Number(it.unitPrice) < 0) return `Item ${i + 1}: enter a valid unit price.`;
      const p = products.data?.find((x) => x._id === it.productId);
      if (p && Number(it.quantity) > p.stock)
        return `Item ${i + 1}: only ${p.stock} ${p.unit} in stock.`;
    }
    const paid = Number(summary.amountPaid) || 0;
    if (paid < 0) return "Amount paid cannot be negative.";
    if (paid > totals.balanceDueWithoutPaid) {
      return `Amount paid cannot exceed the total (${formatCurrency(totals.balanceDueWithoutPaid)}).`;
    }
    return null;
  }

  async function submit({ print = false } = {}) {
    const err = validate();
    if (err) return toast.error(err);

    const payload = {
      customer: customerId,
      billTo,
      shipTo,
      items: items.map((it) => ({
        product: it.productId,
        description: it.description?.trim() || undefined,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
      paymentTerms: paymentTerms || undefined,
      discount: Number(summary.discount) || 0,
      taxRate: Number(summary.taxRate) || 0,
      shipping: Number(summary.shipping) || 0,
      amountPaid: Number(summary.amountPaid) || 0,
      remarks: remarks?.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const res = await invoiceService.create(payload);
      const id = res.invoice?._id;
      toast.success("Invoice created");
      if (!id) return navigate(basePath);
      navigate(print ? `${basePath}/${id}?print=1` : `${basePath}/${id}`);
    } catch (e) {
      toast.error(getErrorMessage(e, "Could not create invoice"));
    } finally {
      setSubmitting(false);
    }
  }

  const anyCustomer = customersList.length > 0;

  if (customers.loading || products.loading) {
    return <div className="p-10 grid place-items-center"><Spinner size="lg" /></div>;
  }
  if (customers.error) return <ErrorState message={customers.error} onRetry={customers.refetch} />;
  if (products.error) return <ErrorState message={products.error} onRetry={products.refetch} />;

  return (
    <>
      <PageHeader
        title="Create invoice"
        description="Fill in the details below. Invoice number is generated automatically."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate(basePath)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => submit({ print: true })} loading={submitting}>
              Save &amp; Print
            </Button>
            <Button onClick={() => submit()} loading={submitting}>
              Save invoice
            </Button>
          </>
        }
      />

      {/* Invoice info */}
      <Card className="p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Invoice number" hint="Auto-generated on save">
            <Input value="—" disabled />
          </FormField>
          <FormField label="Date">
            <Input value={new Date().toLocaleDateString()} disabled />
          </FormField>
          <FormField label="Payment terms" htmlFor="iv-terms">
            <Input
              id="iv-terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. Net 30"
            />
          </FormField>
        </div>
      </Card>

      {/* Customer selector */}
      <Card className="p-5 mb-4">
        <FormField label="Customer" required htmlFor="iv-customer">
          <Select
            id="iv-customer"
            value={customerId}
            onChange={(e) => {
              if (e.target.value === "__new__") {
                setNewCustomerOpen(true);
                return;
              }
              setCustomerId(e.target.value);
            }}
          >
            <option value="">Select a customer…</option>
            <option value="__new__">+ Add new customer</option>
            {customersList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}{c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </Select>
        </FormField>
        {!anyCustomer && (
          <p className="mt-2 text-sm text-ink-500">
            No customers yet. Click "+ Add new customer" above to create one.
            {isManager && (
              <>
                {" "}Or{" "}
                <Link to={ROUTES.MANAGER.CUSTOMER_NEW} className="text-brand-600 hover:underline">
                  open the customer page
                </Link>.
              </>
            )}
          </p>
        )}
      </Card>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-3">Bill to</h3>
          <div className="space-y-3">
            <FormField label="Contact name" htmlFor="bt-name">
              <Input id="bt-name" value={billTo.contactName}
                onChange={(e) => setBillTo({ ...billTo, contactName: e.target.value })} />
            </FormField>
            <FormField label="Company" htmlFor="bt-company">
              <Input id="bt-company" value={billTo.companyName}
                onChange={(e) => setBillTo({ ...billTo, companyName: e.target.value })} />
            </FormField>
            <FormField label="Address" htmlFor="bt-address">
              <Textarea id="bt-address" rows={2} value={billTo.address}
                onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Phone" htmlFor="bt-phone">
                <Input id="bt-phone" value={billTo.phone}
                  onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })} />
              </FormField>
              <FormField label="Email" htmlFor="bt-email">
                <Input id="bt-email" type="email" value={billTo.email}
                  onChange={(e) => setBillTo({ ...billTo, email: e.target.value })} />
              </FormField>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-3">Ship to</h3>
          <div className="space-y-3">
            <FormField label="Name / department" htmlFor="st-name">
              <Input id="st-name" value={shipTo.name}
                onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })} />
            </FormField>
            <FormField label="Company" htmlFor="st-company">
              <Input id="st-company" value={shipTo.companyName}
                onChange={(e) => setShipTo({ ...shipTo, companyName: e.target.value })} />
            </FormField>
            <FormField label="Address" htmlFor="st-address">
              <Textarea id="st-address" rows={2} value={shipTo.address}
                onChange={(e) => setShipTo({ ...shipTo, address: e.target.value })} />
            </FormField>
            <FormField label="Phone" htmlFor="st-phone">
              <Input id="st-phone" value={shipTo.phone}
                onChange={(e) => setShipTo({ ...shipTo, phone: e.target.value })} />
            </FormField>
          </div>
        </Card>
      </div>

      {/* Items */}
      <Card className="p-5 mb-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Items</h3>
        <InvoiceItemsTable
          items={items}
          products={products.data ?? []}
          onChange={updateItem}
          onRemove={removeItem}
          onAdd={addItem}
        />
      </Card>

      {/* Summary */}
      <Card className="p-5 mb-4">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Summary</h3>
        <InvoiceSummary totals={totals} form={summary} onChange={setSummary} />
      </Card>

      {/* Remarks */}
      <Card className="p-5 mb-4">
        <FormField label="Remarks / payment instructions" htmlFor="iv-remarks">
          <Textarea
            id="iv-remarks"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Bank details, thank-you note, special instructions…"
          />
        </FormField>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate(basePath)} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={() => submit()} loading={submitting}>
          Save invoice
        </Button>
      </div>

      {/* New customer modal */}
      <NewCustomerModal
        open={newCustomerOpen}
        onClose={() => setNewCustomerOpen(false)}
        onCreated={handleCustomerCreated}
      />
    </>
  );
}