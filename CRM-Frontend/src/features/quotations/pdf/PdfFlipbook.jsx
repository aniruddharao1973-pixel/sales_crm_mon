import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut,
  Loader2,
  Download
} from "lucide-react";
import "./PdfFlipbook.css";

// Set worker URL for pdfjs - forcing exact version to match the library
// Use unpkg with a cache buster to ensure the browser doesn't use the old 5.7.284 worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs?v=${pdfjs.version}`;

console.log("Current PDF.js API Version:", pdfjs.version);

const PageContent = React.forwardRef(({ pageNumber, width, height }, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <Page 
          pageNumber={pageNumber} 
          width={width}
          height={height}
          scale={2} 
          renderAnnotationLayer={false}
          renderTextLayer={false}
          loading={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}
        />
      </div>
    </div>
  );
});

const CoverPage = React.forwardRef(({ title, subtitle, isBack }, ref) => {
  return (
    <div className={`page page-cover ${isBack ? 'page-cover-right' : ''}`} ref={ref} data-density="hard">
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <div className="mb-6 h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center">
           <div className="h-12 w-12 border-4 border-white/20 rounded-full border-t-white animate-[spin_3s_linear_infinite]" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">{title}</h1>
        <p className="text-indigo-200 font-medium tracking-widest text-xs uppercase opacity-80">{subtitle}</p>
        <div className="mt-auto pt-10 border-t border-white/10 w-full">
           <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
             {isBack ? "Thank You" : "Micrologic Systems"}
           </p>
        </div>
      </div>
    </div>
  );
});

export default function PdfFlipbook({ pdfBlob, onClose, title = "Commercial Proposal" }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const flipBookRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Calculate larger fit for double page spread
      let w = Math.min(vw * 0.45, 650);
      let h = w * 1.414; // A4 Ratio

      // If screen is too short, scale down based on height
      if (vh < h + 150) {
        h = vh - 200;
        w = h / 1.414;
      }

      // Mobile portrait mode (single page)
      if (vw < 768) {
        w = vw * 0.85;
        h = w * 1.414;
      }

      setDimensions({ width: Math.floor(w), height: Math.floor(h) });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPath = () => flipBookRef.current.pageFlip().flipNext();
  const prevPath = () => flipBookRef.current.pageFlip().flipPrev();

  const onPage = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flipbook-overlay">
      <button className="flipbook-close" onClick={onClose}>
        <X className="h-6 w-6" />
      </button>

      <div className="flipbook-container" style={{ transform: `scale(${zoom})` }}>
        <Document 
          file={pdfBlob} 
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            console.error("PDF Load Error Details:", err);
            if (err.message?.includes("version") || err.name === "UnknownErrorException") {
              toast.error("Viewer update detected. Please hard-refresh your browser (Ctrl + F5)", { duration: 6000 });
            } else {
              toast.error("Failed to load PDF presentation");
            }
          }}
          loading={
            <div className="flipbook-loading">
              <div className="loading-spinner" />
              <p className="text-white font-bold tracking-widest text-xs uppercase animate-pulse">
                Preparing Presentation...
              </p>
            </div>
          }
        >
          {numPages && (
            <div className="flipbook-wrapper">
              <HTMLFlipBook
                width={dimensions.width}
                height={dimensions.height}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onPage}
                className={`stf-flipbook ${currentPage === 0 || (numPages !== null && currentPage === numPages + 1) ? 'is-cover' : ''}`}
                ref={flipBookRef}
                usePortrait={false}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                clickEventForward={true}
              >
                {/* Front Cover */}
                <CoverPage 
                  title={title} 
                  subtitle="Innovative Automation Solutions" 
                />

                {/* PDF Pages */}
                {Array.from(new Array(numPages), (el, index) => (
                  <PageContent 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                ))}

                {/* Back Cover */}
                <CoverPage 
                  title="Confidential" 
                  subtitle="© 2026 Micrologic" 
                  isBack={true}
                />
              </HTMLFlipBook>
            </div>
          )}
        </Document>
      </div>

      <div className="flipbook-controls">
        <button className="control-btn" onClick={prevPath} title="Previous Page">
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="page-number">
          {currentPage === 0 
            ? "Cover" 
            : currentPage >= (numPages + 1) 
              ? "End" 
              : `Pages ${currentPage} - ${currentPage + 1}`}
          {" "} / {numPages ? numPages + 2 : "?"}
        </div>

        <button className="control-btn" onClick={nextPath} title="Next Page">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-1" />

        <button className="control-btn" onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} title="Zoom In">
          <ZoomIn className="h-5 w-5" />
        </button>

        <button className="control-btn" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} title="Zoom Out">
          <ZoomOut className="h-5 w-5" />
        </button>

        <button className="control-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
