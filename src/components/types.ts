import { FileText, Table, MonitorPlay, File as FileIcon, Image as ImageIcon } from 'lucide-react';

export interface FileData {
  id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  created: Date;
  updated: Date;
  accessed: Date;
}

export const TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  document: { label: "Docs", color: "var(--color-text)", icon: FileText },
  spreadsheet: { label: "Sheets", color: "var(--color-primary)", icon: Table },
  presentation: { label: "Slides", color: "var(--color-accent)", icon: MonitorPlay },
  pdf: { label: "PDF", color: "#F5A0A0", icon: FileText },
  image: { label: "Image", color: "var(--color-text)", icon: ImageIcon },
  other: { label: "Other", color: "var(--color-muted)", icon: FileIcon },
};
