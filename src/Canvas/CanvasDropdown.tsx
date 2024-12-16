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
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase";

export default function CanvasDropdown() {
  const navigate = useNavigate();

  const [canvasList, setCanvasList] = useState<{ id: string; title: string }[]>(
    []
  );

  useEffect(() => {
    getCanvasList();

    async function getCanvasList() {
      const list: { id: string; title: string }[] = [];
      const query = await getDocs(collection(db, "canvas"));
      query.forEach((doc) => {
        list.push({ id: doc.id, title: doc.data().title });
      });

      setCanvasList(list);
    }
  }, []);

  return (
    <div className="absolute right-[15px] top-[15px] z-20">
      <DropdownMenu>
        <DropdownMenuTrigger>Navigate to Canvas</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Canvas</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canvasList.map((canvas) => {
            return (
              <DropdownMenuItem
                key={canvas.id}
                onClick={() => {
                  navigate(`/impl3/${canvas.id}`);
                }}
              >
                {canvas.title}
              </DropdownMenuItem>
            );
          })}

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
    </div>
  );
}
