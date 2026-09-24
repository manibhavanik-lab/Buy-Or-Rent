import { checkApiHealth, renderHealthHtml } from './health/index.ts';

export default async function handler(req, res) {
  const simulateFail = req.query?.simulate === '503' || req.query?.simulate === 'fail';
  const { httpCode, data } = await checkApiHealth({ simulateFail });

  // If client explicitly requests HTML
  const wantsHtml = req.query?.format === 'html' || (
    req.headers?.accept?.includes('text/html') &&
    !req.headers?.accept?.includes('application/json') &&
    req.query?.format !== 'json' &&
    !req.xhr
  );

  if (wantsHtml) {
    res.status(httpCode);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(renderHealthHtml(data, httpCode));
  }

  // Standard JSON response matching required format:
  // 200 when healthy, 503 when not
  res.status(httpCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json(data);
}
