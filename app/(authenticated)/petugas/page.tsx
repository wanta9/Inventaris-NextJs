"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, Upload, message, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { GetRef, InputRef } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  username: string;
  telp: string;
  nip: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
  handleEdit: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleEdit,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  username: string;
  telp: string;
  nip: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Page: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);

  const [nama, setNama] = useState('');
  const [nip, setNIP] = useState('');
  const [telp, setTelp] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);

  const handleChange = (info: any) => {
    let fileList = [...info.fileList];

    // Limit to one file
    fileList = fileList.slice(-1);

    // Handle upload status
    fileList = fileList.map(file => {
      if (file.response) {
        // Handle server response
        if (file.response.status === 'success') {
          file.url = file.response.url; // Set URL if upload is successful
        } else {
          // Show error message if upload fails
          message.error(`${file.name} upload failed: ${file.response.message}`);
          fileList = [];
        }
      }
      return file;
    });

    setFileList(fileList);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };
  
  const handleSaveModalData = () => {
    const newData: DataType = {
      key: count.toString(),
      name: nama,
      username: namaPengguna,
      telp: telp,
      nip: nip,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    setModalVisible(false);
  };
  
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  
  const handleEdit = (record: DataType) => {
    setEditData(record); // Set data yang akan di-edit ke dalam state
    setNama(record.name); // Set nilai nama ke state
    setNamaPengguna(record.username); // Set nilai nama pengguna ke state
    setNIP(record.nip); // Set nilai NIP ke state
    setTelp(record.telp); // Set nilai telepon ke state
    setModalVisible(true); // Tampilkan modal
  };

const handleSaveEditData = () => {
  if (editData) {
    const newData = dataSource.map(item => {
      if (item.key === editData.key) {
        return { ...item, name: nama, username: namaPengguna, telp, nip };
      }
      return item;
    });
    setDataSource(newData);
    setModalVisible(false);
    setEditData(null); // Reset data yang di-edit
    // Tidak perlu mereset nilai input
  }
};
  
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Nama',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'Nama Pengguna',
      dataIndex: 'username',
      width: '20%',
      editable: true,
    },
    {
      title: 'Telp',
      dataIndex: 'telp',
      width: '20%',
      editable: true,
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      width: '20%',
      editable: true,
    },
    {
      title: '',
      dataIndex: '',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <span>
            <a onClick={() => handleEdit(record.key)}><EditOutlined /></a> {/* Tambahkan tombol edit */}
            <Popconfirm title="Hapus Akun" onConfirm={() => handleDelete(record.key)}>
              <DeleteOutlined />
            </Popconfirm>
          </span>
        ) : null,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Dashboard</h1>
      <Button
        type="primary"
        onClick={handleButtonClick}
        icon={<PlusOutlined />}
        style={{ marginTop: '90px', marginLeft: '110px' }}
      >
        Akun Petugas
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
      <Modal
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Buat Akun Petugas</div>}
        style={{ textAlign: 'center' }}
        width={900}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveModalData} style={{ marginRight: '27px' }}>
            Simpan
          </Button>,
        ]}
        maskStyle={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
        }}
      >
        <div style={{ marginTop: '70px', marginRight: '70px' }}>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Row align="middle">
                <Col span={8}>
                  <p>Nama</p>
                </Col>
                <Col>
                  <Input
                    style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                    placeholder="Nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={8}>
                  <p>NIP</p>
                </Col>
                <Col>
                  <Input
                    style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                    type="string"
                    placeholder="NIP"
                    value={nip}
                    onChange={(e) => setNIP(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={8}>
                  <p>Telp</p>
                </Col>
                <Col>
                  <Input
                    style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                    type="string"
                    placeholder="Telp"
                    value={telp}
                    onChange={(e) => setTelp(e.target.value)}
                    maxLength={12}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <p>Unggah Foto</p>
                </Col>
                <Col>
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                    fileList={fileList}
                    onChange={handleChange}
                  >
                    <Button icon={<UploadOutlined />}>Unggah</Button>
                  </Upload>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row align="middle">
                <Col span={8}>
                  <p>Nama Pengguna</p>
                </Col>
                <Col span={16}>
                  <Input
                    style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                    placeholder="Nama Pengguna"
                    value={namaPengguna}
                    onChange={(e) => setNamaPengguna(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={8}>
                  <p>Sandi</p>
                </Col>
                <Col span={16}>
                  <Input.Password
                    style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                    placeholder="Sandi"
                    value={sandi}
                    onChange={(e) => setSandi(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={8}>
                  <p>Konfirmasi Sandi</p>
                </Col>
                <Col span={16}>
                  <Input.Password
                    style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                    placeholder="Konfirmasi Sandi"
                    value={konfirmasiSandi}
                    onChange={(e) => setKonfirmasiSandi(e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
