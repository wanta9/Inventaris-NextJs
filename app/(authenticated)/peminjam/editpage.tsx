import Card from 'antd/es/card/Card';
import React from 'react';
import { useParams } from 'react-router-dom';

const EditPage = () => {
  const { key } = useParams<{ key: string }>();

  return (
    <div>
      <h1>Edit Page</h1>
      <p>Edit details for item with key: {key}</p>
      <Card>
        
      </Card>
    </div>
  );
};

export default EditPage;

