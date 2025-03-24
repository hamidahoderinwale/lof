<script>
  import { onMount } from 'svelte';
  import { fetchDocuments } from './lib/api.js';
  let documents = [];

  onMount(async () => {
    documents = await fetchDocuments();
  });
</script>

<main>
  <h1>📚 Loaf Uploads</h1>
  <ul>
    {#each documents as doc}
      <li>
        <a href={`/uploads/${doc.file}`} target="_blank"><strong>{doc.file}</strong></a>
        — {doc.description}<br />
        <small>{doc.uploadedAt}</small><br />
        <em>Tags: {doc.tags.join(', ')}</em>
      </li>
    {/each}
  </ul>
</main>

<style>
  main { font-family: sans-serif; padding: 2rem; }
  ul { list-style: none; padding: 0; }
  li { margin-bottom: 1.5rem; }
</style>
