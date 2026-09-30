import {
  FileText,
  FileSpreadsheet,
  MonitorPlay,
  Image as ImageIcon,
  File as FileIcon,
  Ruler,
  type LucideIcon,
} from 'lucide-react';
import { kindOf } from '../lib/fileType';
import type { FileTypeFilter } from '../types';

interface KindDef {
  color: string;
  Icon: LucideIcon;
  label: string;
}

const KINDS: Record<Exclude<FileTypeFilter, 'all'>, KindDef> = {
  cad:    { color: '#7BA9CE', Icon: Ruler,           label: 'CAD' },
  image:  { color: '#6FB68C', Icon: ImageIcon,       label: 'IMG' },
  slides: { color: '#E8A05A', Icon: MonitorPlay,     label: 'PPT' },
  docs:   { color: '#92BAD9', Icon: FileText,         label: 'DOC' },
  sheets: { color: '#6FB68C', Icon: FileSpreadsheet,  label: 'XLS' },
  pdf:    { color: '#D87060', Icon: FileText,         label: 'PDF' },
  other:  { color: '#9AA4B0', Icon: FileIcon,         label: '—' },
};

export function FileTypeBadge({
  ext,
  size = 32,
  showLabel = true,
}: {
  ext: string;
  size?: number;
  showLabel?: boolean;
}) {
  const k = KINDS[kindOf(ext ?? '')];
  const label = ext ? ext.toUpperCase().slice(0, 4) : k.label;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-md)',
        background: `${k.color}22`,
        border: `1px solid ${k.color}55`,
        color: k.color,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        flexShrink: 0,
      }}
    >
      <k.Icon size={Math.round(size * 0.45)} />
      {showLabel && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: Math.max(8, Math.round(size * 0.22)),
            fontWeight: 600,
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
