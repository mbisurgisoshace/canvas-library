import { MinusIcon, PlusIcon } from "lucide-react";

interface ZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function ZoomControl({ onZoomIn, onZoomOut }: ZoomControlProps) {
  return (
    <div
      style={{
        gap: 5,
        top: 10,
        left: 10,
        zIndex: 100,
        display: "flex",
        position: "absolute",
        flexDirection: "row",
      }}
    >
      <ZoomButton onClick={onZoomIn}>
        <PlusIcon size={20} />
      </ZoomButton>

      <ZoomButton onClick={onZoomOut}>
        <MinusIcon size={20} />
      </ZoomButton>
    </div>
  );
}

interface ZoomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

function ZoomButton({ onClick, children }: ZoomButtonProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 20,
        height: 20,
        display: "flex",
        borderRadius: 3,
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
      }}
    >
      {children}
    </div>
  );
}
