'use client';

import { useCallback, useEffect, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './Sample.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { usePDFJS } from '../utils/hooks/usePdfJs';
import Script from 'next/script';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const maxWidth = 800;

type PDFFile = string | File | null;

export default function Sample() {
  const [file, setFile] = useState<PDFFile>('./cv.pdf');
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  // usePDFJS(async (pdfjs) => {
  //   pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  //     'pdfjs-dist/build/pdf.worker.min.mjs',
  //     import.meta.url,
  //   ).toString();
  // });

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    console.log("next num pagesss", nextNumPages)
    setNumPages(nextNumPages);
  }

  console.log("pdfjs globale woerke", pdfjs.GlobalWorkerOptions.workerSrc)

  return (
    <div style={{
      display: "grid",
      placeItems: "center",
    }}>
      <div style={{
        margin: "5rem auto"
      }}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
            {Array.from(new Array(numPages), (_el, index) => (
              <div style={{
                width: "fit-content",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}>
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
