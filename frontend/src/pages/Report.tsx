import jsPDF from 'jspdf';

function Report(document: jsPDF) {
    const dataUrl = document.output('datauristring', { filename: 'Report' });
    const htmlContent = `
  <html>
  <head>
  <style>
      body {
        margin: 0;
      }
      iframe {
        border: none;
        background: transparent;
        width: 100%;
        height: 100%;
      }
    </style>
    <title>Report Preview</title>
  </head>
  <body>
    <script>
      function reloadWindow() {
        location.reload();
      }
    </script>
    <iframe src="${dataUrl}"></iframe>
  </body>
  </html>
`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url);
    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 300000);
    ;
};

export default Report;