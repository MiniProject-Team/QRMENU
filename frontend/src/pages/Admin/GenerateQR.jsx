import { useEffect, useMemo, useState } from "react";
import { generateAllTableQRs } from "../../api/qrApi";
import OpsLayout from "../../components/ops/OpsLayout";

const GenerateQR = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const normalizeQr = (qr) => {
    const rawCode = qr?.qrCode ?? qr?.qr_code ?? qr?.qrCodeBase64 ?? qr?.qr_code_base64;
    const qrCode = rawCode && String(rawCode).trim();
    const tableId = qr?.tableId ?? qr?.table_id ?? qr?.id ?? qr?.tableID ?? null;
    const tableNumber = qr?.tableNumber ?? qr?.tableNo ?? qr?.table_no ?? qr?.table_number ?? null;
    const qrUrl = qr?.qrUrl ?? qr?.qr_url ?? qr?.url ?? "";

    let finalQrCode = qrCode || "";
    if (finalQrCode && !finalQrCode.startsWith("data:image")) {
      finalQrCode = `data:image/png;base64,${finalQrCode}`;
    }

    return {
      tableId,
      tableNumber,
      qrUrl,
      qrCode: finalQrCode,
    };
  };

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      setGenerating(true);
      const res = await generateAllTableQRs();
      const payload = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.qrCodes)
        ? res.data.qrCodes
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setQrCodes(payload.map(normalizeQr));
    } catch (err) {
      console.error("Error fetching QR codes:", err);
      setQrCodes([]);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTableLabel = (qr) => {
    const raw = qr?.tableNumber ?? qr?.tableNo ?? qr?.table_no;
    const label = raw === null || raw === undefined ? "" : String(raw).trim();
    if (label) return label;
    if (qr?.tableId !== undefined && qr?.tableId !== null) return `#${qr.tableId}`;
    return "N/A";
  };

  const availableCount = useMemo(() => qrCodes.filter((qr) => qr.qrCode).length, [qrCodes]);

  return (
    <OpsLayout
      title="QR Code Studio"
      subtitle="Generate, review, and print table QR cards in a format that is ready for the dining floor."
      eyebrow="Admin / QR Codes"
      role="admin"
      badge={`${qrCodes.length} tables`}
      actions={
        <>
          <button className="secondary-btn no-print" onClick={fetchQRCodes} disabled={generating}>
            {generating ? "Refreshing..." : "Refresh QR"}
          </button>
          <button className="primary-btn no-print" onClick={handlePrint} disabled={qrCodes.length === 0}>
            Print cards
          </button>
        </>
      }
    >
      <style>{CSS}</style>

      <section className="summary-grid no-print">
        <article className="panel-card hero-card">
          <span className="section-kicker">Print-ready batch</span>
          <h3>Keep every table entry scannable and easy to place in service.</h3>
          <p>
            Refresh the batch before printing so each table card uses the latest menu link and current table mapping.
          </p>
        </article>

        <article className="panel-card metric-card">
          <span>Total tables</span>
          <strong>{qrCodes.length}</strong>
        </article>

        <article className="panel-card metric-card">
          <span>QR available</span>
          <strong>{availableCount}</strong>
        </article>
      </section>

      {loading ? (
        <section className="panel-card empty-state">
          <h3>Loading QR codes...</h3>
          <p>Preparing the table set for preview and print.</p>
        </section>
      ) : qrCodes.length === 0 ? (
        <section className="panel-card empty-state">
          <h3>No QR cards available</h3>
          <p>Add tables first, then return here to generate printable QR cards.</p>
        </section>
      ) : (
        <section className="qr-grid print-grid">
          {qrCodes.map((qr, index) => (
            <article key={qr.tableId ?? qr.qrUrl ?? index} className="panel-card qr-card">
              <div className="qr-card-head">
                <span className="table-chip">Table {getTableLabel(qr)}</span>
                <span className={`status-chip ${qr.qrCode ? "is-ready" : "is-missing"}`}>
                  {qr.qrCode ? "Ready" : "Missing"}
                </span>
              </div>

              <div className="qr-preview">
                {qr.qrCode ? (
                  <img src={qr.qrCode} alt={`Table ${getTableLabel(qr)}`} className="qr-image" />
                ) : (
                  <div className="qr-fallback">QR unavailable</div>
                )}
              </div>

              <div className="qr-card-body">
                <h3>Scan to open menu</h3>
                <p>Place this card on table {getTableLabel(qr)} for direct guest ordering.</p>
                {qr.qrUrl ? (
                  <div className="url-box">
                    <span>Destination</span>
                    <code>{qr.qrUrl}</code>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </OpsLayout>
  );
};

const CSS = `
  .primary-btn,
  .secondary-btn {
    border: none;
    border-radius: 14px;
    padding: 12px 16px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .primary-btn {
    background: #17212b;
    color: #fff;
  }

  .secondary-btn {
    background: rgba(255, 252, 246, 0.84);
    color: #17212b;
    border: 1px solid rgba(23, 33, 43, 0.12);
  }

  .primary-btn:disabled,
  .secondary-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .panel-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 252, 246, 0.84);
    border: 1px solid rgba(23, 33, 43, 0.08);
    box-shadow: 0 24px 80px rgba(77, 56, 20, 0.09);
  }

  .summary-grid,
  .qr-grid {
    display: grid;
    gap: 16px;
  }

  .summary-grid {
    grid-template-columns: minmax(0, 1.6fr) repeat(2, minmax(180px, 0.7fr));
  }

  .hero-card {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at top right, rgba(244, 183, 64, 0.24), transparent 30%),
      linear-gradient(135deg, rgba(255, 252, 246, 0.94), rgba(247, 239, 223, 0.92));
  }

  .section-kicker,
  .metric-card span,
  .url-box span {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.72rem;
    font-weight: 800;
    color: #8a6b45;
  }

  .hero-card h3,
  .empty-state h3,
  .qr-card-body h3 {
    margin: 10px 0 8px;
  }

  .hero-card p,
  .empty-state p,
  .qr-card-body p {
    margin: 0;
    color: #6d7785;
    line-height: 1.6;
  }

  .metric-card {
    display: grid;
    align-content: center;
    min-height: 150px;
  }

  .metric-card strong {
    margin-top: 10px;
    font-size: clamp(2.1rem, 4vw, 3rem);
    letter-spacing: -0.06em;
    color: #17212b;
  }

  .empty-state {
    text-align: center;
  }

  .qr-grid {
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  }

  .qr-card {
    display: grid;
    gap: 18px;
    background:
      linear-gradient(180deg, rgba(255, 252, 246, 0.95), rgba(246, 239, 228, 0.92));
  }

  .qr-card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  .table-chip,
  .status-chip {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .table-chip {
    background: rgba(23, 33, 43, 0.06);
    color: #445263;
  }

  .status-chip.is-ready {
    background: rgba(53, 197, 138, 0.16);
    color: #1b8f61;
  }

  .status-chip.is-missing {
    background: rgba(239, 107, 115, 0.12);
    color: #b4434b;
  }

  .qr-preview {
    display: grid;
    place-items: center;
    min-height: 250px;
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(244, 237, 224, 0.96));
    border: 1px solid rgba(23, 33, 43, 0.06);
  }

  .qr-image {
    width: min(100%, 210px);
    aspect-ratio: 1;
    object-fit: contain;
    display: block;
  }

  .qr-fallback {
    width: 210px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: #f2ede3;
    color: #7a684f;
    font-weight: 700;
    text-align: center;
    padding: 16px;
  }

  .qr-card-body {
    display: grid;
    gap: 12px;
  }

  .url-box {
    padding: 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(23, 33, 43, 0.08);
  }

  .url-box code {
    display: block;
    margin-top: 10px;
    color: #445263;
    word-break: break-all;
    font-size: 0.78rem;
    line-height: 1.55;
  }

  @media (max-width: 980px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    .no-print,
    .ops-sidebar,
    .ops-header {
      display: none !important;
    }

    .ops-shell,
    .ops-main,
    .ops-content {
      display: block !important;
      background: #fff !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .print-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }

    .qr-card,
    .qr-preview,
    .url-box,
    .panel-card {
      box-shadow: none !important;
      background: #fff !important;
      break-inside: avoid;
    }

    .qr-card {
      border: 1px solid #d7d1c6 !important;
      padding: 16px !important;
    }

    .qr-preview {
      min-height: 220px;
    }

    .url-box code {
      font-size: 0.72rem;
    }
  }
`;

export default GenerateQR;
