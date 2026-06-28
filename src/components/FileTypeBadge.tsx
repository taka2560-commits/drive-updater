import {
  FileText,
  FileSpreadsheet,
  MonitorPlay,
  Image as ImageIcon,
  File as FileIcon,
  Ruler,
  type LucideIcon,
} from 'lucide-react';

interface KindDef {
  color: string;
  Icon: LucideIcon;
  label: string;
}

const KINDS: Record<string, KindDef> = {
  cad:    { color: '#7BA9CE', Icon: Ruler,           label: 'CAD' },
  image:  { color: '#6FB68C', Icon: ImageIcon,       label: 'IMG' },
  slides: { color: '#E8A05A', Icon: MonitorPlay,     label: 'PPT' },
  doc:    { color: '#92BAD9', Icon: FileText,         label: 'DOC' },
  sheet:  { color: '#6FB68C', Icon: FileSpreadsheet,  label: 'XLS' },
  pdf:    { color: '#D87060', Icon: FileText,         label: 'PDF' },
  other:  { color: '#9AA4B0', Icon: FileIcon,         label: '—' },
};

const EXT_MAP: Record<string, string> = {
  dwg: 'cad', dxf: 'cad', step: 'cad', stp: 'cad', iges: 'cad', igs: 'cad',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', bmp: 'image',
  tif: 'image', tiff: 'image', webp: 'image', svg: 'image', heic: 'image',
  ppt: 'slides', pptx: 'slides', key: 'slides',
  doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc', rtf: 'doc',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet', numbers: 'sheet',
  pdf: 'pdf',
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
  const kind = EXT_MAP[ext?.toLowerCase()] ?? 'other';
  const k = KINDS[kind];
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
