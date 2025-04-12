import React from 'react';

const ProtoUploader = ({ setProtoContent }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    setProtoContent(text); // Pass content up to App
  };

  return (
    <div>
      <label>Upload .proto file:</label>
      <input type="file" onChange={handleUpload} accept=".proto" />
    </div>
  );
};

export default ProtoUploader;
