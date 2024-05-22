"use client";

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, Input, InputRef, Modal, Popconfirm, Row, Table, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const { Search } = Input;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  kodeBarang: string;
  namaBarang: string;
  letakBarang: string;
  harga: string;
  deskripsi: string;
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
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [editData, setEditData] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [letakBarangVisible, setLetakBarangVisible] = useState(false);
  const [letakBarangEditVisible, setLetakBarangEditVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [kodeBarang, setKodeBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [harga, setharga] = useState('');
  const [letakBarang, setLetakBarang] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    setDataSource(filteredData); // Menggunakan setDataSource untuk mengatur nilai initialData
  }, []);  
  
  const filteredData = dataSource.filter(item =>
    item.kodeBarang.toLowerCase().includes(searchText.toLowerCase()) ||
    item.namaBarang.toLowerCase().includes(searchText.toLowerCase()) ||
    item.letakBarang.toLowerCase().includes(searchText.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Menghilangkan semua karakter kecuali angka
    setharga(value);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };
  
  const handleModalCancel = () => {
    setModalVisible(false);
    setModalEditVisible(false);
    setNamaBarang('');
    setharga('');
    setDeskripsi('');
  };
  
  const handleSaveModalData = () => {
    if (!namaBarang || !harga || !deskripsi) {
      message.error('Semua kolom harus di isi.');
      return;
    }
  
    if (editData) {
      const newData = dataSource.map(item => {
        if (item.key === editData.key) {
          return { ...item, kodeBarang, namaBarang, letakBarang, harga };
        }
        return item;
      });
      setDataSource(newData);
      setModalEditVisible(false);
      setEditData(null);
    } else {
      const newData: Item = {
        key: count.toString(),
        kodeBarang,
        namaBarang,
        letakBarang,
        harga,
        deskripsi,
      };
      setDataSource([...dataSource, newData]);
      setCount(count + 1);
      setModalVisible(false);
    }
  };
  
  const handleDelete = (key: string) => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };
  
  const handleEdit = (record: Item) => {
    setEditData(record);
    setKodeBarang(record.kodeBarang);
    setNamaBarang(record.namaBarang);
    setDeskripsi(record.deskripsi);
    setDeskripsi(record.harga);
    setModalEditVisible(true);
  };
  
  

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    newData.splice(index, 1, {
      ...newData[index],
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
      handleSave,
    },
  };

  const columns : (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Kode Barang',
      dataIndex: 'kodeBarang',
      editable: true,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'namaBarang',
      editable: true,
    },
    {
      title: 'Letak Barang',
      dataIndex: 'letakBarang',
      editable: true,
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      editable: true,
    },
    {
      title: '',
      dataIndex: '',
      render: (record: Item) => {
        return (
          <span>
            <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
            <Popconfirm title="Hapus Barang" onConfirm={() => handleDelete(record.key)}>
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <title>Barang</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang</h1>
      <Card style={{marginTop: '100px'}}>
        <Button
          type="primary"
          onClick={handleButtonClick}
          icon={<PlusOutlined />}
          style={{ marginBottom: '16px', backgroundColor: 'white', color: 'black', display: 'flex', marginLeft: 'auto', right: '20px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}
        >
          Letak Barang
        </Button>
        <Button
          type="primary"
          onClick={handleButtonClick}
          icon={<PlusOutlined className="custom-icon" />}
          style={{ marginLeft: 'auto', display: 'flex', right: '20px', backgroundColor: 'white', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', color: 'black' }}
        >
          Barang
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={filteredData}
          columns={columns as ColumnTypes}
          style={{ marginTop: '30px' }}
        />
      </Card>
      <Modal
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tambah Barang</div>}
        style={{ textAlign: 'center' }}
        centered
        width={900}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel} style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveModalData} style={{ marginRight: '27px', backgroundColor: '#582DD2', color: 'white', borderColor: '#582DD2' }}>
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
          <Row gutter={[24, 24]} style={{ marginTop: '70px'}}>
            <Col span={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p>Nama Barang</p>
                    </Col>
                    <Col span={18}>
                      <Input
                        style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                        placeholder="Nama Barang"
                        value={namaBarang}
                        onChange={(e) => setNamaBarang(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p>Harga</p>
                    </Col>
                    <Col span={18}>
                      <Input
                        style={{ marginBottom: '12px', width: '75%', height: '40px' }}
                        addonBefore="Rp"
                        value={harga}
                        placeholder="harga"
                        onChange={handleHargaChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p style={{ marginBottom: '80px'}}>Deskripsi</p>
                    </Col>
                    <Col span={18}>
                      <Input.TextArea
                        style={{ marginBottom: '12px', width: '75%', height: '50%' }}
                        rows={4}
                        placeholder="Deskripsi Barang"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col>
                  <p style={{ marginLeft: '-40px', marginRight: '20px'}}>Unggah Foto</p>
                </Col>
                <Col>
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />} style={{ marginRight: '50px'}}>Unggah</Button>
                  </Upload>
                </Col>
              </Row>
            </Col>
          </Row>
      </Modal>
      <Modal
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit Barang</div>}
        style={{ textAlign: 'center' }}
        centered
        width={900}
        visible={modalEditVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel} style={{ backgroundColor: 'white', borderColor: 'black', color: 'black' }}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveModalData} style={{ marginRight: '27px', backgroundColor: '#582DD2', color: 'white', borderColor: '#582DD2' }}>
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
          <Row gutter={[24, 24]} style={{ marginTop: '70px'}}>
            <Col span={16}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p>Nama Barang</p>
                    </Col>
                    <Col span={18}>
                      <Input
                        style={{ marginBottom: '12px', width: '100%', height: '40px' }}
                        placeholder="Nama Barang"
                        value={namaBarang}
                        onChange={(e) => setNamaBarang(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p>Harga</p>
                    </Col>
                    <Col span={18}>
                      <Input
                        style={{ marginBottom: '12px', width: '100%', height: '40px' }}
                        addonBefore="Rp"
                        value={harga}
                        placeholder="harga"
                        onChange={handleHargaChange}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="middle">
                    <Col span={6}>
                      <p>Deskripsi</p>
                    </Col>
                    <Col span={18}>
                      <Input.TextArea
                        style={{ marginBottom: '12px', width: '100%', height: '80px' }}
                        placeholder="Deskripsi Barang"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={8}>
                  <p>Unggah Foto</p>
                </Col>
                <Col>
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Unggah</Button>
                  </Upload>
                </Col>
              </Row>
            </Col>
          </Row>
      </Modal>
      {/* Button Tambah Letak barang */}
      <Modal
        title="Tambah Letak Barang"
        visible={letakBarangVisible}
        centered
        style={{ textAlign: 'center' }}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveModalData} style={{ backgroundColor: '#582DD2' }}>
            Simpan
          </Button>,
        ]}
      >
        <Row gutter={[24, 24]} style={{ marginTop: '50px', marginBottom: '20px' }}>
          <Col span={6}>
            <p>Letak Barang</p>
          </Col>
          <Col span={18}>
            <Input
              value={letakBarang}
              onChange={(e) => setLetakBarang(e.target.value)}
              placeholder="Masukkan letak barang"
              className="uppercase-input"
            />
          </Col>
        </Row>
      </Modal>
      <Modal
        title="Edit Letak Barang"
        visible={letakBarangEditVisible}
        centered
        style={{ textAlign: 'center' }}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveModalData} style={{ backgroundColor: '#582DD2' }}>
            Simpan
          </Button>,
        ]}
      >
        <Row gutter={[24, 24]} style={{ marginTop: '50px', marginBottom: '20px' }}>
          <Col span={6}>
            <p>Letak Barang</p>
          </Col>
          <Col span={18}>
            <Input
              value={letakBarang}
              onChange={(e) => setLetakBarang(e.target.value)}
              placeholder="Masukkan letak barang"
              className="uppercase-input"
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
export default Page;
