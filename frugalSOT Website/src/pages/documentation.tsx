import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  ChevronRight, 
  Mail, 
  Github,
  ChevronLeft,
  FileText,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Link} from "react-router-dom";

export default function DocumentationPage() {
  // Updated to use local PDF file
  const [pdfLink] = useState("/FrugalSOT.pdf");
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const handleRefresh = () => {
    setPdfLoaded(false);
    setPdfError(false);
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handlePdfLoad = () => {
    setPdfLoaded(true);
    setPdfError(false);
  };

  const handlePdfError = () => {
    setPdfError(true);
    setPdfLoaded(false);
  };

  // Reset states when viewer opens
  useEffect(() => {
    if (showPdfViewer) {
      setPdfLoaded(false);
      setPdfError(false);
    }
  }, [showPdfViewer]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <img 
                src="/frugalsot_logo.png" 
                alt="FrugalSOT Logo" 
                className="h-8 w-8"
              />
              <div className="text-xl font-bold text-yellow-400">
                Frugal<span className="text-white">SOT</span>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 text-sm bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors"
                >
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <br />
      <br /><br />

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {!showPdfViewer ? (
            // Original landing content
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-yellow-400">Read</span> our research findings
                </h2>


                <p className="text-lg text-gray-300 mb-8">
                  This is our documentation. Please download and suggest solutions.<br />
                  The CLI tool is now available for Ubuntu machines, with Windows and Mac versions coming soon —{" "}
                  <a
                    href="https://github.com/HyperKuvid-Labs/FrugalSOT-CLI"
                    className="text-s font-medium mb-4 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    FrugalSOT-CLI
                  </a>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <Card className="bg-zinc-900 border-yellow-500/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-xl font-medium mb-2 text-yellow-400">
                          FrugalSOT: Frugal Search Over The Models
                        </h3>
                        <p className="text-gray-400 mb-2">
                          Submitted for review - acceptance expected soon
                        </p>
                        <p className="text-sm text-gray-500">
                          Resource-aware model selection architecture for on-device NLP inference
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => setShowPdfViewer(true)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View PDF
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          <a href={pdfLink} download="FrugalSOT-Research-Paper.pdf">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-medium mb-4 text-yellow-400">
                  How to contribute
                </h3>

                <div className="mt-8">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="outline"
                      className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => window.open('https://github.com/HyperKuvid-Labs/FrugalSOT/discussions', '_blank')}
                    >
                      Join Discussion
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <a
                      href="https://github.com/HyperKuvid-Labs/FrugalSOT"
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                      title="Contribute on GitHub"
                    >
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                    <a
                      href="mailto:hyperkuvidlabs@gmail.com?subject=FrugalSOT%20Feedback&body=Hello%20FrugalSOT%20Team,%0A%0AI%20would%20like%20to%20provide%20feedback%20about..."
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                      title="Send feedback via email"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Gmail</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            // PDF Viewer
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Viewer Header */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setShowPdfViewer(false)}
                  variant="ghost"
                  className="text-yellow-400 hover:bg-yellow-500/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Documentation
                </Button>
                
                <div className="text-sm text-gray-400">
                  FrugalSOT: Frugal Search Over The Models
                </div>
              </div>

              {/* PDF Controls */}
              <Card className="bg-zinc-900 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* <div className="flex items-center gap-4">
                      {/* <Button
                        onClick={handleZoomOut}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-sm text-gray-300 min-w-[60px] text-center">
                        {zoom}%
                      </div>
                      
                      <Button
                        onClick={handleZoomIn}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      
                      <Separator orientation="vertical" className="h-6 bg-yellow-500/20" />
                      
                      <Button
                        onClick={handleRotate}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={handleRefresh}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={handleFullscreen}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button> */}
                    {/* </div> */} 
                    <div className="flex items-center gap-4">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </a>
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* <div className="text-sm text-gray-400">
                        Research Paper • 12 pages
                      </div> */}
                      
                      {/* <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </a>
                      </Button> */}
                      
                      <Button
                        asChild
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        <a href={pdfLink} download="FrugalSOT-Research-Paper.pdf">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Viewer Container */}
              <Card className="bg-zinc-900 border-yellow-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <div 
                    className="relative w-full bg-gray-100"
                    style={{ 
                      height: '80vh',
                      transform: `rotate{0}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <iframe
                      id="pdf-iframe"
                      src={pdfLink}
                      className="w-full h-full border-0"
                      style={{ 
                        transform: `scale(${1})`,
                        transformOrigin: 'top left',
                        width: `${10000 / 100}%`,
                        height: `${10000 / 100}%`
                      }}
                      title="FrugalSOT Research Paper"
                      onLoad={handlePdfLoad}
                      onError={handlePdfError}
                    />
                    
                    {/* Loading overlay */}
                    {!pdfLoaded && !pdfError && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-yellow-400 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                          <p>Loading PDF...</p>
                        </div>
                      </div>
                    )}

                    {/* Error overlay */}
                    {pdfError && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center text-yellow-400 p-6">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-red-400" />
                          <h3 className="text-lg font-medium mb-2">Unable to load PDF</h3>
                          <p className="text-gray-300 mb-4">The PDF file could not be displayed in the browser.</p>
                          <div className="flex gap-3 justify-center">
                            <Button onClick={handleRefresh} variant="outline" className="border-yellow-500 text-yellow-400">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry
                            </Button>
                            <Button asChild className="bg-yellow-500 text-black">
                              <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open in New Tab
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Paper Abstract */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-zinc-900 border-yellow-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3 text-yellow-400">
                      Abstract
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      In on-device NLP tasks, limited resources of embedded hardware, such as the Raspberry Pi 5, 
                      require efficient inference strategies. This paper introduces FrugalSOT (Frugal Search Over The Models), 
                      a resource-aware model selection architecture for on-device NLP inference. FrugalSOT estimates each 
                      request's complexity by extracting features such as prompt length, named entity density, and syntactic 
                      complexity. The request is first made to the least complex model that is likely to pass a relevance 
                      threshold. If the output of that model falls short of the threshold, the request is made to a more 
                      complex model.
                    </p>
                    
                    <h4 className="text-sm font-medium mb-2 text-yellow-400">Key Results</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Experimental results on Raspberry Pi 5 show that FrugalSOT reduces average inference time and overall 
                      computational resource use significantly compared to single-model approaches, achieving a 21.6% reduction 
                      in processing time with only a 2.3% decrease in relevance score.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Adaptive Model Selection",
                        "Resource-Constrained Inference", 
                        "Natural Language Processing",
                        "Raspberry Pi 5",
                        "Dynamic Thresholding",
                        "Edge Computing"
                      ].map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-500/20 py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/frugalsot_logo.png"
                  alt="FrugalSOT Logo"
                  className="h-6 w-6"
                />
                <div className="text-xl font-bold text-yellow-400">
                  Frugal<span className="text-white">SOT</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Efficient AI inference on resource-constrained devices.
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://github.com/HyperKuvid-Labs/FrugalSOT"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:hyperkuvidlabs@gmail.com?subject=FrugalSOT%20Inquiry&body=Hello%20FrugalSOT%20Team,%0A%0AI%20am%20interested%20in%20learning%20more%20about..."
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Gmail</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
