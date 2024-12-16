import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CanvasDropdown() {
  const navigate = useNavigate();

  const [canvasList, setCanvasList] = useState<{ id: string; title: string }[]>(
    []
  );

  useEffect(() => {}, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Navigate to Canvas</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Canvas</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuLabel>DB Builder</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate("/db-builder");
          }}
        >
          Go to Db Builder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
