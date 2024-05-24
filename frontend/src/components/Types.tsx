import { GridRowsProp } from "@mui/x-data-grid";

export type ToolbarButtonProps = {
  name: string;
  rows?: GridRowsProp[];
  totalRows?: number;
}