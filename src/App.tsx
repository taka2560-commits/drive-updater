import React, { useState, useMemo, useEffect } from "react";
import { ExternalLink, FolderOpen, Star, Copy } from 'lucide-react';
import type { FileData } from './components/types';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { FileTable } from './components/FileTable';
import { DetailPane } from './components/DetailPane';
import { Settings } from './components/Settings';
import { useLayout } from './hooks/useLayout';

export default function App() {
  const [layout] = useLayout();
  // --- 状態管理 ---
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<keyof FileData>("updated");
  const [sortAsc, setSortAsc] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [copied, setCopied] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, file: FileData } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [recursive, setRecursive] = useState(false);

  // プレビュー画像
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // スター機能
  const [starredPaths, setStarredPaths] = useState<string[]>([]);

  // フォルダ機能
  const [defaultPaths, setDefaultPaths] = useState<{desktop:string, documents:string, downloads:string} | null>(null);
  const [currentDir, setCurrentDir] = useState<string>("");
  const [customDirs, setCustomDirs] = useState<{name:string, path:string}[]>([]);
  
  // モード (files | settings | starred)
  const [appMode, setAppMode] = useState<"files" | "settings" | "starred">("files");

  // 設定項目
  const [excludeTerms, setExcludeTerms] = useState<string>("node_modules,.git,.DS_Store");

  // --- 初期化 ---
  useEffect(() => {
    const savedStars = localStorage.getItem('starredPaths');
    if (savedStars) setStarredPaths(JSON.parse(savedStars));
    const savedExcludes = localStorage.getItem('excludeTerms');
    if (savedExcludes) setExcludeTerms(savedExcludes);
    const savedCustomDirs = localStorage.getItem('customDirs');
    if (savedCustomDirs) setCustomDirs(JSON.parse(savedCustomDirs));

    if ((window as any).electronAPI) {
      (window as any).electronAPI.getDefaultPaths().then((paths: any) => {
        setDefaultPaths(paths);
        setCurrentDir(paths.desktop); // 初期はデスクトップ
      });
    }
  }, []);

  // --- データ取得 ---
  const fetchFiles = async () => {
    if ((window as any).electronAPI && currentDir) {
      const termsArray = excludeTerms.split(',').map(s => s.trim()).filter(s => s);
      const data = await (window as any).electronAPI.scanDirectory(currentDir, recursive, termsArray);
      const parsedData = data.map((d: any) => ({
        ...d,
        created: new Date(d.created),
        updated: new Date(d.updated),
        accessed: new Date(d.accessed)
      }));
      setFiles(parsedData);
      
      if (selectedFile) {
        const updatedSelected = parsedData.find((d: any) => d.id === selectedFile.id);
        if (updatedSelected) setSelectedFile(updatedSelected);
      }
    }
  };

  useEffect(() => {
    if (currentDir && appMode === "files") {
      fetchFiles();
      
      if ((window as any).electronAPI) {
        (window as any).electronAPI.startWatch(currentDir);
        const removeListener = (window as any).electronAPI.onFileChanged(() => {
          fetchFiles();
        });
        return () => {
          removeListener();
        };
      }
    }
  }, [currentDir, recursive, excludeTerms, appMode]);

  useEffect(() => {
    if (selectedFile && selectedFile.type === 'image' && (window as any).electronAPI) {
      (window as any).electronAPI.readImage(selectedFile.path).then((data: any) => {
        setPreviewImage(data);
      });
    } else {
      setPreviewImage(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    localStorage.setItem('starredPaths', JSON.stringify(starredPaths));
  }, [starredPaths]);

  useEffect(() => {
    localStorage.setItem('customDirs', JSON.stringify(customDirs));
  }, [customDirs]);

  useEffect(() => {
    localStorage.setItem('excludeTerms', excludeTerms);
  }, [excludeTerms]);


  // --- ユーティリティ ---
  const toggleStar = (path: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredPaths(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleAddFolder = async () => {
    if ((window as any).electronAPI) {
      const result = await (window as any).electronAPI.selectFolder();
      if (result) {
        if (!customDirs.find(d => d.path === result.path)) {
          setCustomDirs([...customDirs, result]);
        }
        setCurrentDir(result.path);
        setAppMode("files");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- フィルタリング & ソート ---
  const displayData = useMemo(() => {
    let data = [...files];
    if (appMode === "starred") {
      data = data.filter(d => starredPaths.includes(d.path));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(d => d.name.toLowerCase().includes(q));
    }
    if (activeFilters.length > 0) {
      data = data.filter(d => activeFilters.includes(d.type));
    }
    data.sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [files, searchQuery, activeFilters, sortCol, sortAsc, appMode, starredPaths]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleSort = (col: keyof FileData) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(false); }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileData) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  // Dummy activity data for the chart. A real implementation would parse files array and aggregate by day.
  const activityData = useMemo(() => {
    if (files.length === 0) return Array.from({length: 14}).fill(0) as number[];
    const data = Array.from({length: 14}).fill(0) as number[];
    const now = new Date();
    files.forEach(f => {
       const diff = Math.floor((now.getTime() - f.updated.getTime()) / (1000 * 60 * 60 * 24));
       if (diff >= 0 && diff < 14) {
           data[13 - diff]++;
       }
    });
    return data;
  }, [files]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }} onClick={() => setContextMenu(null)}>
      
      <Sidebar 
        collapsed={collapsed} setCollapsed={setCollapsed}
        appMode={appMode} setAppMode={setAppMode}
        currentDir={currentDir} setCurrentDir={setCurrentDir}
        defaultPaths={defaultPaths} customDirs={customDirs} handleAddFolder={handleAddFolder}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
        {appMode === "settings" ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Settings 
              excludeTerms={excludeTerms} setExcludeTerms={setExcludeTerms}
              customDirs={customDirs} setCustomDirs={setCustomDirs}
            />
          </div>
        ) : (
          <>
            <FilterBar 
              layout={layout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} appMode={appMode}
              fetchFiles={fetchFiles} viewMode={viewMode} setViewMode={setViewMode}
              activeFilters={activeFilters} toggleFilter={toggleFilter}
              recursive={recursive} setRecursive={setRecursive} activityData={activityData}
            />
            
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--color-bg)' }}>
                <FileTable 
                  layout={layout} appMode={appMode} displayData={displayData} viewMode={viewMode}
                  sortCol={sortCol} sortAsc={sortAsc} handleSort={handleSort}
                  selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                  handleContextMenu={handleContextMenu} starredPaths={starredPaths} toggleStar={toggleStar}
                  renderDetailPane={() => (
                    <DetailPane 
                      layout={layout} selectedFile={selectedFile} previewImage={previewImage}
                      starredPaths={starredPaths} toggleStar={toggleStar}
                      copyToClipboard={copyToClipboard} copied={copied}
                      onClose={() => setSelectedFile(null)}
                    />
                  )}
                />
              </div>

              {appMode === "files" && layout !== 'B' && (
                <DetailPane 
                  layout={layout} selectedFile={selectedFile} previewImage={previewImage}
                  starredPaths={starredPaths} toggleStar={toggleStar}
                  copyToClipboard={copyToClipboard} copied={copied}
                  onClose={() => setSelectedFile(null)}
                />
              )}
            </div>
          </>
        )}
      </div>

      {contextMenu && (
        <div 
          style={{
            position: 'fixed', top: contextMenu.y, left: contextMenu.x,
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '8px', zIndex: 50, padding: '4px', minWidth: '160px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {contextMenu.file.name}
          </div>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
            onClick={() => { (window as any).electronAPI?.openFile(contextMenu.file.path); setContextMenu(null); }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          ><ExternalLink size={14} /> 開く</button>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
            onClick={() => { (window as any).electronAPI?.openFolder(contextMenu.file.path); setContextMenu(null); }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          ><FolderOpen size={14} /> 保存場所を開く</button>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
            onClick={() => { toggleStar(contextMenu.file.path); setContextMenu(null); }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          ><Star size={14} /> スターを{starredPaths.includes(contextMenu.file.path) ? '外す' : 'つける'}</button>
          <button 
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}
            onClick={() => { copyToClipboard(contextMenu.file.path); setContextMenu(null); }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          ><Copy size={14} /> パスをコピー</button>
        </div>
      )}
    </div>
  );
}
