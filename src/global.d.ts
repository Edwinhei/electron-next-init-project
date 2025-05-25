// src/global.d.ts
interface Window {
    electronAPI: {
      sayHello: (name: string) => Promise<string>;
      sendAnotherMessage: (message: string) => void;
      onReplyToAnotherMessage: (callback: (message: string) => void) => void;
    };
  }