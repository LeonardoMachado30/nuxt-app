<script setup>
import {ref} from 'vue';

const fileInput = ref(null);

const convertWordToPdf = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/convert-word-to-pdf', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    alert('Erro na conversão');
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.pdf';
  a.click();
};

const convertPdfToWord = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/convert-pdf-to-word', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    alert('Erro na conversão');
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.pdf';
  a.click();
};
</script>

<template>

  <section>
    <div>
      <p>Word to PDF</p>
      <input ref="fileInput" type="file" accept=".docx" @change="convertWordToPdf"/>
    </div>
    <div>
      <p>PDF to Word</p>
      <input ref="fileInput" type="file" accept=".pdf" @change="convertPdfToWord"/>
    </div>
  </section>
</template>
