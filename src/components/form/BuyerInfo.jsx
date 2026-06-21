import InputField from '../ui/InputField';

/**
 * BuyerInfo — Client / Buyer information form section.
 */
export default function BuyerInfo({ buyer, onUpdate, errors }) {
  return (
    <div className="space-y-4">
      <p className="section-label">Client Information</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="buyer-clientName"
          label="Client Name"
          value={buyer.clientName}
          onChange={v => onUpdate('clientName', v)}
          placeholder="John Smith"
          required
          error={errors['buyer.clientName']}
        />

        <InputField
          id="buyer-clientEmail"
          label="Client Email"
          type="email"
          value={buyer.clientEmail}
          onChange={v => onUpdate('clientEmail', v)}
          placeholder="john@client.com"
          required
          error={errors['buyer.clientEmail']}
        />

        <div className="sm:col-span-2">
          <InputField
            id="buyer-clientAddress"
            label="Client Address"
            value={buyer.clientAddress}
            onChange={v => onUpdate('clientAddress', v)}
            placeholder="456 Client Street, Delhi, 110001"
            multiline
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
