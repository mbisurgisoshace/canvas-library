import { CircleX, CircleCheck } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeaturesTableProps {
  features: { name: string; isWorking: boolean }[];
}

export const FeaturesTable = ({ features }: FeaturesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Feature Description</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => (
          <TableRow key={feature.name}>
            <TableCell className="font-medium">{feature.name}</TableCell>
            <TableCell>
              {feature.isWorking ? (
                <CircleCheck size={24} className="text-green-500" />
              ) : (
                <CircleX size={24} className="text-red-500" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
