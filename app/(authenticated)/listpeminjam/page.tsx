"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Row, Button, Modal, Input, Upload, message, Select, Tag } from "antd";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Chart from 'chart.js/auto';
import type { UploadFile } from 'antd';

const { Option } = Select;

const listpeminjam: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);

  interface DataType {
    key: React.Key;
    nama: string;
    namapengguna : string;
    telp: number;
    nisn: string;
    status: string;
  }

  const initialData: DataType[] = [
    {
      key: '1',
      nama: 'John Brown',
      namapengguna: 'johnny',
      telp: 123456789,
      nisn: '1234567890',
      status: 'Diterima',
    },
    {
      key: '2',
      nama: 'Jim Green',
      namapengguna: 'jimmy',
      telp: 987654321,
      nisn: '0987654321',
      status: 'Ditolak',
    },
    {
      key: '3',
      nama: 'Joe Black',
      namapengguna: 'joey',
      telp: 543216789,
      nisn: '5432167890',
      status: 'Pending',
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleStatusChange = (value: string, dataIndex: number) => {
    const newData = [...data];
    newData[dataIndex].status = value;
    setData(newData);
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold'}}>Peminjam</h1>
      </div>
      <div style={{ marginTop: '30px'}}>
        {data.map((item, index) => (
          <div key={item.key} style={{ marginBottom: '20px' }}>
            <Card>
              <Row gutter={16}>
                <Col span={6}>
                  <Card.Meta
                    avatar={<Avatar src={"image 5.png"} />}
                    title={item.nama}
                    description={item.namapengguna}
                  />
                </Col>
                <Col span={6}>
                  <p>Telepon: {item.telp}</p>
                  <p>NISN: {item.nisn}</p>
                </Col>
                <Col span={6}>
                  <Select defaultValue={item.status} style={{ width: '100%' }} onChange={(value) => handleStatusChange(value, index)}>
                    <Option value="Diterima">Diterima</Option>
                    <Option value="Ditolak">Ditolak</Option>
                    <Option value="Pending">Pending</Option>
                  </Select>
                </Col>
              </Row>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default listpeminjam;
