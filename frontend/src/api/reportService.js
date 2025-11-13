import axiosInstance from './axiosConfig';

export const downloadReport = async () => {
  try {
    const response = await axiosInstance.get('/reports/download', {
      responseType: 'blob', // <-- This is the crucial part!
    });

    // Create a new Blob object from the PDF data
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create a URL for the blob
    const fileUrl = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileUrl;

    // Extract filename from content-disposition header, or use a default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'Investify_Report.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute('download', filename);

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(fileUrl);

  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};