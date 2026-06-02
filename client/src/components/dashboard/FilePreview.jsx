import { useState, useEffect } from 'react';
import { Smartphone, ArrowUpRight } from 'lucide-react';

/**
 * Dynamic file preview helper component (handles ObjectURL memory leak safety)
 */
export default function FilePreview({ doc }) {
  const [localUrl, setLocalUrl] = useState(null);

  useEffect(() => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      setLocalUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setLocalUrl(null);
    }
  }, [doc.file]);

  const url = localUrl || doc.url;
  
  const isImage = () => {
    if (doc.file) return doc.file.type.startsWith('image/');
    const name = doc.filename || '';
    const u = doc.url || '';
    return /\.(jpeg|jpg|gif|png|webp|svg)/i.test(name) || /\.(jpeg|jpg|gif|png|webp|svg)/i.test(u);
  };

  const isPdf = () => {
    if (doc.file) return doc.file.type === 'application/pdf';
    const name = doc.filename || '';
    const u = doc.url || '';
    return name.toLowerCase().endsWith('.pdf') || u.toLowerCase().endsWith('.pdf');
  };

  if (!url) {
    return (
      <div className="w-16 h-16 rounded-xl bg-slate-200/60 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0">
        <Smartphone className="w-6 h-6 opacity-30 animate-pulse" />
      </div>
    );
  }

  if (isImage()) {
    return (
      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 relative group/thumb cursor-pointer">
        <img 
          src={url} 
          alt={doc.filename} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110" 
        />
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ArrowUpRight className="w-4 h-4 text-white" />
        </a>
      </div>
    );
  }

  if (isPdf()) {
    const thumbnailUrl = (doc.url && doc.url.includes('cloudinary.com')) ? doc.url.replace(/\.pdf$/i, '.jpg') : null;

    return (
      <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 relative group/thumb cursor-pointer">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={doc.filename} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110 relative z-0" 
            onError={(e) => {
              e.target.style.display = 'none';
              const iframeWrapper = e.target.parentElement.querySelector('.pdf-iframe-wrapper');
              if (iframeWrapper) iframeWrapper.style.display = 'block';
            }}
          />
        ) : null}
        
        <div className={`pdf-iframe-wrapper ${thumbnailUrl ? 'hidden' : 'block'} absolute inset-0 pointer-events-none overflow-hidden bg-white z-0`}>
          <iframe 
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
            className="w-full h-[150%] border-0 transform origin-top" 
            title="PDF Preview"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent flex-col items-center justify-end pb-1.5 hidden group-hover/thumb:flex z-10 pointer-events-none">
          <span className="text-[10px] font-black tracking-wider uppercase text-rose-400">PDF</span>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-20"
        >
          <ArrowUpRight className="w-4 h-4 text-white" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 relative group/thumb cursor-pointer">
      <span className="text-[9px] font-bold tracking-wider uppercase mb-1 text-slate-500">FILE</span>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
      >
        <ArrowUpRight className="w-4 h-4 text-white" />
      </a>
    </div>
  );
}
