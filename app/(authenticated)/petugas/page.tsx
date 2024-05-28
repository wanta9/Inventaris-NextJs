'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
  Row,
  Col,
  Card,
  Dropdown,
  Menu,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { InputRef } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Search } = Input;
const { Item } = Menu;

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
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [searchText, setSearchText] = useState('');

  // menu akun
  const menu = (
    <Menu>
      <Item key="1">
        <a
          style={{ color: 'red' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    setDataSource(filteredData); // Menggunakan setDataSource untuk mengatur nilai initialData
  }, []);

  const filteredData = dataSource.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = (info: any) => {
    let fileList = [...info.fileList];

    // Limit to one file
    fileList = fileList.slice(-1);

    // Handle upload status
    fileList = fileList.map((file) => {
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
    setModalEditVisible(false);
    setNama('');
    setNamaPengguna('');
    setNIP('');
    setTelp('');
  };

  const handleSaveModalData = () => {
    if (!nama || !nip || !telp || !namaPengguna || !sandi || !konfirmasiSandi) {
      // Menampilkan pesan kesalahan di sebelah input yang kosong
      if (!nama) {
        message.error('Nama harus diisi.');
      }
      if (!nip) {
        message.error('NIP harus diisi.');
      }
      if (!telp) {
        message.error('Nomor telepon harus diisi.');
      }
      if (!namaPengguna) {
        message.error('Nama pengguna harus diisi.');
      }
      if (!sandi) {
        message.error('sandi harus diisi.');
      }
      if (!konfirmasiSandi) {
        message.error('konfirmasi Sandi harus diisi.');
      }
      return;
    }

    if (editData) {
      const newData = dataSource.map((item) => {
        if (item.key === editData.key) {
          return { ...item, name: nama, username: namaPengguna, telp, nip };
        }
        return item;
      });
      setDataSource(newData);
      setModalEditVisible(false);
      setEditData(null);
      // Reset state nilai input setelah penyimpanan berhasil
      setNama('');
      setNamaPengguna('');
      setNIP('');
      setTelp('');
    } else {
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
      setModalEditVisible(false);
      // Reset state nilai input setelah penyimpanan berhasil
      setNamaPengguna('');
      setNIP('');
      setTelp('');
    }
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleEdit = (record: DataType) => {
    setEditData(record);
    setNama(record.name);
    setNamaPengguna(record.username);
    setNIP(record.nip);
    setTelp(record.telp);
    setModalEditVisible(true);
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
            <Button type="link" onClick={() => handleEdit(record.key)} icon={<EditOutlined />} />
            <Popconfirm title="Hapus Akun" onConfirm={() => handleDelete(record.key)}>
              <DeleteOutlined />
            </Popconfirm>
          </span>
        ) : null,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

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

  return (
    <div>
      <title>Petugas</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Petugas</h1>
      <Card style={{ marginTop: '100px', borderRadius: '20px' }}>
        <Search
          placeholder="Telusuri Petugas"
          allowClear
          enterButton
          onSearch={(value) => handleSearch(value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          onClick={handleButtonClick}
          icon={<PlusOutlined className="custom-icon" />}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            bottom: '25px',
            right: '20px',
            backgroundColor: 'white',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
            color: 'black',
          }}
          className="custom-button"
        >
          Akun Petugas
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredData}
          columns={columns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
        <Modal
          title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Akun Petugas</div>}
          style={{ textAlign: 'center' }}
          centered
          width={900}
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={[
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}
            >
              Batal
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveModalData}
              style={{
                marginRight: '27px',
                backgroundColor: '#582DD2',
                color: 'white',
                borderColor: '#582DD2',
              }}
            >
              Simpan
            </Button>,
          ]}
          maskStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                    <p style={{ right: '20px' }}>Sandi</p>
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
        <Modal
          title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Akun Petugas</div>}
          style={{ textAlign: 'center' }}
          width={900}
          centered
          visible={modalEditVisible}
          onCancel={handleModalCancel}
          footer={[
            <Button key="cancel" onClick={handleModalCancel}>
              Batal
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveModalData}
              style={{ marginRight: '27px' }}
            >
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
                    <p>Nama Pengguna</p>
                  </Col>
                  <Col span={16}>
                    <Input
                      style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                      placeholder="Nama Pengguna"
                      value={namaPengguna}
                      onChange={(e) => setNamaPengguna(e.target.value)}
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
              </Col>
            </Row>
          </div>
        </Modal>
      </Card>
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Dropdown overlay={menu} placement="bottomCenter">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{
                width: '175px',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="ikon.png"
                  style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                />
                <div>
                  <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                    Halo, Elisabet
                  </div>
                  <div style={{ fontSize: '12px', color: 'grey ', marginRight: '47px' }}>Admin</div>
                </div>
              </div>
            </Button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Page;
