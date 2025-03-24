export async function fetchDocuments() {
    const res = await fetch('/documents.json');
    return await res.json();
  }
  