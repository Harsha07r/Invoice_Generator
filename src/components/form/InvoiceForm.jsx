import SellerInfo     from './SellerInfo';
import BuyerInfo      from './BuyerInfo';
import InvoiceDetails from './InvoiceDetails';
import LineItems      from './LineItems';
import GSTSection     from './GSTSection';

/**
 * InvoiceForm — composed form with all sections.
 */
export default function InvoiceForm({
  seller, buyer, invoice, items, gstRate, currency, errors,
  onUpdateSeller, onUpdateBuyer, onUpdateInvoice,
  onUpdateItem, onAddItem, onRemoveItem,
  onGSTChange,
}) {
  return (
    <div className="space-y-6">
      {/* Seller */}
      <section className="card p-5">
        <SellerInfo
          seller={seller}
          onUpdate={onUpdateSeller}
          errors={errors}
        />
      </section>

      {/* Buyer */}
      <section className="card p-5">
        <BuyerInfo
          buyer={buyer}
          onUpdate={onUpdateBuyer}
          errors={errors}
        />
      </section>

      {/* Invoice Details */}
      <section className="card p-5">
        <InvoiceDetails
          invoice={invoice}
          onUpdate={onUpdateInvoice}
        />
      </section>

      {/* Line Items */}
      <section className="card p-5">
        <LineItems
          items={items}
          currency={currency}
          errors={errors}
          onUpdate={onUpdateItem}
          onAdd={onAddItem}
          onRemove={onRemoveItem}
        />
      </section>

      {/* GST & Totals */}
      <section className="card p-5">
        <GSTSection
          items={items}
          gstRate={gstRate}
          currency={currency}
          onGSTChange={onGSTChange}
        />
      </section>
    </div>
  );
}
