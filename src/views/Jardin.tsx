import React, { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLeaderboard, useAttendanceScan } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Card, Badge, Button } from "../components/ui";
import { PinModal } from "../components/PinModal";
import { TopBar } from "../components/TopBar";
import "./Jardin.css";

export const Jardin: React.FC = () => {
  // Agregar animación CSS para la flor solo una vez
  useEffect(() => {
    if (!document.getElementById("flower-pop-keyframes")) {
      const style = document.createElement("style");
      style.id = "flower-pop-keyframes";
      style.innerHTML = `@keyframes flowerPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }`;
      document.head.appendChild(style);
    }
  }, []);
  const { data, isLoading, error } = useLeaderboard();
  const { user } = useAuth();
  const parentRef = useRef<HTMLDivElement>(null);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [showFlowerAnim, setShowFlowerAnim] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const { mutateAsync: scanAttendance } = useAttendanceScan();

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);
    // Auto-focus next input
    if (value && index < 3) {
      const next = document.getElementById(`pin-input-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");
    const pin = pinDigits.join("");
    if (pin.length !== 4) {
      setPinError("Debes ingresar el PIN completo.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await scanAttendance({ sessionPin: pin });
      if (response.added) {
        setPinSuccess(response.message || "Has recibido 1 flor 🌸");
        setPinDigits(["", "", "", ""]);
        setShowFlowerAnim(true);
        setShowPinModal(false);
        setTimeout(() => {
          setShowFlowerAnim(false);
          setPinSuccess("");
        }, 3000);
      } else {
        setPinError(response.message || "No se pudo registrar asistencia.");
      }
    } catch (err: any) {
      setPinError(
        err?.message?.includes("incorrect")
          ? "PIN incorrecto. Intenta nuevamente."
          : "Error al registrar asistencia.",
      );
    }
    setIsSubmitting(false);
  };

  const virtualizer = useVirtualizer({
    count: data?.entries.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="jardin">
        <div className="jardin__container">
          <div className="jardin__loading">Cargando jardín...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jardin">
        <div className="jardin__container">
          <Card variant="elevated" padding="lg">
            <p className="jardin__error">Error al cargar el jardín</p>
            <Button
              variant="primary"
              style={{ margin: "2rem auto", display: "block" }}
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user_data");
                window.location.reload();
              }}
            >
              Recargar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentUserEntry =
    data?.currentUser ||
    data?.entries.find((entry) => entry.user.id === user?.id);

  return (
    <div className="jardin">
      <TopBar isAdmin={user?.role === "admin"} />
      <div className="jardin__container">
        <header className="jardin__header">
          <h1 className="jardin__title">Jardín de Emaús</h1>
          <p className="jardin__subtitle">
            Reconocimiento a la constancia y presencia de nuestra comunidad
          </p>
        </header>

        <Button
          variant="primary"
          style={{ margin: "2rem auto", display: "block" }}
          onClick={() => setShowPinModal(true)}
        >
          Registrar asistencia
        </Button>

        {currentUserEntry && (
          <Card
            variant="elevated"
            padding="lg"
            className="jardin__current-user"
          >
            <div className="jardin__current-user-content">
              <div className="jardin__current-user-info">
                <p className="jardin__current-user-label">Tu posición</p>
                <h2 className="jardin__current-user-name">
                  {currentUserEntry.user.name}
                </h2>
              </div>
              <div className="jardin__current-user-stats">
                <Badge variant="success" size="lg">
                  #{currentUserEntry.rank}
                </Badge>
                <div className="jardin__flores-badge">
                  <span className="jardin__flores-count">
                    {currentUserEntry.flores}
                  </span>
                  <span className="jardin__flores-icon">🌸</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <PinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          title="Ingresar PIN de la sesión"
        >
          <form
            onSubmit={handlePinSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`pin-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  style={{
                    width: 40,
                    height: 48,
                    fontSize: "1.5rem",
                    textAlign: "center",
                    border: "1px solid #6B3A1E",
                    borderRadius: 8,
                    background: "#FAF9F7",
                    color: "#6B3A1E",
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || pinDigits.some((d) => !d)}
              variant="primary"
            >
              {isSubmitting ? "Registrando..." : "Registrar asistencia"}
            </Button>
            {pinError && (
              <div
                style={{ color: "#D64545", marginTop: 8, textAlign: "center" }}
              >
                {pinError}
              </div>
            )}
          </form>
        </PinModal>

        {pinSuccess && (
          <Card variant="elevated" className="jardin__pin-success">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                className="jardin__pin-success-icon"
                style={{
                  fontSize: "3rem",
                  color: "#27AE60",
                  marginBottom: 8,
                  animation: showFlowerAnim ? "flowerPop 1s ease" : undefined,
                }}
              >
                🌸
              </div>
              <div
                className="jardin__pin-success-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#27AE60",
                  textAlign: "center",
                }}
              >
                +1 flor
              </div>
              <div
                className="jardin__pin-success-message"
                style={{
                  marginTop: 8,
                  textAlign: "center",
                  color: "#27AE60",
                  fontWeight: 500,
                }}
              >
                {pinSuccess}
              </div>
            </div>
          </Card>
        )}
        <div className="jardin__list-header">
          <h3 className="jardin__list-title">Orden de Flores</h3>
          <p className="jardin__list-subtitle">
            Celebramos a cada hermana por su compromiso
          </p>
        </div>

        <div
          ref={parentRef}
          className="jardin__list"
          style={{
            height: "600px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const entry = data!.entries[virtualItem.index];
              return (
                <div
                  key={entry.user.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    paddingBottom: "0.5rem",
                  }}
                >
                  <Card
                    variant={entry.isCurrentUser ? "outlined" : "default"}
                    padding="md"
                    className="jardin__entry"
                  >
                    <div className="jardin__entry-rank">
                      {entry.rank <= 3 ? (
                        <span className="jardin__medal">
                          {entry.rank === 1 && "🥇"}
                          {entry.rank === 2 && "🥈"}
                          {entry.rank === 3 && "🥉"}
                        </span>
                      ) : (
                        <span className="jardin__rank-number">
                          #{entry.rank}
                        </span>
                      )}
                    </div>
                    <div className="jardin__entry-info">
                      <h4 className="jardin__entry-name">{entry.user.name}</h4>
                      {entry.isCurrentUser && (
                        <span className="jardin__entry-badge-text">Tú</span>
                      )}
                    </div>
                    <div className="jardin__entry-flores">
                      <span className="jardin__entry-flores-count">
                        {entry.flores}
                      </span>
                      <span className="jardin__entry-flores-icon">🌸</span>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
