import React from 'react';
import { renderToString } from 'react-dom/server';
import Prizes from './src/pages/Prizes';

try {
  const html = renderToString(<Prizes />);
  console.log("Rendered successfully!");
} catch (error) {
  console.error("Crash during render:", error);
}
