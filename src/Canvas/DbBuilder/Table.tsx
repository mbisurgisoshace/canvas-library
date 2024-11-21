import { useDraggable } from "@dnd-kit/core";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableProps extends BlockProps {}

export default function Table({ canvasObject }: TableProps) {
  const [newColName, setNewColName] = useState("");
  const [newColType, setNewColType] = useState("");
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);

  const {
    id,
    x,
    y,
    width,
    height,
    children,
    parentId,
    blockType,
    layout,
    colSpan,
    placeholder,
    columns,
    tableName,
  } = canvasObject;

  const { selectElement, selectedElement, changeTableName, addTableColumn } =
    useCanvas();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        top: y,
        left: x,
        height: "auto",
        width: "auto",
        minWidth: 150,
        position: "absolute",
        zIndex: isDragging ? 100 : 999,
        gridColumn: colSpan ? `span ${colSpan}` : "",
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "black"
        }`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        const el = e.target as HTMLElement;
        console.log(el.classList);

        if (
          el.classList.contains("table-menu") ||
          el.classList.contains("modal-close")
        ) {
          return;
        }

        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Dialog open={isChangeModalOpen} onOpenChange={setIsChangeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Table Name</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={tableName}
                onChange={(e) => {
                  changeTableName(e.target.value, id);
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="modal-close"
                onClick={() => {
                  setIsChangeModalOpen(false);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isColumnsModalOpen} onOpenChange={setIsColumnsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Table Columns</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={newColName}
                onChange={(e) => {
                  setNewColName(e.target.value);
                }}
                placeholder="Column Name"
              />

              <Input
                value={newColType}
                onChange={(e) => {
                  setNewColType(e.target.value);
                }}
                placeholder="Column Type"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              disabled={!newColName || !newColType}
              onClick={() => {
                addTableColumn(id, newColName, newColType);
                setNewColName("");
                setNewColType("");
                setIsColumnsModalOpen(false);
              }}
              className="modal-close"
            >
              Add
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="modal-close"
                onClick={() => {
                  setIsColumnsModalOpen(false);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -25,
            zIndex: 1000,
          }}
          className="flex items-center justify-between w-full"
        >
          <span className="italic font-bold">{tableName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SettingsIcon size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Table</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="table-menu"
                onClick={(e) => {
                  setIsChangeModalOpen(true);
                }}
              >
                Change table name
              </DropdownMenuItem>
              <DropdownMenuItem
                className="table-menu"
                onClick={(e) => {
                  setIsColumnsModalOpen(true);
                }}
              >
                <div className="flex items-center justify-between table-menu">
                  <PlusIcon size={16} className="mr-2" />
                  Add column
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {columns?.map((col) => (
          <div className="p-1 flex items-center w-full justify-between gap-3">
            <Label>{col.columnName}</Label>
            <Label className="font-semibold">{col.type}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
