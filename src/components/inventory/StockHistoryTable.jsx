import { Table, THead, TH, TBody, TR, TD } from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { formatDateTime } from "@/utils/formatDate";

export default function StockHistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <EmptyState
        title="No stock history"
        description="Stock adjustments for this product will appear here."
      />
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Type</TH>
          <TH className="text-right">Qty</TH>
          <TH className="text-right">Before</TH>
          <TH className="text-right">After</TH>
          <TH>By</TH>
          <TH>Date</TH>
        </TR>
      </THead>
      <TBody>
        {history.map((tx) => {
          const isSale = tx.type === "sale";
          return (
            <TR key={tx._id}>
              <TD>
                <Badge variant={isSale ? "danger" : "success"}>
                  {isSale ? "Sale" : "Stock in"}
                </Badge>
              </TD>
              <TD className="text-right tabular-nums">
                {isSale ? `−${tx.quantity}` : `+${tx.quantity}`}
              </TD>
              <TD className="text-right tabular-nums">{tx.previousStock}</TD>
              <TD className="text-right tabular-nums">{tx.newStock}</TD>
              <TD>{tx.createdBy?.username ?? "—"}</TD>
              <TD>{formatDateTime(tx.createdAt)}</TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}