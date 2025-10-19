import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userApi } from "@/entities/user";

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const purchaseId = params.get("purchaseId") || "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!purchaseId) {
      navigate("/ticket");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const p = await userApi.getPurchaseById(purchaseId);
        if (!mounted) return;
        if (p.statusCode === "paid" && p.ticketIds[0]) {
          clearInterval(interval);
          navigate(`/ticket/${p.ticketIds[0]}`);
        } else if (p.statusCode === "canceled") {
          clearInterval(interval);
          setError("Оплата отменена");
        }
      } catch (e) {
        // ignore transient errors
      }
    }, 1500);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [purchaseId, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Завершаем оплату…</h3>
      <p>
        Если вы не были перенаправлены автоматически — подождите несколько
        секунд.
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
