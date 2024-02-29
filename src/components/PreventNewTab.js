import React, { useEffect } from 'react';

function PreventNewTab() {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (
      e.key === 'ContextMenu' ||
      (e.shiftKey && e.key === 'F10') ||
      (e.shiftKey && e.key === 'Enter') ||
      (e.ctrlKey && e.key === 'Enter')
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <></>;
}
export default PreventNewTab;
