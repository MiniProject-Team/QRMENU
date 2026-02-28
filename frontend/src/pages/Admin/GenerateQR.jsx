import { useState, useEffect } from "react";
import { generateAllTableQRs } from "../../api/qrApi";

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
    const tableId =
      qr?.tableId ??
      qr?.table_id ??
      qr?.id ??
      qr?.tableID ??
      null;
    const tableNumber =
      qr?.tableNumber ??
      qr?.tableNo ??
      qr?.table_no ??
      qr?.table_number ??
      null;
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>QR Code Generator</h1>
          <p style={styles.subtitle}>Generate and print QR codes for all tables</p>
        </div>
        <div style={styles.actions}>
          <button style={styles.refreshBtn} onClick={fetchQRCodes} disabled={generating}>
            {generating ? "Generating..." : "🔄 Refresh"}
          </button>
          <button style={styles.printBtn} onClick={handlePrint}>
            🖨️ Print All
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading QR codes...</div>
      ) : qrCodes.length === 0 ? (
        <div style={styles.empty}>
          <p>No tables found. Please add tables first.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {qrCodes.map((qr, index) => (
            <div key={qr.tableId ?? qr.qrUrl ?? index} style={styles.qrCard}>
              <div style={styles.qrImage}>
                {qr.qrCode ? (
                  <img 
                    src={qr.qrCode} 
                    alt={`Table ${getTableLabel(qr)}`}
                    style={styles.qrImg}
                  />
                ) : (
                  <div style={styles.qrFallback}>QR unavailable</div>
                )}
              </div>
              <div style={styles.tableInfo}>
                <h3 style={styles.tableNumber}>Table {getTableLabel(qr)}</h3>
                {qr.qrUrl ? <p style={styles.qrUrl}>{qr.qrUrl}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            color: black !important;
          }
          div[style*="background: #0a0a0f"] {
            background: white !important;
          }
          div[style*="grid-template-columns"] {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0f",
    padding: "30px",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: "16px",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  refreshBtn: {
    padding: "12px 24px",
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "12px",
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  printBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    color: "#9ca3af",
    fontSize: "18px",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  qrCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  qrImage: {
    background: "#fff",
    padding: "16px",
    borderRadius: "16px",
    display: "inline-block",
    marginBottom: "16px",
  },
  qrImg: {
    width: "180px",
    height: "180px",
    display: "block",
  },
  qrFallback: {
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    fontSize: "14px",
    fontWeight: "600",
    background: "#f3f4f6",
    borderRadius: "8px",
  },
  tableInfo: {
    marginTop: "16px",
  },
  tableNumber: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "#fff",
  },
  qrUrl: {
    fontSize: "12px",
    color: "#9ca3af",
    wordBreak: "break-all",
    margin: 0,
  },
};

export default GenerateQR;
