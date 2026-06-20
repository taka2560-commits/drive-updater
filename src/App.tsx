import React, { useState, useMemo, useEffect } from "react";
import { 
  FileText, Table, MonitorPlay, File as FileIcon, Image as ImageIcon,
  FolderOpen, Settings, Star, Search, Clock, Plus, ChevronLeft, ChevronRight, 
  Download, RefreshCw, Copy, ExternalLink, Monitor
} from 'lucide-react';

// --- 型定義 ---
interface FileData {
  id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  created: Date;
  updated: Date;
  accessed: Date;
}

// ファイル種別ごとのスタイル設定
const TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  document: { label: "Docs", color: "bg-slate-100 text-slate-700", icon: FileText },
  spreadsheet: { label: "Sheets", color: "bg-emerald-100 text-emerald-700", icon: Table },
  presentation: { label: "Slides", color: "bg-amber-100 text-amber-700", icon: MonitorPlay },
  pdf: { label: "PDF", color: "bg-rose-100 text-rose-700", icon: FileText },
  image: { label: "Image", color: "bg-blue-100 text-blue-700", icon: ImageIcon },
  other: { label: "Other", color: "bg-gray-100 text-gray-700", icon: FileIcon },
};

export default function App() {
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
    // ローカルストレージから復元
    const savedStars = localStorage.getItem('starredPaths');
    if (savedStars) setStarredPaths(JSON.parse(savedStars));
    const savedExcludes = localStorage.getItem('excludeTerms');
    if (savedExcludes) setExcludeTerms(savedExcludes);
    const savedCustomDirs = localStorage.getItem('customDirs');
    if (savedCustomDirs) setCustomDirs(JSON.parse(savedCustomDirs));

    // デフォルトパス取得
    if (window.electronAPI) {
      window.electronAPI.getDefaultPaths().then(paths => {
        setDefaultPaths(paths);
        setCurrentDir(paths.desktop); // 初期はデスクトップ
      });
    }
  }, []);

  // --- データ取得 ---
  const fetchFiles = async () => {
    if (window.electronAPI && currentDir) {
      const termsArray = excludeTerms.split(',').map(s => s.trim()).filter(s => s);
      const data = await window.electronAPI.scanDirectory(currentDir, recursive, termsArray);
      const parsedData = data.map(d => ({
        ...d,
        created: new Date(d.created),
        updated: new Date(d.updated),
        accessed: new Date(d.accessed)
      }));
      setFiles(parsedData);
      
      // 選択中ファイルの更新
      if (selectedFile) {
        const updatedSelected = parsedData.find(d => d.id === selectedFile.id);
        if (updatedSelected) setSelectedFile(updatedSelected);
      }
    }
  };

  useEffect(() => {
    if (currentDir && appMode === "files") {
      fetchFiles();
      
      if (window.electronAPI) {
        window.electronAPI.startWatch(currentDir);
        const removeListener = window.electronAPI.onFileChanged((_event, _data) => {
          fetchFiles();
        });
        return () => {
          removeListener();
        };
      }
    }
  }, [currentDir, recursive, excludeTerms, appMode]);

  // プレビュー読み込み
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'image' && window.electronAPI) {
      window.electronAPI.readImage(selectedFile.path).then(data => {
        setPreviewImage(data);
      });
    } else {
      setPreviewImage(null);
    }
  }, [selectedFile]);

  // スター保存
  useEffect(() => {
    localStorage.setItem('starredPaths', JSON.stringify(starredPaths));
  }, [starredPaths]);

  // カスタムディレクトリ保存
  useEffect(() => {
    localStorage.setItem('customDirs', JSON.stringify(customDirs));
  }, [customDirs]);

  // 除外設定保存
  useEffect(() => {
    localStorage.setItem('excludeTerms', excludeTerms);
  }, [excludeTerms]);


  // --- ユーティリティ ---
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const toggleStar = (path: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredPaths(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleAddFolder = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.selectFolder();
      if (result) {
        // 重複チェック
        if (!customDirs.find(d => d.path === result.path)) {
          setCustomDirs([...customDirs, result]);
        }
        setCurrentDir(result.path);
        setAppMode("files");
      }
    }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileData) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  // --- コンポーネント群 ---
  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-sm text-[#1F1F1F]" onClick={() => setContextMenu(null)}>
      
      {/* 1. サイドバー */}
      <div className={`${collapsed ? "w-16" : "w-64"} bg-[#1F1F1F] text-[#C3C6D5] transition-all duration-300 flex flex-col flex-shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-[#333]">
          {!collapsed && <span className="font-bold text-white flex items-center gap-2"><FolderOpen size={18}/> LocalUpdater</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-[#C3C6D5] hover:text-white">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1 mt-2">
            {!collapsed && <div className="text-xs font-bold text-gray-500 px-2 py-1">標準フォルダ</div>}
            
            <div 
              onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.desktop); }}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "files" && currentDir === defaultPaths?.desktop ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
            >
              <Monitor size={18}/>
              {!collapsed && <span>デスクトップ</span>}
            </div>

            <div 
              onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.documents); }}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "files" && currentDir === defaultPaths?.documents ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
            >
              <FileText size={18}/>
              {!collapsed && <span>ドキュメント</span>}
            </div>

            <div 
              onClick={() => { setAppMode("files"); if(defaultPaths) setCurrentDir(defaultPaths.downloads); }}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "files" && currentDir === defaultPaths?.downloads ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
            >
              <Download size={18}/>
              {!collapsed && <span>ダウンロード</span>}
            </div>

            {!collapsed && <div className="text-xs font-bold text-gray-500 px-2 pt-4 pb-1">追加フォルダ</div>}
            {customDirs.map((dir, i) => (
              <div 
                key={i} 
                onClick={() => { setAppMode("files"); setCurrentDir(dir.path); }}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "files" && currentDir === dir.path ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
              >
                <FolderOpen size={18}/>
                {!collapsed && <span className="truncate">{dir.name}</span>}
              </div>
            ))}
            
            <div 
              onClick={handleAddFolder}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white/10 text-gray-400`}
            >
              <Plus size={18}/>
              {!collapsed && <span>フォルダを追加...</span>}
            </div>

            {!collapsed && <div className="text-xs font-bold text-gray-500 px-2 pt-4 pb-1">その他</div>}
            <div 
              onClick={() => setAppMode("starred")}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "starred" ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
            >
              <Star size={18} className={appMode === "starred" ? "fill-white" : ""}/>
              {!collapsed && <span>スター付き (★)</span>}
            </div>

          </div>
        </div>

        <div className="p-2 border-t border-[#333]">
           <div 
              onClick={() => setAppMode("settings")}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${appMode === "settings" ? "bg-[#6D7654] text-white" : "hover:bg-white/10"}`}
            >
              <Settings size={18}/>
              {!collapsed && <span>設定</span>}
            </div>
        </div>
      </div>

      {/* 2. メインレイアウト */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white border-l border-[#C3C6D5]">
        
        {appMode === "settings" ? (
          /* 設定画面 */
          <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings size={24}/> 設定</h1>
            
            <div className="space-y-6">
              <div className="p-4 border border-[#C3C6D5] rounded-xl bg-[#FAFAFA]">
                <h2 className="font-bold mb-2">スキャン除外キーワード</h2>
                <p className="text-xs text-gray-500 mb-3">
                  ファイル名またはパスに以下のキーワードが含まれる場合、スキャン対象から除外します。複数ある場合はカンマ（,）で区切ってください。
                </p>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-[#C3C6D5] rounded focus:outline-none focus:ring-2 focus:ring-[#6D7654]"
                  value={excludeTerms}
                  onChange={(e) => setExcludeTerms(e.target.value)}
                />
              </div>

              <div className="p-4 border border-[#C3C6D5] rounded-xl bg-[#FAFAFA]">
                <h2 className="font-bold mb-2">追加フォルダの管理</h2>
                {customDirs.length === 0 ? (
                  <p className="text-sm text-gray-500">追加されたフォルダはありません。</p>
                ) : (
                  <ul className="space-y-2">
                    {customDirs.map((dir, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-white p-2 border border-[#C3C6D5] rounded">
                        <span className="text-sm truncate mr-4" title={dir.path}>{dir.name} <span className="text-xs text-gray-400">({dir.path})</span></span>
                        <button 
                          onClick={() => setCustomDirs(customDirs.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2"
                        >削除</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ファイル一覧画面 */
          <>
            {/* 上部ヘッダー */}
            <div className="bg-[#FAFAFA] border-b border-[#C3C6D5] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative max-w-md w-full text-gray-500">
                    <Search size={18} className="absolute left-3 top-2.5" />
                    <input 
                      type="text" placeholder="ファイル名を検索..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#C3C6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D7654] focus:border-transparent text-[#1F1F1F]"
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {appMode === "files" && (
                    <button onClick={fetchFiles} className="px-3 py-2 bg-white border border-[#C3C6D5] text-[#1F1F1F] rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                      <RefreshCw size={16} /> 再スキャン
                    </button>
                  )}
                </div>

                {/* 表示モード切替トグル */}
                <div className="flex bg-[#E8E8E8] rounded-lg p-1 border border-[#C3C6D5]/50">
                  <button 
                    onClick={() => setViewMode("list")} 
                    className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]'}`}
                  >
                    ≡ リスト
                  </button>
                  <button 
                    onClick={() => setViewMode("grid")} 
                    className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]'}`}
                  >
                    ▦ グリッド
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <button 
                        key={type} onClick={() => toggleFilter(type)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeFilters.includes(type) ? "bg-[#94A987]/20 border-[#6D7654] text-[#6D7654]" : "bg-white border-[#C3C6D5] text-[#1F1F1F] hover:bg-[#FAFAFA]"}`}
                      >
                        <IconComponent size={14} /> {config.label}
                      </button>
                    )
                  })}
                </div>
                {appMode === "files" && (
                  <label className="flex items-center gap-2 cursor-pointer text-xs bg-white border border-[#C3C6D5] px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked={recursive} 
                      onChange={(e) => setRecursive(e.target.checked)} 
                      className="accent-[#6D7654]"
                    />
                    サブフォルダもスキャン
                  </label>
                )}
              </div>
            </div>

            {/* 下部ペイン */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* 左ペイン: リスト or グリッド */}
              <div className="flex-1 overflow-y-auto bg-white border-r border-[#C3C6D5]">
                
                {appMode === "starred" && displayData.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center h-full">
                     <Star size={48} className="mb-4 text-[#C3C6D5]"/>
                     <p className="text-lg font-bold text-[#1F1F1F] mb-2">スター付きのファイルはありません</p>
                     <p>よく使うファイルをリストから見つけ、★マークをクリックして追加してください。</p>
                   </div>
                ) : viewMode === "list" ? (
                  // --- リスト表示 ---
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAFAFA] sticky top-0 z-10 border-b border-[#C3C6D5]">
                      <tr>
                        <th className="p-3 w-10"></th>
                        <th onClick={() => handleSort("name")} className="p-3 font-semibold text-[#1F1F1F] cursor-pointer hover:bg-gray-100 select-none">
                          ファイル名 {sortCol === "name" ? (sortAsc ? "▲" : "▼") : "⇅"}
                        </th>
                        <th className="p-3 font-semibold text-[#1F1F1F]">種類</th>
                        <th onClick={() => handleSort("size")} className="p-3 font-semibold text-[#1F1F1F] cursor-pointer hover:bg-gray-100 select-none">
                          サイズ {sortCol === "size" ? (sortAsc ? "▲" : "▼") : "⇅"}
                        </th>
                        <th onClick={() => handleSort("updated")} className="p-3 font-semibold text-[#1F1F1F] cursor-pointer hover:bg-gray-100 select-none">
                          最終更新日時 {sortCol === "updated" ? (sortAsc ? "▲" : "▼") : "⇅"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.map(file => {
                         const IconComp = TYPE_CONFIG[file.type]?.icon || TYPE_CONFIG.other.icon;
                         const isStarred = starredPaths.includes(file.path);
                         return (
                          <tr 
                            key={file.id} 
                            onClick={() => setSelectedFile(file)}
                            onContextMenu={(e) => handleContextMenu(e, file)}
                            onDoubleClick={() => window.electronAPI?.openFile(file.path)}
                            className={`border-b border-[#C3C6D5]/30 cursor-pointer transition-colors ${selectedFile?.id === file.id ? "bg-[#94A987]/20" : "hover:bg-[#FAFAFA]"}`}
                          >
                            <td className="p-3 text-center">
                              <Star 
                                size={16} 
                                className={`cursor-pointer ${isStarred ? "fill-[#eab308] text-[#eab308]" : "text-gray-300 hover:text-gray-500"}`} 
                                onClick={(e) => toggleStar(file.path, e)}
                              />
                            </td>
                            <td className="p-3 font-medium text-[#1F1F1F] truncate max-w-[200px]" title={file.name}>
                              <div className="flex items-center gap-2">
                                <IconComp size={16} className="text-gray-500 flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${TYPE_CONFIG[file.type]?.color || TYPE_CONFIG.other.color}`}>
                                {TYPE_CONFIG[file.type]?.label || TYPE_CONFIG.other.label}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500 text-xs">{formatBytes(file.size)}</td>
                            <td className="p-3 text-gray-500 text-xs">{formatDate(file.updated)}</td>
                          </tr>
                        )
                      })}
                      {displayData.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">条件に一致するファイルがありません</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  // --- グリッド表示 ---
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 bg-[#FAFAFA] min-h-full">
                    {displayData.map(file => {
                      const IconComp = TYPE_CONFIG[file.type]?.icon || TYPE_CONFIG.other.icon;
                      const isStarred = starredPaths.includes(file.path);
                      return (
                        <div
                          key={file.id}
                          onClick={() => setSelectedFile(file)}
                          onContextMenu={(e) => handleContextMenu(e, file)}
                          onDoubleClick={() => window.electronAPI?.openFile(file.path)}
                          className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col relative ${
                            selectedFile?.id === file.id 
                              ? "bg-[#94A987]/10 border-[#6D7654] ring-1 ring-[#6D7654]" 
                              : "bg-white border-[#C3C6D5] hover:border-[#94A987] shadow-sm hover:shadow"
                          }`}
                        >
                          <Star 
                            size={16} 
                            className={`absolute top-4 right-4 cursor-pointer ${isStarred ? "fill-[#eab308] text-[#eab308]" : "text-gray-200 hover:text-gray-400"}`} 
                            onClick={(e) => toggleStar(file.path, e)}
                          />
                          <div className="flex justify-between items-start mb-3">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${TYPE_CONFIG[file.type]?.color || TYPE_CONFIG.other.color}`}>
                              <IconComp size={12} /> {TYPE_CONFIG[file.type]?.label || TYPE_CONFIG.other.label}
                            </span>
                          </div>
                          <div className="font-bold text-[#1F1F1F] text-sm mb-1 line-clamp-2 leading-tight" title={file.name}>{file.name}</div>
                          
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#C3C6D5]/30">
                            <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
                            <span className="text-[10px] text-gray-400">{formatDate(file.updated).split(' ')[0]}</span>
                          </div>
                        </div>
                      )
                    })}
                    {displayData.length === 0 && (
                      <div className="col-span-full p-8 text-center text-gray-500">条件に一致するファイルがありません</div>
                    )}
                  </div>
                )}
              </div>

              {/* 右ペイン: 詳細サイドパネル */}
              <div className="w-80 bg-[#FAFAFA] flex flex-col flex-shrink-0">
                {selectedFile ? (
                  <div className="p-5 overflow-y-auto">
                    
                    {/* 画像プレビュー */}
                    {previewImage ? (
                      <div className="w-full aspect-video bg-[#E8E8E8] rounded-lg mb-4 overflow-hidden border border-[#C3C6D5] flex items-center justify-center">
                        <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-[#E8E8E8] rounded-lg mb-4 border border-[#C3C6D5] flex items-center justify-center text-gray-400">
                        {React.createElement(TYPE_CONFIG[selectedFile.type]?.icon || TYPE_CONFIG.other.icon, { size: 48 })}
                      </div>
                    )}

                    <div className="flex items-start gap-2 mb-5">
                      <div className="overflow-hidden">
                        <h2 className="text-base font-bold text-[#1F1F1F] leading-tight break-all">{selectedFile.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">{formatBytes(selectedFile.size)}</p>
                      </div>
                      <Star 
                        size={20} 
                        className={`flex-shrink-0 cursor-pointer ${starredPaths.includes(selectedFile.path) ? "fill-[#eab308] text-[#eab308]" : "text-gray-300 hover:text-gray-500"}`} 
                        onClick={() => toggleStar(selectedFile.path)}
                      />
                    </div>

                    {/* アクションボタン */}
                    <div className="flex flex-col gap-2 mb-6">
                      <button onClick={() => window.electronAPI?.openFile(selectedFile.path)} className="w-full bg-[#6D7654] text-white py-2 rounded-lg font-semibold hover:bg-[#6D7654]/90 transition flex items-center justify-center gap-2">
                        <ExternalLink size={16} /> ファイルを開く
                      </button>
                      <button onClick={() => window.electronAPI?.openFolder(selectedFile.path)} className="w-full border border-[#C3C6D5] text-[#1F1F1F] py-2 rounded-lg font-semibold bg-white hover:bg-[#f0f0f0] transition flex items-center justify-center gap-2">
                        <FolderOpen size={16} /> 保存場所を開く
                      </button>
                    </div>

                    {/* クリップボードコピー */}
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-500 mb-2">ローカルファイルパス</div>
                      <div className="flex flex-col gap-2 bg-white border border-[#C3C6D5] rounded-lg p-2 shadow-sm">
                        <code className="text-[10px] text-gray-500 break-all">{selectedFile.path}</code>
                        <button 
                          onClick={() => copyToClipboard(selectedFile.path)}
                          className={`w-full py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2 ${copied ? "bg-[#94A987] text-white" : "bg-[#FAFAFA] text-[#1F1F1F] border border-[#C3C6D5] hover:bg-[#E8E8E8]"}`}
                        >
                          {copied ? "✓ コピー済" : <><Copy size={14}/> パスをコピー</>}
                        </button>
                      </div>
                    </div>

                    {/* タイムライン（シンプル版） */}
                    <div>
                      <div className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-1"><Clock size={14}/> ファイル情報</div>
                      <div className="pl-2 border-l-2 border-[#C3C6D5] ml-2 space-y-4">
                        <div className="relative">
                          <div className="absolute -left-[13px] top-1 w-3 h-3 bg-[#6D7654] rounded-full border-2 border-[#FAFAFA]"></div>
                          <div className="pl-4">
                            <div className="text-xs font-bold text-[#1F1F1F]">最終更新日時</div>
                            <div className="text-xs text-gray-600 mt-1">{formatDate(selectedFile.updated)}</div>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[13px] top-1 w-3 h-3 bg-[#94A987] rounded-full border-2 border-[#FAFAFA]"></div>
                          <div className="pl-4">
                            <div className="text-xs font-bold text-[#1F1F1F]">最終アクセス日時</div>
                            <div className="text-xs text-gray-600 mt-1">{formatDate(selectedFile.accessed)}</div>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[13px] top-1 w-3 h-3 bg-[#C3C6D5] rounded-full border-2 border-[#FAFAFA]"></div>
                          <div className="pl-4">
                            <div className="text-xs font-bold text-[#1F1F1F]">作成日時</div>
                            <div className="text-xs text-gray-600 mt-1">{formatDate(selectedFile.created)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                    <FileIcon size={48} className="mb-3 text-[#C3C6D5] opacity-50" />
                    <p>リストからファイルを選択すると、詳細が表示されます。</p>
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>

      {/* コンテキストメニュー（右クリック） */}
      {contextMenu && (
        <div 
          className="fixed bg-white border border-[#C3C6D5] shadow-lg rounded-lg py-1 w-48 z-50 text-[#1F1F1F]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-bold text-gray-500 border-b border-[#E8E8E8] mb-1 truncate">
            {contextMenu.file.name}
          </div>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAFAFA] flex items-center gap-2"
            onClick={() => { window.electronAPI?.openFile(contextMenu.file.path); setContextMenu(null); }}
          ><ExternalLink size={14} /> 開く</button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAFAFA] flex items-center gap-2"
            onClick={() => { window.electronAPI?.openFolder(contextMenu.file.path); setContextMenu(null); }}
          ><FolderOpen size={14} /> 保存場所を開く</button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAFAFA] flex items-center gap-2"
            onClick={() => { toggleStar(contextMenu.file.path); setContextMenu(null); }}
          ><Star size={14} /> スターを{starredPaths.includes(contextMenu.file.path) ? '外す' : 'つける'}</button>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-[#FAFAFA] flex items-center gap-2"
            onClick={() => { copyToClipboard(contextMenu.file.path); setContextMenu(null); }}
          ><Copy size={14} /> パスをコピー</button>
        </div>
      )}
    </div>
  );
}
