import healthHandler from './health.js';
import hdbHandler from './hdb.js';
import uraHandler from './ura.js';
import onemapHandler from './onemap.js';
import insightsHandler from './insights.js';
import geminiHandler from './gemini.js';

export {
  healthHandler,
  hdbHandler,
  uraHandler,
  onemapHandler,
  insightsHandler,
  geminiHandler
};

export default {
  health: healthHandler,
  hdb: hdbHandler,
  ura: uraHandler,
  onemap: onemapHandler,
  insights: insightsHandler,
  gemini: geminiHandler
};
