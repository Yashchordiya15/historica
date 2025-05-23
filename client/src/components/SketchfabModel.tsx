import React, { useEffect, useRef } from 'react';

interface SketchfabModelProps {
  modelId: string;
  width?: string;
  height?: string;
  autoLoad?: boolean;
  preload?: boolean;
  className?: string;
}

const SketchfabModel: React.FC<SketchfabModelProps> = ({
  modelId,
  width = '100%',
  height = '400px',
  autoLoad = false,
  preload = false,
  className = '',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Don't load twice
    if (loadedRef.current) return;
    
    // Only load if autoLoad is true or if preload is true
    if (!autoLoad && !preload) return;
    
    loadedRef.current = true;
    
    // Make sure iframe exists
    if (!iframeRef.current) return;
    
    // Set the src to load the Sketchfab model
    iframeRef.current.src = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_annotations=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_hint=0&ui_hint_visible=0&preload=1&transparent=1&ui_title=0&ui_loading=0`;
  }, [modelId, autoLoad, preload]);

  const handleLoad = () => {
    if (!autoLoad && !preload && !loadedRef.current) {
      loadedRef.current = true;
      if (iframeRef.current) {
        iframeRef.current.src = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_annotations=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_hint=0&ui_hint_visible=0&preload=1&transparent=1&ui_title=0&ui_loading=0`;
      }
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        title={`Sketchfab Model ${modelId}`}
        className="w-full h-full"
        style={{ width, height }}
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        src={autoLoad || preload ? `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_annotations=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_hint=0&ui_hint_visible=0&preload=1&transparent=1&ui_title=0&ui_loading=0` : ''}
        onLoad={handleLoad}
      ></iframe>
    </div>
  );
};

export default SketchfabModel;