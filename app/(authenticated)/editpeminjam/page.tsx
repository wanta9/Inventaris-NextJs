"use client";

import { Button, Card } from 'antd';
import React from 'react';
import {  ArrowLeftOutlined } from '@ant-design/icons';

const editpeminjam = () => {
  return (
    <div style={{ marginLeft: '50px'}}>
      <title>Edit Peminjam</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px'}}>Edit Peminjam</h1>
      <Card style={{ marginTop: '30px',  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', width: '50%'}}>
        
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '50%'}}>
        <Button style={{ marginTop: '20px', backgroundColor: '#582DD2', color: 'white' }}>
          <a href='http://localhost:3001/peminjam'><ArrowLeftOutlined style={{ marginRight: '10px' }} />Kembali</a>
        </Button>
      </div>  
    </div>
  );
}

export default editpeminjam;

