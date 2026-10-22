/**
 * Client-side file download.
 *
 * Ported from `parent-portal.js`, which built a Blob, created an object URL and
 * clicked a temporary anchor. The logic is unchanged — it just lives in one
 * reusable place instead of being inlined per action.
 */

export function downloadTextFile(fileName: string, body: string): void {
  const blob = new Blob([body], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
